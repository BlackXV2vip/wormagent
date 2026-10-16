import type { WormAgentConfig } from "../config/config.js";
export declare function ensureRuntimePluginsLoaded(params: {
    config?: WormAgentConfig;
    workspaceDir?: string | null;
    allowGatewaySubagentBinding?: boolean;
}): void;
