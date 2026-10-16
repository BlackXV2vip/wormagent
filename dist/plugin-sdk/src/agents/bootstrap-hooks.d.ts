import type { WormAgentConfig } from "../config/config.js";
import type { WorkspaceBootstrapFile } from "./workspace.js";
export declare function applyBootstrapHookOverrides(params: {
    files: WorkspaceBootstrapFile[];
    workspaceDir: string;
    config?: WormAgentConfig;
    sessionKey?: string;
    sessionId?: string;
    agentId?: string;
}): Promise<WorkspaceBootstrapFile[]>;
