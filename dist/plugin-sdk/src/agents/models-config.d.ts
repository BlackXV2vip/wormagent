import { type WormAgentConfig } from "../config/config.js";
export declare function ensureWormAgentModelsJson(config?: WormAgentConfig, agentDirOverride?: string): Promise<{
    agentDir: string;
    wrote: boolean;
}>;
