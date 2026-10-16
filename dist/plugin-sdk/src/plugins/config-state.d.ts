import type { WormAgentConfig } from "../config/config.js";
import type { PluginRecord } from "./registry.js";
export type NormalizedPluginsConfig = {
    enabled: boolean;
    allow: string[];
    deny: string[];
    loadPaths: string[];
    slots: {
        memory?: string | null;
    };
    entries: Record<string, {
        enabled?: boolean;
        hooks?: {
            allowPromptInjection?: boolean;
        };
        subagent?: {
            allowModelOverride?: boolean;
            allowedModels?: string[];
            hasAllowedModelsConfig?: boolean;
        };
        config?: unknown;
    }>;
};
export declare const BUNDLED_ENABLED_BY_DEFAULT: Set<string>;
export declare const normalizePluginsConfig: (config?: WormAgentConfig["plugins"]) => NormalizedPluginsConfig;
export declare function applyTestPluginDefaults(cfg: WormAgentConfig, env?: NodeJS.ProcessEnv): WormAgentConfig;
export declare function isTestDefaultMemorySlotDisabled(cfg: WormAgentConfig, env?: NodeJS.ProcessEnv): boolean;
export declare function resolveEnableState(id: string, origin: PluginRecord["origin"], config: NormalizedPluginsConfig, enabledByDefault?: boolean): {
    enabled: boolean;
    reason?: string;
};
export declare function isBundledChannelEnabledByChannelConfig(cfg: WormAgentConfig | undefined, pluginId: string): boolean;
export declare function resolveEffectiveEnableState(params: {
    id: string;
    origin: PluginRecord["origin"];
    config: NormalizedPluginsConfig;
    rootConfig?: WormAgentConfig;
    enabledByDefault?: boolean;
}): {
    enabled: boolean;
    reason?: string;
};
export declare function resolveMemorySlotDecision(params: {
    id: string;
    kind?: string;
    slot: string | null | undefined;
    selectedId: string | null;
}): {
    enabled: boolean;
    reason?: string;
    selected?: boolean;
};
