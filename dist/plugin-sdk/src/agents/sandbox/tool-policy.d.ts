import type { WormAgentConfig } from "../../config/config.js";
import type { SandboxToolPolicy, SandboxToolPolicyResolved } from "./types.js";
export declare function isToolAllowed(policy: SandboxToolPolicy, name: string): boolean;
export declare function resolveSandboxToolPolicyForAgent(cfg?: WormAgentConfig, agentId?: string): SandboxToolPolicyResolved;
