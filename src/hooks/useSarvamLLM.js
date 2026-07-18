import { useState } from 'react';

const API_KEY = import.meta.env.VITE_SARVAM_API_KEY;

export default function useSarvamLLM() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * @param {object[]} messages  — full message array including system prompt
   * @param {object[]|null} tools — TOOL_DEFINITIONS, or null for text-only responses
   * @param {'required'|'auto'|'none'} toolChoice
   *   'required' → model MUST call a tool (use for the first turn)
   *   'none'     → model MUST NOT call tools; produce text (use for follow-up after tool)
   *   'auto'     → model decides (fallback only)
   */
  const complete = async (messages, tools = null, toolChoice = 'auto') => {
    setIsLoading(true);
    setError(null);

    try {
      const body = {
        model: 'sarvam-105b',
        messages,
        temperature: 0.1,
        reasoning_effort: 'high',
        max_tokens: 512,
      };

      if (tools?.length) {
        body.tools = tools;
        body.tool_choice = toolChoice;
      }
      // If no tools provided, omit tools + tool_choice entirely → text response only

      const res = await fetch('https://api.sarvam.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': API_KEY,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('LLM error:', res.status, errText);
        throw new Error(`LLM HTTP ${res.status}`);
      }

      const data = await res.json();
      const choice = data.choices?.[0];
      const message = choice?.message;

      setIsLoading(false);
      return {
        content: message?.content || null,
        tool_calls: message?.tool_calls || null,
        rawMessage: message,
      };
    } catch (err) {
      setIsLoading(false);
      setError('Thodi problem hui. Dobara bolein.');
      throw err;
    }
  };

  // Streaming variant: calls onArgChunk(fullArgBuffer) each time new tool-call argument bytes arrive.
  // Falls back gracefully if the API doesn't stream — caller should try/catch and fall back to complete().
  const completeStream = async (messages, tools = null, toolChoice = 'auto', onArgChunk) => {
    setIsLoading(true);
    setError(null);
    try {
      const body = {
        model: 'sarvam-105b',
        messages,
        temperature: 0.1,
        reasoning_effort: 'high',
        max_tokens: 512,
        stream: true,
      };
      if (tools?.length) { body.tools = tools; body.tool_choice = toolChoice; }

      const res = await fetch('https://api.sarvam.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-subscription-key': API_KEY },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let sseBuffer = '', argBuffer = '', toolName = null, toolId = null;

      outer: while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        sseBuffer += dec.decode(value, { stream: true });
        const lines = sseBuffer.split('\n');
        sseBuffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break outer;
          try {
            const chunk = JSON.parse(raw);
            const delta = chunk.choices?.[0]?.delta;
            if (delta?.tool_calls?.[0]) {
              const tc = delta.tool_calls[0];
              if (tc.id) toolId = tc.id;
              if (tc.function?.name) toolName = tc.function.name;
              if (tc.function?.arguments) {
                argBuffer += tc.function.arguments;
                onArgChunk?.(argBuffer);
              }
            }
          } catch {}
        }
      }

      setIsLoading(false);
      const tcId = toolId || 'tc_stream';
      const rawMessage = toolName
        ? { role: 'assistant', content: null, tool_calls: [{ id: tcId, type: 'function', function: { name: toolName, arguments: argBuffer } }] }
        : { role: 'assistant', content: argBuffer };
      return {
        content: toolName ? null : argBuffer,
        tool_calls: toolName ? [{ id: tcId, type: 'function', function: { name: toolName, arguments: argBuffer } }] : null,
        rawMessage,
      };
    } catch (err) {
      setIsLoading(false);
      setError('Thodi problem hui. Dobara bolein.');
      throw err;
    }
  };

  return { isLoading, error, complete, completeStream };
}
