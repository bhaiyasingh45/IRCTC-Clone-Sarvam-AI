// AudioWorkletProcessor for raw PCM capture — replaces deprecated ScriptProcessorNode
class PCMProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0]?.[0];
    if (input?.length) {
      // Transfer a copy of the channel data to the main thread
      this.port.postMessage(new Float32Array(input));
    }
    return true; // keep processor alive
  }
}

registerProcessor('pcm-processor', PCMProcessor);
