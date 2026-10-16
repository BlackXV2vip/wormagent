import type { WormAgentConfig } from "./config.js";
import type { MarkdownTableMode } from "./types.base.js";
export declare const DEFAULT_TABLE_MODES: Map<string, MarkdownTableMode>;
export declare function resolveMarkdownTableMode(params: {
    cfg?: Partial<WormAgentConfig>;
    channel?: string | null;
    accountId?: string | null;
}): MarkdownTableMode;
