import type { WormAgentConfig } from "../config/config.js";
import { resolveAgentIdFromSessionKey } from "../routing/session-key.js";
export { resolveAgentIdFromSessionKey };
type AgentEntry = NonNullable<NonNullable<WormAgentConfig["agents"]>["list"]>[number];
type ResolvedAgentConfig = {
    name?: string;
    workspace?: string;
    agentDir?: string;
    model?: AgentEntry["model"];
    skills?: AgentEntry["skills"];
    memorySearch?: AgentEntry["memorySearch"];
    humanDelay?: AgentEntry["humanDelay"];
    heartbeat?: AgentEntry["heartbeat"];
    identity?: AgentEntry["identity"];
    groupChat?: AgentEntry["groupChat"];
    subagents?: AgentEntry["subagents"];
    sandbox?: AgentEntry["sandbox"];
    tools?: AgentEntry["tools"];
};
export declare function listAgentEntries(cfg: WormAgentConfig): AgentEntry[];
export declare function listAgentIds(cfg: WormAgentConfig): string[];
export declare function resolveDefaultAgentId(cfg: WormAgentConfig): string;
export declare function resolveSessionAgentIds(params: {
    sessionKey?: string;
    config?: WormAgentConfig;
    agentId?: string;
}): {
    defaultAgentId: string;
    sessionAgentId: string;
};
export declare function resolveSessionAgentId(params: {
    sessionKey?: string;
    config?: WormAgentConfig;
}): string;
export declare function resolveAgentConfig(cfg: WormAgentConfig, agentId: string): ResolvedAgentConfig | undefined;
export declare function resolveAgentSkillsFilter(cfg: WormAgentConfig, agentId: string): string[] | undefined;
export declare function resolveAgentExplicitModelPrimary(cfg: WormAgentConfig, agentId: string): string | undefined;
export declare function resolveAgentEffectiveModelPrimary(cfg: WormAgentConfig, agentId: string): string | undefined;
export declare function resolveAgentModelPrimary(cfg: WormAgentConfig, agentId: string): string | undefined;
export declare function resolveAgentModelFallbacksOverride(cfg: WormAgentConfig, agentId: string): string[] | undefined;
export declare function resolveFallbackAgentId(params: {
    agentId?: string | null;
    sessionKey?: string | null;
}): string;
export declare function resolveRunModelFallbacksOverride(params: {
    cfg: WormAgentConfig | undefined;
    agentId?: string | null;
    sessionKey?: string | null;
}): string[] | undefined;
export declare function hasConfiguredModelFallbacks(params: {
    cfg: WormAgentConfig | undefined;
    agentId?: string | null;
    sessionKey?: string | null;
}): boolean;
export declare function resolveEffectiveModelFallbacks(params: {
    cfg: WormAgentConfig;
    agentId: string;
    hasSessionModelOverride: boolean;
}): string[] | undefined;
export declare function resolveAgentWorkspaceDir(cfg: WormAgentConfig, agentId: string): string;
export declare function resolveAgentIdsByWorkspacePath(cfg: WormAgentConfig, workspacePath: string): string[];
export declare function resolveAgentIdByWorkspacePath(cfg: WormAgentConfig, workspacePath: string): string | undefined;
export declare function resolveAgentDir(cfg: WormAgentConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
