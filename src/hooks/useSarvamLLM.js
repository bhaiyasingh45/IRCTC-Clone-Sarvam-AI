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
        model: 'sarvam-30b',
        messages,
        temperature: 0.1,
        reasoning_effort: 'low',  // default is "medium" — saves tokens/latency for voice
        max_tokens: 512,          // reasoning tokens count toward this; cap prevents null content
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

  return { isLoading, error, complete };
}
