import { type WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
export declare function resolveDiscordDraftStreamingChunking(cfg: WormAgentConfig | undefined, accountId?: string | null): {
    minChars: number;
    maxChars: number;
    breakPreference: "paragraph" | "newline" | "sentence";
};
