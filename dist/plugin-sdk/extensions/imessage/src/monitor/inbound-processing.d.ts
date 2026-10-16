import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import { type EnvelopeFormatOptions } from "wormagent/plugin-sdk/reply-runtime";
import { type HistoryEntry } from "wormagent/plugin-sdk/reply-runtime";
import { finalizeInboundContext } from "wormagent/plugin-sdk/reply-runtime";
import { resolveAgentRoute } from "wormagent/plugin-sdk/routing";
import type { SelfChatCache } from "./self-chat-cache.js";
import type { MonitorIMessageOpts, IMessagePayload } from "./types.js";
type IMessageReplyContext = {
    id?: string;
    body: string;
    sender?: string;
};
export type IMessageInboundDispatchDecision = {
    kind: "dispatch";
    isGroup: boolean;
    chatId?: number;
    chatGuid?: string;
    chatIdentifier?: string;
    groupId?: string;
    historyKey?: string;
    sender: string;
    senderNormalized: string;
    route: ReturnType<typeof resolveAgentRoute>;
    bodyText: string;
    createdAt?: number;
    replyContext: IMessageReplyContext | null;
    effectiveWasMentioned: boolean;
    commandAuthorized: boolean;
    effectiveDmAllowFrom: string[];
    effectiveGroupAllowFrom: string[];
};
export type IMessageInboundDecision = {
    kind: "drop";
    reason: string;
} | {
    kind: "pairing";
    senderId: string;
} | IMessageInboundDispatchDecision;
export declare function resolveIMessageInboundDecision(params: {
    cfg: WormAgentConfig;
    accountId: string;
    message: IMessagePayload;
    opts?: Pick<MonitorIMessageOpts, "requireMention">;
    messageText: string;
    bodyText: string;
    allowFrom: string[];
    groupAllowFrom: string[];
    groupPolicy: string;
    dmPolicy: string;
    storeAllowFrom: string[];
    historyLimit: number;
    groupHistories: Map<string, HistoryEntry[]>;
    echoCache?: {
        has: (scope: string, lookup: {
            text?: string;
            messageId?: string;
        }) => boolean;
    };
    selfChatCache?: SelfChatCache;
    logVerbose?: (msg: string) => void;
}): IMessageInboundDecision;
export declare function buildIMessageInboundContext(params: {
    cfg: WormAgentConfig;
    decision: IMessageInboundDispatchDecision;
    message: IMessagePayload;
    envelopeOptions?: EnvelopeFormatOptions;
    previousTimestamp?: number;
    remoteHost?: string;
    media?: {
        path?: string;
        type?: string;
        paths?: string[];
        types?: Array<string | undefined>;
    };
    historyLimit: number;
    groupHistories: Map<string, HistoryEntry[]>;
}): {
    ctxPayload: ReturnType<typeof finalizeInboundContext>;
    fromLabel: string;
    chatTarget?: string;
    imessageTo: string;
    inboundHistory?: Array<{
        sender: string;
        body: string;
        timestamp?: number;
    }>;
};
export declare function buildIMessageEchoScope(params: {
    accountId: string;
    isGroup: boolean;
    chatId?: number;
    sender: string;
}): string;
export declare function describeIMessageEchoDropLog(params: {
    messageText: string;
    messageId?: string;
}): string;
export {};
