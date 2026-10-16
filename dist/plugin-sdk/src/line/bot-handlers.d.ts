import type { WebhookEvent } from "@line/bot-sdk";
import { type HistoryEntry } from "../auto-reply/reply/history.js";
import type { WormAgentConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import { type LineInboundContext } from "./bot-message-context.js";
import type { ResolvedLineAccount } from "./types.js";
export interface LineHandlerContext {
    cfg: WormAgentConfig;
    account: ResolvedLineAccount;
    runtime: RuntimeEnv;
    mediaMaxBytes: number;
    processMessage: (ctx: LineInboundContext) => Promise<void>;
    replayCache?: LineWebhookReplayCache;
    groupHistories?: Map<string, HistoryEntry[]>;
    historyLimit?: number;
}
export type LineWebhookReplayCache = {
    seenEvents: Map<string, number>;
    inFlightEvents: Map<string, Promise<void>>;
    lastPruneAtMs: number;
};
export declare function createLineWebhookReplayCache(): LineWebhookReplayCache;
export declare function handleLineWebhookEvents(events: WebhookEvent[], context: LineHandlerContext): Promise<void>;
