import type { WormAgentConfig } from "../config/config.js";
export type ProviderCapabilities = {
    anthropicToolSchemaMode: "native" | "openai-functions";
    anthropicToolChoiceMode: "native" | "openai-string-modes";
    providerFamily: "default" | "openai" | "anthropic";
    preserveAnthropicThinkingSignatures: boolean;
    openAiCompatTurnValidation: boolean;
    geminiThoughtSignatureSanitization: boolean;
    transcriptToolCallIdMode: "default" | "strict9";
    transcriptToolCallIdModelHints: string[];
    geminiThoughtSignatureModelHints: string[];
    dropThinkingBlockModelHints: string[];
};
export type ProviderCapabilityLookupOptions = {
    config?: WormAgentConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
};
export declare function resolveProviderCapabilities(provider?: string | null, options?: ProviderCapabilityLookupOptions): ProviderCapabilities;
export declare function preservesAnthropicThinkingSignatures(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function requiresOpenAiCompatibleAnthropicToolPayload(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function usesOpenAiFunctionAnthropicToolSchema(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function usesOpenAiStringModeAnthropicToolChoice(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function supportsOpenAiCompatTurnValidation(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function sanitizesGeminiThoughtSignatures(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function isOpenAiProviderFamily(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function isAnthropicProviderFamily(provider?: string | null, options?: ProviderCapabilityLookupOptions): boolean;
export declare function shouldDropThinkingBlocksForModel(params: {
    provider?: string | null;
    modelId?: string | null;
    config?: WormAgentConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): boolean;
export declare function shouldSanitizeGeminiThoughtSignaturesForModel(params: {
    provider?: string | null;
    modelId?: string | null;
    config?: WormAgentConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): boolean;
export declare function resolveTranscriptToolCallIdMode(provider?: string | null, modelId?: string | null, options?: ProviderCapabilityLookupOptions): "strict9" | undefined;
