import type { WormAgentConfig } from "../config/config.js";
import { type ResolverContext } from "./runtime-shared.js";
import type { RuntimeWebDiagnostic, RuntimeWebDiagnosticCode, RuntimeWebFetchFirecrawlMetadata, RuntimeWebSearchMetadata, RuntimeWebToolsMetadata } from "./runtime-web-tools.types.js";
export type { RuntimeWebDiagnostic, RuntimeWebDiagnosticCode, RuntimeWebFetchFirecrawlMetadata, RuntimeWebSearchMetadata, RuntimeWebToolsMetadata, };
export declare function resolveRuntimeWebTools(params: {
    sourceConfig: WormAgentConfig;
    resolvedConfig: WormAgentConfig;
    context: ResolverContext;
}): Promise<RuntimeWebToolsMetadata>;
