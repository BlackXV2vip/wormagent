import type { WormAgentConfig } from "../config/types.js";
import { type SecretInput, type SecretRef } from "../config/types.secrets.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import type { SecretInputMode } from "./provider-auth-types.js";
export type SecretInputModePromptCopy = {
    modeMessage?: string;
    plaintextLabel?: string;
    plaintextHint?: string;
    refLabel?: string;
    refHint?: string;
};
export type SecretRefSetupPromptCopy = {
    sourceMessage?: string;
    envVarMessage?: string;
    envVarPlaceholder?: string;
    envVarFormatError?: string;
    envVarMissingError?: (envVar: string) => string;
    noProvidersMessage?: string;
    envValidatedMessage?: (envVar: string) => string;
    providerValidatedMessage?: (provider: string, id: string, source: "file" | "exec") => string;
};
export declare function normalizeApiKeyInput(raw: string): string;
export declare const validateApiKeyInput: (value: string) => "Required" | undefined;
export declare function formatApiKeyPreview(raw: string, opts?: {
    head?: number;
    tail?: number;
}): string;
export declare function promptSecretRefForSetup(params: {
    provider: string;
    config: WormAgentConfig;
    prompter: WizardPrompter;
    preferredEnvVar?: string;
    copy?: SecretRefSetupPromptCopy;
}): Promise<{
    ref: SecretRef;
    resolvedValue: string;
}>;
export declare function normalizeTokenProviderInput(tokenProvider: string | null | undefined): string | undefined;
export declare function normalizeSecretInputModeInput(secretInputMode: string | null | undefined): SecretInputMode | undefined;
export declare function resolveSecretInputModeForEnvSelection(params: {
    prompter: WizardPrompter;
    explicitMode?: SecretInputMode;
    copy?: SecretInputModePromptCopy;
}): Promise<SecretInputMode>;
export declare function maybeApplyApiKeyFromOption(params: {
    token: string | undefined;
    tokenProvider: string | undefined;
    secretInputMode?: SecretInputMode;
    expectedProviders: string[];
    normalize: (value: string) => string;
    setCredential: (apiKey: SecretInput, mode?: SecretInputMode) => Promise<void>;
}): Promise<string | undefined>;
export declare function ensureApiKeyFromOptionEnvOrPrompt(params: {
    token: string | undefined;
    tokenProvider: string | undefined;
    secretInputMode?: SecretInputMode;
    config: WormAgentConfig;
    expectedProviders: string[];
    provider: string;
    envLabel: string;
    promptMessage: string;
    normalize: (value: string) => string;
    validate: (value: string) => string | undefined;
    prompter: WizardPrompter;
    setCredential: (apiKey: SecretInput, mode?: SecretInputMode) => Promise<void>;
    noteMessage?: string;
    noteTitle?: string;
}): Promise<string>;
export declare function ensureApiKeyFromEnvOrPrompt(params: {
    config: WormAgentConfig;
    provider: string;
    envLabel: string;
    promptMessage: string;
    normalize: (value: string) => string;
    validate: (value: string) => string | undefined;
    prompter: WizardPrompter;
    secretInputMode?: SecretInputMode;
    setCredential: (apiKey: SecretInput, mode?: SecretInputMode) => Promise<void>;
}): Promise<string>;
