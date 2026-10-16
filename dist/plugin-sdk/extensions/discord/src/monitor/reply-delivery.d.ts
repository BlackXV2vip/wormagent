import type { RequestClient } from "@buape/carbon";
import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import type { MarkdownTableMode, ReplyToMode } from "wormagent/plugin-sdk/config-runtime";
import type { ChunkMode } from "wormagent/plugin-sdk/reply-runtime";
import type { ReplyPayload } from "wormagent/plugin-sdk/reply-runtime";
import type { RuntimeEnv } from "wormagent/plugin-sdk/runtime-env";
export type DiscordThreadBindingLookupRecord = {
    accountId: string;
    threadId: string;
    agentId: string;
    label?: string;
    webhookId?: string;
    webhookToken?: string;
};
export type DiscordThreadBindingLookup = {
    listBySessionKey: (targetSessionKey: string) => DiscordThreadBindingLookupRecord[];
    touchThread?: (params: {
        threadId: string;
        at?: number;
        persist?: boolean;
    }) => unknown;
};
export declare function deliverDiscordReply(params: {
    cfg: WormAgentConfig;
    replies: ReplyPayload[];
    target: string;
    token: string;
    accountId?: string;
    rest?: RequestClient;
    runtime: RuntimeEnv;
    textLimit: number;
    maxLinesPerMessage?: number;
    replyToId?: string;
    replyToMode?: ReplyToMode;
    tableMode?: MarkdownTableMode;
    chunkMode?: ChunkMode;
    sessionKey?: string;
    threadBindings?: DiscordThreadBindingLookup;
    mediaLocalRoots?: readonly string[];
}): Promise<void>;
