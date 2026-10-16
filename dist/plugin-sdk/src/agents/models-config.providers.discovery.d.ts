import type { WormAgentConfig } from "../config/config.js";
export { buildHuggingfaceProvider } from "../../extensions/huggingface/provider-catalog.js";
export { buildKilocodeProviderWithDiscovery } from "../../extensions/kilocode/provider-catalog.js";
export { buildVeniceProvider } from "../../extensions/venice/provider-catalog.js";
export { buildVercelAiGatewayProvider } from "../../extensions/vercel-ai-gateway/provider-catalog.js";
export { resolveOllamaApiBase } from "./ollama-models.js";
type ModelsConfig = NonNullable<WormAgentConfig["models"]>;
type ProviderConfig = NonNullable<ModelsConfig["providers"]>[string];
export declare function buildOllamaProvider(configuredBaseUrl?: string, opts?: {
    quiet?: boolean;
}): Promise<ProviderConfig>;
export declare function buildVllmProvider(params?: {
    baseUrl?: string;
    apiKey?: string;
}): Promise<ProviderConfig>;
export declare function buildSglangProvider(params?: {
    baseUrl?: string;
    apiKey?: string;
}): Promise<ProviderConfig>;
