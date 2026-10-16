import type { WormAgentConfig } from "../../../config/config.js";
import type { OutboundSendDeps } from "../../../infra/outbound/deliver.js";
import type { ChannelOutboundAdapter } from "../types.js";
type DirectSendOptions = {
    cfg: WormAgentConfig;
    accountId?: string | null;
    replyToId?: string | null;
    mediaUrl?: string;
    mediaLocalRoots?: readonly string[];
    maxBytes?: number;
};
type DirectSendResult = {
    messageId: string;
    [key: string]: unknown;
};
type DirectSendFn<TOpts extends Record<string, unknown>, TResult extends DirectSendResult> = (to: string, text: string, opts: TOpts) => Promise<TResult>;
type SendPayloadContext = Parameters<NonNullable<ChannelOutboundAdapter["sendPayload"]>>[0];
type SendPayloadResult = Awaited<ReturnType<NonNullable<ChannelOutboundAdapter["sendPayload"]>>>;
type SendPayloadAdapter = Pick<ChannelOutboundAdapter, "sendMedia" | "sendText" | "chunker" | "textChunkLimit">;
export declare function resolvePayloadMediaUrls(payload: SendPayloadContext["payload"]): string[];
export declare function sendPayloadMediaSequence<TResult>(params: {
    text: string;
    mediaUrls: readonly string[];
    send: (input: {
        text: string;
        mediaUrl: string;
        index: number;
        isFirst: boolean;
    }) => Promise<TResult>;
}): Promise<TResult | undefined>;
export declare function sendPayloadMediaSequenceOrFallback<TResult>(params: {
    text: string;
    mediaUrls: readonly string[];
    send: (input: {
        text: string;
        mediaUrl: string;
        index: number;
        isFirst: boolean;
    }) => Promise<TResult>;
    fallbackResult: TResult;
    sendNoMedia?: () => Promise<TResult>;
}): Promise<TResult>;
export declare function sendPayloadMediaSequenceAndFinalize<TMediaResult, TResult>(params: {
    text: string;
    mediaUrls: readonly string[];
    send: (input: {
        text: string;
        mediaUrl: string;
        index: number;
        isFirst: boolean;
    }) => Promise<TMediaResult>;
    finalize: () => Promise<TResult>;
}): Promise<TResult>;
export declare function sendTextMediaPayload(params: {
    channel: string;
    ctx: SendPayloadContext;
    adapter: SendPayloadAdapter;
}): Promise<SendPayloadResult>;
export declare function resolveScopedChannelMediaMaxBytes(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
    resolveChannelLimitMb: (params: {
        cfg: WormAgentConfig;
        accountId: string;
    }) => number | undefined;
}): number | undefined;
export declare function createScopedChannelMediaMaxBytesResolver(channel: "imessage" | "signal"): (params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}) => number | undefined;
export declare function createDirectTextMediaOutbound<TOpts extends Record<string, unknown>, TResult extends DirectSendResult>(params: {
    channel: "imessage" | "signal";
    resolveSender: (deps: OutboundSendDeps | undefined) => DirectSendFn<TOpts, TResult>;
    resolveMaxBytes: (params: {
        cfg: WormAgentConfig;
        accountId?: string | null;
    }) => number | undefined;
    buildTextOptions: (params: DirectSendOptions) => TOpts;
    buildMediaOptions: (params: DirectSendOptions) => TOpts;
}): ChannelOutboundAdapter;
export {};
