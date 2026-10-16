import type { WormAgentConfig } from "../config/config.js";
export declare function getDefaultMediaLocalRoots(): readonly string[];
export declare function getAgentScopedMediaLocalRoots(cfg: WormAgentConfig, agentId?: string): readonly string[];
