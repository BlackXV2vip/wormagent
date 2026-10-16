import type { WormAgentConfig } from "../config/config.js";
export declare function resolveAgentTimeoutSeconds(cfg?: WormAgentConfig): number;
export declare function resolveAgentTimeoutMs(opts: {
    cfg?: WormAgentConfig;
    overrideMs?: number | null;
    overrideSeconds?: number | null;
    minMs?: number;
}): number;
