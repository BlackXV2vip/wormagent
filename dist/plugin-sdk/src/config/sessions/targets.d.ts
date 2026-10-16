import type { WormAgentConfig } from "../types.wormagent.js";
export type SessionStoreSelectionOptions = {
    store?: string;
    agent?: string;
    allAgents?: boolean;
};
export type SessionStoreTarget = {
    agentId: string;
    storePath: string;
};
export declare function resolveAllAgentSessionStoreTargetsSync(cfg: WormAgentConfig, params?: {
    env?: NodeJS.ProcessEnv;
}): SessionStoreTarget[];
export declare function resolveAllAgentSessionStoreTargets(cfg: WormAgentConfig, params?: {
    env?: NodeJS.ProcessEnv;
}): Promise<SessionStoreTarget[]>;
export declare function resolveSessionStoreTargets(cfg: WormAgentConfig, opts: SessionStoreSelectionOptions, params?: {
    env?: NodeJS.ProcessEnv;
}): SessionStoreTarget[];
