import { type WormAgentConfig } from "../../config/config.js";
import type { AnyAgentTool } from "./common.js";
export declare function createSessionsListTool(opts?: {
    agentSessionKey?: string;
    sandboxed?: boolean;
    config?: WormAgentConfig;
}): AnyAgentTool;
