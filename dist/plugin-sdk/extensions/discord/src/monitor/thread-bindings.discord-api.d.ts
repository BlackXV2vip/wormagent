import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import { type ThreadBindingRecord } from "./thread-bindings.types.js";
export declare function isThreadArchived(raw: unknown): boolean;
export declare function summarizeDiscordError(err: unknown): string;
export declare function isDiscordThreadGoneError(err: unknown): boolean;
export declare function maybeSendBindingMessage(params: {
    cfg?: WormAgentConfig;
    record: ThreadBindingRecord;
    text: string;
    preferWebhook?: boolean;
}): Promise<void>;
export declare function createWebhookForChannel(params: {
    cfg?: WormAgentConfig;
    accountId: string;
    token?: string;
    channelId: string;
}): Promise<{
    webhookId?: string;
    webhookToken?: string;
}>;
export declare function findReusableWebhook(params: {
    accountId: string;
    channelId: string;
}): {
    webhookId?: string;
    webhookToken?: string;
};
export declare function resolveChannelIdForBinding(params: {
    cfg?: WormAgentConfig;
    accountId: string;
    token?: string;
    threadId: string;
    channelId?: string;
}): Promise<string | null>;
export declare function createThreadForBinding(params: {
    cfg?: WormAgentConfig;
    accountId: string;
    token?: string;
    channelId: string;
    threadName: string;
}): Promise<string | null>;
