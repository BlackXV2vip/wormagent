import type { SpeechProviderPlugin } from "../../plugins/types.js";
import type { SpeechVoiceOption } from "../provider-types.js";
export declare function listMicrosoftVoices(): Promise<SpeechVoiceOption[]>;
export declare function buildMicrosoftSpeechProvider(): SpeechProviderPlugin;
