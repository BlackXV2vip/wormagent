import type { WormAgentConfig } from "../config/config.js";
import type { AgentDefaultsConfig } from "../config/types.agent-defaults.js";
type HeartbeatConfig = AgentDefaultsConfig["heartbeat"];
export type HeartbeatSummary = {
    enabled: boolean;
    every: string;
    everyMs: number | null;
    prompt: string;
    target: string;
    model?: string;
    ackMaxChars: number;
};
export declare function isHeartbeatEnabledForAgent(cfg: WormAgentConfig, agentId?: string): boolean;
export declare function resolveHeartbeatIntervalMs(cfg: WormAgentConfig, overrideEvery?: string, heartbeat?: HeartbeatConfig): number | null;
export declare function resolveHeartbeatSummaryForAgent(cfg: WormAgentConfig, agentId?: string): HeartbeatSummary;
export {};
