import type { WormAgentConfig } from "../../config/config.js";
import type { RuntimeWebSearchMetadata } from "../../secrets/runtime-web-tools.types.js";
import type { AnyAgentTool } from "./common.js";
import { type WebSearchConfig } from "./web-search-provider-config.js";
declare function resolveSearchProvider(search?: WebSearchConfig): string;
export declare function createWebSearchTool(options?: {
    config?: WormAgentConfig;
    sandboxed?: boolean;
    runtimeWebSearch?: RuntimeWebSearchMetadata;
}): AnyAgentTool | null;
export declare const __testing: {
    SEARCH_CACHE: Map<string, import("./web-shared.ts").CacheEntry<Record<string, unknown>>>;
    resolveSearchProvider: typeof resolveSearchProvider;
};
export {};
