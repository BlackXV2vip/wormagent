import type { WormAgentConfig } from "../config/config.js";
export type PluginEnableResult = {
    config: WormAgentConfig;
    enabled: boolean;
    reason?: string;
};
export declare function enablePluginInConfig(cfg: WormAgentConfig, pluginId: string): PluginEnableResult;
