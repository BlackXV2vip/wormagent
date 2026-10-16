import type { WormAgentConfig } from "../config/config.js";
/** Resolve the config path prefix for a channel account, falling back to the root channel section. */
export declare function resolveChannelAccountConfigBasePath(params: {
    cfg: WormAgentConfig;
    channelKey: string;
    accountId: string;
}): string;
