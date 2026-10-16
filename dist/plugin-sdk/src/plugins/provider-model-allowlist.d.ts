import type { WormAgentConfig } from "../config/config.js";
export declare function ensureModelAllowlistEntry(params: {
    cfg: WormAgentConfig;
    modelRef: string;
    defaultProvider?: string;
}): WormAgentConfig;
