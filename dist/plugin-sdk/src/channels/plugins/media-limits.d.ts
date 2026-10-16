import type { WormAgentConfig } from "../../config/config.js";
export declare function resolveChannelMediaMaxBytes(params: {
    cfg: WormAgentConfig;
    resolveChannelLimitMb: (params: {
        cfg: WormAgentConfig;
        accountId: string;
    }) => number | undefined;
    accountId?: string | null;
}): number | undefined;
