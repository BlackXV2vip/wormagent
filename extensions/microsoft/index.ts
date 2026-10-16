import { definePluginEntry } from "wormagent/plugin-sdk/core";
import { buildMicrosoftSpeechProvider } from "wormagent/plugin-sdk/speech";

export default definePluginEntry({
  id: "microsoft",
  name: "Microsoft Speech",
  description: "Bundled Microsoft speech provider",
  register(api) {
    api.registerSpeechProvider(buildMicrosoftSpeechProvider());
  },
});
