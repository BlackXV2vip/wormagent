import { type PluginLoadOptions } from "./loader.js";
import type { ProviderPlugin } from "./types.js";
declare function withBundledProviderVitestCompat(params: {
    config: PluginLoadOptions["config"];
    pluginIds: readonly string[];
    env?: PluginLoadOptions["env"];
}): PluginLoadOptions["config"];
declare function resolveBundledProviderCompatPluginIds(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
    onlyPluginIds?: string[];
}): string[];
export declare const __testing: {
    readonly resolveBundledProviderCompatPluginIds: typeof resolveBundledProviderCompatPluginIds;
    readonly withBundledProviderVitestCompat: typeof withBundledProviderVitestCompat;
};
export declare function resolveOwningPluginIdsForProvider(params: {
    provider: string;
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
}): string[] | undefined;
export declare function resolveNonBundledProviderPluginIds(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
}): string[];
export declare function resolvePluginProviders(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    /** Use an explicit env when plugin roots should resolve independently from process.env. */
    env?: PluginLoadOptions["env"];
    bundledProviderAllowlistCompat?: boolean;
    bundledProviderVitestCompat?: boolean;
    onlyPluginIds?: string[];
    activate?: boolean;
    cache?: boolean;
}): ProviderPlugin[];
export {};
