import type { PluginLoadOptions } from "./loader.js";
export declare const BUNDLED_WEB_SEARCH_PLUGIN_IDS: readonly ["brave", "firecrawl", "google", "moonshot", "perplexity", "xai"];
export declare function resolveBundledWebSearchPluginIds(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
    env?: PluginLoadOptions["env"];
}): string[];
