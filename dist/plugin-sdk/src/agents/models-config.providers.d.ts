import type { WormAgentConfig } from "../config/config.js";
import { normalizeGoogleModelId } from "./model-id-normalization.js";
export { buildKimiCodingProvider } from "../../extensions/kimi-coding/provider-catalog.js";
export { buildKilocodeProvider } from "../../extensions/kilocode/provider-catalog.js";
export { MODELSTUDIO_BASE_URL, MODELSTUDIO_DEFAULT_MODEL_ID, buildModelStudioProvider, } from "../../extensions/modelstudio/provider-catalog.js";
export { buildNvidiaProvider } from "../../extensions/nvidia/provider-catalog.js";
export { QIANFAN_BASE_URL, QIANFAN_DEFAULT_MODEL_ID, buildQianfanProvider, } from "../../extensions/qianfan/provider-catalog.js";
export { XIAOMI_DEFAULT_MODEL_ID, buildXiaomiProvider, } from "../../extensions/xiaomi/provider-catalog.js";
export { resolveOllamaApiBase } from "./models-config.providers.discovery.js";
export { normalizeGoogleModelId };
type ModelsConfig = NonNullable<WormAgentConfig["models"]>;
export type ProviderConfig = NonNullable<ModelsConfig["providers"]>[string];
type SecretDefaults = {
    env?: string;
    file?: string;
    exec?: string;
};
export declare function applyNativeStreamingUsageCompat(providers: Record<string, ProviderConfig>): Record<string, ProviderConfig>;
export declare function normalizeAntigravityModelId(id: string): string;
export declare function enforceSourceManagedProviderSecrets(params: {
    providers: ModelsConfig["providers"];
    sourceProviders: ModelsConfig["providers"] | undefined;
    sourceSecretDefaults?: SecretDefaults;
    secretRefManagedProviders?: Set<string>;
}): ModelsConfig["providers"];
export declare function normalizeProviders(params: {
    providers: ModelsConfig["providers"];
    agentDir: string;
    env?: NodeJS.ProcessEnv;
    secretDefaults?: SecretDefaults;
    sourceProviders?: ModelsConfig["providers"];
    sourceSecretDefaults?: SecretDefaults;
    secretRefManagedProviders?: Set<string>;
}): ModelsConfig["providers"];
type ImplicitProviderParams = {
    agentDir: string;
    config?: WormAgentConfig;
    env?: NodeJS.ProcessEnv;
    workspaceDir?: string;
    explicitProviders?: Record<string, ProviderConfig> | null;
};
export declare function resolveImplicitProviders(params: ImplicitProviderParams): Promise<ModelsConfig["providers"]>;
export declare function resolveImplicitBedrockProvider(params: {
    agentDir: string;
    config?: WormAgentConfig;
    env?: NodeJS.ProcessEnv;
}): Promise<ProviderConfig | null>;
