import type { WormAgentConfig } from "../../config/config.js";
import { type AnyAgentTool } from "./common.js";
export declare function createGatewayTool(opts?: {
    agentSessionKey?: string;
    config?: WormAgentConfig;
}): AnyAgentTool;
