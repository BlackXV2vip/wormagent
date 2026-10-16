import type { WormAgentConfig } from "../../config/config.js";
type ConfiguredWebSearchProvider = NonNullable<NonNullable<NonNullable<WormAgentConfig["tools"]>["web"]>["search"]>["provider"];
export type WebSearchConfig = NonNullable<WormAgentConfig["tools"]>["web"] extends infer Web ? Web extends {
    search?: infer Search;
} ? Search : undefined : undefined;
export declare function withForcedProvider(config: WormAgentConfig | undefined, provider: ConfiguredWebSearchProvider): WormAgentConfig;
export declare function getTopLevelCredentialValue(searchConfig?: Record<string, unknown>): unknown;
export declare function setTopLevelCredentialValue(searchConfigTarget: Record<string, unknown>, value: unknown): void;
export declare function getScopedCredentialValue(searchConfig: Record<string, unknown> | undefined, key: string): unknown;
export declare function setScopedCredentialValue(searchConfigTarget: Record<string, unknown>, key: string, value: unknown): void;
export declare function resolveSearchConfig(cfg?: WormAgentConfig): WebSearchConfig;
export declare function resolveProviderWebSearchPluginConfig(config: WormAgentConfig | undefined, pluginId: string): Record<string, unknown> | undefined;
export declare function setProviderWebSearchPluginConfigValue(configTarget: WormAgentConfig, pluginId: string, key: string, value: unknown): void;
export declare function resolveSearchEnabled(params: {
    search?: WebSearchConfig;
    sandboxed?: boolean;
}): boolean;
export {};
