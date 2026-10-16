import type { WormAgentConfig } from "../config/config.js";
import type { AgentModelEntryConfig } from "../config/types.agent-defaults.js";
import type { ModelApi, ModelDefinitionConfig, ModelProviderConfig } from "../config/types.models.js";
export declare function applyOnboardAuthAgentModelsAndProviders(cfg: WormAgentConfig, params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providers: Record<string, ModelProviderConfig>;
}): WormAgentConfig;
export declare function applyAgentDefaultModelPrimary(cfg: WormAgentConfig, primary: string): WormAgentConfig;
export declare function applyProviderConfigWithDefaultModels(cfg: WormAgentConfig, params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModels: ModelDefinitionConfig[];
    defaultModelId?: string;
}): WormAgentConfig;
export declare function applyProviderConfigWithDefaultModel(cfg: WormAgentConfig, params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    defaultModel: ModelDefinitionConfig;
    defaultModelId?: string;
}): WormAgentConfig;
export declare function applyProviderConfigWithModelCatalog(cfg: WormAgentConfig, params: {
    agentModels: Record<string, AgentModelEntryConfig>;
    providerId: string;
    api: ModelApi;
    baseUrl: string;
    catalogModels: ModelDefinitionConfig[];
}): WormAgentConfig;
