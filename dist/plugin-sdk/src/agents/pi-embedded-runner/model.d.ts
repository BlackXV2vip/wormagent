import type { Api, Model } from "@mariozechner/pi-ai";
import type { AuthStorage, ModelRegistry } from "@mariozechner/pi-coding-agent";
import type { WormAgentConfig } from "../../config/config.js";
import type { ModelDefinitionConfig } from "../../config/types.js";
import { buildModelAliasLines } from "../model-alias-lines.js";
type InlineModelEntry = ModelDefinitionConfig & {
    provider: string;
    baseUrl?: string;
    headers?: Record<string, string>;
};
type InlineProviderConfig = {
    baseUrl?: string;
    api?: ModelDefinitionConfig["api"];
    models?: ModelDefinitionConfig[];
    headers?: unknown;
};
export { buildModelAliasLines };
export declare function buildInlineProviderModels(providers: Record<string, InlineProviderConfig>): InlineModelEntry[];
export declare function resolveModelWithRegistry(params: {
    provider: string;
    modelId: string;
    modelRegistry: ModelRegistry;
    cfg?: WormAgentConfig;
    agentDir?: string;
}): Model<Api> | undefined;
export declare function resolveModel(provider: string, modelId: string, agentDir?: string, cfg?: WormAgentConfig): {
    model?: Model<Api>;
    error?: string;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry;
};
export declare function resolveModelAsync(provider: string, modelId: string, agentDir?: string, cfg?: WormAgentConfig): Promise<{
    model?: Model<Api>;
    error?: string;
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry;
}>;
