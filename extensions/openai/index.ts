import { definePluginEntry } from "wormagent/plugin-sdk/core";
import { buildOpenAIImageGenerationProvider } from "wormagent/plugin-sdk/image-generation";
import { buildOpenAISpeechProvider } from "wormagent/plugin-sdk/speech";
import { openaiMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { buildOpenAICodexProviderPlugin } from "./openai-codex-provider.js";
import { buildOpenAIProvider } from "./openai-provider.js";

export default definePluginEntry({
  id: "openai",
  name: "OpenAI Provider",
  description: "Bundled OpenAI provider plugins",
  register(api) {
    api.registerProvider(buildOpenAIProvider());
    api.registerProvider(buildOpenAICodexProviderPlugin());
    api.registerSpeechProvider(buildOpenAISpeechProvider());
    api.registerMediaUnderstandingProvider(openaiMediaUnderstandingProvider);
    api.registerImageGenerationProvider(buildOpenAIImageGenerationProvider());
  },
});
