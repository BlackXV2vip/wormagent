import type { WormAgentConfig } from "../config/config.js";
import type { PluginWebSearchProviderEntry, WebSearchProviderToolDefinition } from "../plugins/types.js";
import type { RuntimeWebSearchMetadata } from "../secrets/runtime-web-tools.types.js";
type WebSearchConfig = NonNullable<WormAgentConfig["tools"]>["web"] extends infer Web ? Web extends {
    search?: infer Search;
} ? Search : undefined : undefined;
export type ResolveWebSearchDefinitionParams = {
    config?: WormAgentConfig;
    sandboxed?: boolean;
    runtimeWebSearch?: RuntimeWebSearchMetadata;
    providerId?: string;
    preferRuntimeProviders?: boolean;
};
export type RunWebSearchParams = ResolveWebSearchDefinitionParams & {
    args: Record<string, unknown>;
};
declare function resolveSearchConfig(cfg?: WormAgentConfig): WebSearchConfig;
export declare function resolveWebSearchEnabled(params: {
    search?: WebSearchConfig;
    sandboxed?: boolean;
}): boolean;
export declare function listWebSearchProviders(params?: {
    config?: WormAgentConfig;
}): PluginWebSearchProviderEntry[];
export declare function resolveWebSearchProviderId(params: {
    search?: WebSearchConfig;
    config?: WormAgentConfig;
    providers?: PluginWebSearchProviderEntry[];
}): string;
export declare function resolveWebSearchDefinition(options?: ResolveWebSearchDefinitionParams): {
    provider: PluginWebSearchProviderEntry;
    definition: WebSearchProviderToolDefinition;
} | null;
export declare function runWebSearch(params: RunWebSearchParams): Promise<{
    provider: string;
    result: Record<string, unknown>;
}>;
export declare const __testing: {
    resolveSearchConfig: typeof resolveSearchConfig;
    resolveSearchProvider: typeof resolveWebSearchProviderId;
    resolveWebSearchProviderId: typeof resolveWebSearchProviderId;
};
export {};
