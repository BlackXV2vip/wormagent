import type { WormAgentConfig } from "../config/config.js";
import type { AgentModelListConfig } from "../config/types.js";
export declare function resolvePrimaryModel(model?: AgentModelListConfig | string): string | undefined;
export declare function applyAgentDefaultPrimaryModel(params: {
    cfg: WormAgentConfig;
    model: string;
    legacyModels?: Set<string>;
}): {
    next: WormAgentConfig;
    changed: boolean;
};
export declare function applyPrimaryModel(cfg: WormAgentConfig, model: string): WormAgentConfig;
