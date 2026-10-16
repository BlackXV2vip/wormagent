import type { WormAgentConfig } from "./config.js";
export declare function resolveChannelCapabilities(params: {
    cfg?: Partial<WormAgentConfig>;
    channel?: string | null;
    accountId?: string | null;
}): string[] | undefined;
