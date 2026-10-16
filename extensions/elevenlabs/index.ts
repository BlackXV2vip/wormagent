import { definePluginEntry } from "wormagent/plugin-sdk/core";
import { buildElevenLabsSpeechProvider } from "wormagent/plugin-sdk/speech";

export default definePluginEntry({
  id: "elevenlabs",
  name: "ElevenLabs Speech",
  description: "Bundled ElevenLabs speech provider",
  register(api) {
    api.registerSpeechProvider(buildElevenLabsSpeechProvider());
  },
});
