import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
type DiscordAudioAttachment = {
    content_type?: string;
    url?: string;
};
export declare function resolveDiscordPreflightAudioMentionContext(params: {
    message: {
        attachments?: DiscordAudioAttachment[];
        content?: string;
    };
    isDirectMessage: boolean;
    shouldRequireMention: boolean;
    mentionRegexes: RegExp[];
    cfg: WormAgentConfig;
    abortSignal?: AbortSignal;
}): Promise<{
    hasAudioAttachment: boolean;
    hasTypedText: boolean;
    transcript?: string;
}>;
export {};
