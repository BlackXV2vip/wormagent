import type { WormAgentConfig, PluginRuntime } from "../runtime-api.js";
import type { DynamicAgentCreationConfig } from "./types.js";
export type MaybeCreateDynamicAgentResult = {
    created: boolean;
    updatedCfg: WormAgentConfig;
    agentId?: string;
};
/**
 * Check if a dynamic agent should be created for a DM user and create it if needed.
 * This creates a unique agent instance with its own workspace for each DM user.
 */
export declare function maybeCreateDynamicAgent(params: {
    cfg: WormAgentConfig;
    runtime: PluginRuntime;
    senderOpenId: string;
    dynamicCfg: DynamicAgentCreationConfig;
    log: (msg: string) => void;
}): Promise<MaybeCreateDynamicAgentResult>;
