import type { SpeechProviderPlugin } from "../../plugins/types.js";
import type { SpeechVoiceOption } from "../provider-types.js";
export declare function listElevenLabsVoices(params: {
    apiKey: string;
    baseUrl?: string;
}): Promise<SpeechVoiceOption[]>;
export declare function buildElevenLabsSpeechProvider(): SpeechProviderPlugin;
