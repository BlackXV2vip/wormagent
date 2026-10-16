import { type Api, type Model } from "@mariozechner/pi-ai";
import type { WormAgentConfig } from "../config/config.js";
import { type AuthProfileStore } from "./auth-profiles.js";
export { ensureAuthProfileStore, resolveAuthProfileOrder } from "./auth-profiles.js";
export declare function getCustomProviderApiKey(cfg: WormAgentConfig | undefined, provider: string): string | undefined;
type ResolvedCustomProviderApiKey = {
    apiKey: string;
    source: string;
};
export declare function resolveUsableCustomProviderApiKey(params: {
    cfg: WormAgentConfig | undefined;
    provider: string;
    env?: NodeJS.ProcessEnv;
}): ResolvedCustomProviderApiKey | null;
export declare function hasUsableCustomProviderApiKey(cfg: WormAgentConfig | undefined, provider: string, env?: NodeJS.ProcessEnv): boolean;
export declare function resolveAwsSdkEnvVarName(env?: NodeJS.ProcessEnv): string | undefined;
export type ResolvedProviderAuth = {
    apiKey?: string;
    profileId?: string;
    source: string;
    mode: "api-key" | "oauth" | "token" | "aws-sdk";
};
export declare function resolveApiKeyForProvider(params: {
    provider: string;
    cfg?: WormAgentConfig;
    profileId?: string;
    preferredProfile?: string;
    store?: AuthProfileStore;
    agentDir?: string;
}): Promise<ResolvedProviderAuth>;
export type EnvApiKeyResult = {
    apiKey: string;
    source: string;
};
export type ModelAuthMode = "api-key" | "oauth" | "token" | "mixed" | "aws-sdk" | "unknown";
export declare function resolveEnvApiKey(provider: string, env?: NodeJS.ProcessEnv): EnvApiKeyResult | null;
export declare function resolveModelAuthMode(provider?: string, cfg?: WormAgentConfig, store?: AuthProfileStore): ModelAuthMode | undefined;
export declare function hasAvailableAuthForProvider(params: {
    provider: string;
    cfg?: WormAgentConfig;
    preferredProfile?: string;
    store?: AuthProfileStore;
    agentDir?: string;
}): Promise<boolean>;
export declare function getApiKeyForModel(params: {
    model: Model<Api>;
    cfg?: WormAgentConfig;
    profileId?: string;
    preferredProfile?: string;
    store?: AuthProfileStore;
    agentDir?: string;
}): Promise<ResolvedProviderAuth>;
export declare function requireApiKey(auth: ResolvedProviderAuth, provider: string): string;
export declare function applyLocalNoAuthHeaderOverride<T extends Model<Api>>(model: T, auth: ResolvedProviderAuth | null | undefined): T;
