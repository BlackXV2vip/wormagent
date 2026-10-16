import type { WormAgentConfig } from "../../config/config.js";
import type { AnyAgentTool } from "./common.js";
export declare function createMemorySearchTool(options: {
    config?: WormAgentConfig;
    agentSessionKey?: string;
}): AnyAgentTool | null;
export declare function createMemoryGetTool(options: {
    config?: WormAgentConfig;
    agentSessionKey?: string;
}): AnyAgentTool | null;
