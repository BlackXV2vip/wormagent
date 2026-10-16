import { type WormAgentConfig } from "../../config/config.js";
import type { AnyAgentTool } from "./common.js";
export declare function createSessionsHistoryTool(opts?: {
    agentSessionKey?: string;
    sandboxed?: boolean;
    config?: WormAgentConfig;
}): AnyAgentTool;
