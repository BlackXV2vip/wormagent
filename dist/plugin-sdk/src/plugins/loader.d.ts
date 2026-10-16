import type { WormAgentConfig } from "../config/config.js";
import type { GatewayRequestHandler } from "../gateway/server-methods/types.js";
import { type PluginRegistry } from "./registry.js";
import type { CreatePluginRuntimeOptions } from "./runtime/index.js";
import type { PluginLogger } from "./types.js";
export type PluginLoadResult = PluginRegistry;
export type PluginLoadOptions = {
    config?: WormAgentConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    logger?: PluginLogger;
    coreGatewayHandlers?: Record<string, GatewayRequestHandler>;
    runtimeOptions?: CreatePluginRuntimeOptions;
    cache?: boolean;
    mode?: "full" | "validate";
    onlyPluginIds?: string[];
    includeSetupOnlyChannelPlugins?: boolean;
    /**
     * Prefer `setupEntry` for configured channel plugins that explicitly opt in
     * via package metadata because their setup entry covers the pre-listen startup surface.
     */
    preferSetupRuntimeForChannelPlugins?: boolean;
    activate?: boolean;
};
export declare function clearPluginLoaderCache(): void;
type PluginSdkAliasCandidateKind = "dist" | "src";
type LoaderModuleResolveParams = {
    modulePath?: string;
    argv1?: string;
    cwd?: string;
    moduleUrl?: string;
};
declare function resolvePluginSdkAliasCandidateOrder(params: {
    modulePath: string;
    isProduction: boolean;
}): PluginSdkAliasCandidateKind[];
declare function listPluginSdkAliasCandidates(params: {
    srcFile: string;
    distFile: string;
    modulePath: string;
    argv1?: string;
    cwd?: string;
    moduleUrl?: string;
}): string[];
declare function buildPluginLoaderJitiOptions(aliasMap: Record<string, string>): {
    alias?: Record<string, string> | undefined;
    interopDefault: boolean;
    tryNative: boolean;
    extensions: string[];
};
declare function resolvePluginRuntimeModulePath(params?: LoaderModuleResolveParams): string | null;
declare function listPluginSdkExportedSubpaths(params?: {
    modulePath?: string;
}): string[];
declare function shouldPreferNativeJiti(modulePath: string): boolean;
export declare const __testing: {
    buildPluginLoaderJitiOptions: typeof buildPluginLoaderJitiOptions;
    listPluginSdkAliasCandidates: typeof listPluginSdkAliasCandidates;
    listPluginSdkExportedSubpaths: typeof listPluginSdkExportedSubpaths;
    resolvePluginSdkAliasCandidateOrder: typeof resolvePluginSdkAliasCandidateOrder;
    resolvePluginSdkAliasFile: (params: {
        srcFile: string;
        distFile: string;
        modulePath?: string;
        argv1?: string;
        cwd?: string;
        moduleUrl?: string;
    }) => string | null;
    resolvePluginRuntimeModulePath: typeof resolvePluginRuntimeModulePath;
    resolvePluginSdkScopedAliasMap: () => Record<string, string>;
    shouldPreferNativeJiti: typeof shouldPreferNativeJiti;
    maxPluginRegistryCacheEntries: number;
};
export declare function loadWormAgentPlugins(options?: PluginLoadOptions): PluginRegistry;
export {};
