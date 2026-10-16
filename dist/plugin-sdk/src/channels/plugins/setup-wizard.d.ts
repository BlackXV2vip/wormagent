import type { WormAgentConfig } from "../../config/config.js";
import type { WizardPrompter } from "../../wizard/prompts.js";
import type { ChannelAccessPolicy } from "./setup-group-access.js";
import type { ChannelSetupWizardAdapter, ChannelSetupConfigureContext, ChannelSetupDmPolicy } from "./setup-wizard-types.js";
import type { ChannelSetupInput } from "./types.core.js";
import type { ChannelPlugin } from "./types.js";
export type ChannelSetupWizardStatus = {
    configuredLabel: string;
    unconfiguredLabel: string;
    configuredHint?: string;
    unconfiguredHint?: string;
    configuredScore?: number;
    unconfiguredScore?: number;
    resolveConfigured: (params: {
        cfg: WormAgentConfig;
    }) => boolean | Promise<boolean>;
    resolveStatusLines?: (params: {
        cfg: WormAgentConfig;
        configured: boolean;
    }) => string[] | Promise<string[]>;
    resolveSelectionHint?: (params: {
        cfg: WormAgentConfig;
        configured: boolean;
    }) => string | undefined | Promise<string | undefined>;
    resolveQuickstartScore?: (params: {
        cfg: WormAgentConfig;
        configured: boolean;
    }) => number | undefined | Promise<number | undefined>;
};
export type ChannelSetupWizardCredentialState = {
    accountConfigured: boolean;
    hasConfiguredValue: boolean;
    resolvedValue?: string;
    envValue?: string;
};
type ChannelSetupWizardCredentialValues = Partial<Record<string, string>>;
export type ChannelSetupWizardNote = {
    title: string;
    lines: string[];
    shouldShow?: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        credentialValues: ChannelSetupWizardCredentialValues;
    }) => boolean | Promise<boolean>;
};
export type ChannelSetupWizardEnvShortcut = {
    prompt: string;
    preferredEnvVar?: string;
    isAvailable: (params: {
        cfg: WormAgentConfig;
        accountId: string;
    }) => boolean;
    apply: (params: {
        cfg: WormAgentConfig;
        accountId: string;
    }) => WormAgentConfig | Promise<WormAgentConfig>;
};
export type ChannelSetupWizardCredential = {
    inputKey: keyof ChannelSetupInput;
    providerHint: string;
    credentialLabel: string;
    preferredEnvVar?: string;
    helpTitle?: string;
    helpLines?: string[];
    envPrompt: string;
    keepPrompt: string;
    inputPrompt: string;
    allowEnv?: (params: {
        cfg: WormAgentConfig;
        accountId: string;
    }) => boolean;
    inspect: (params: {
        cfg: WormAgentConfig;
        accountId: string;
    }) => ChannelSetupWizardCredentialState;
    shouldPrompt?: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        credentialValues: ChannelSetupWizardCredentialValues;
        currentValue?: string;
        state: ChannelSetupWizardCredentialState;
    }) => boolean | Promise<boolean>;
    applyUseEnv?: (params: {
        cfg: WormAgentConfig;
        accountId: string;
    }) => WormAgentConfig | Promise<WormAgentConfig>;
    applySet?: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        credentialValues: ChannelSetupWizardCredentialValues;
        value: unknown;
        resolvedValue: string;
    }) => WormAgentConfig | Promise<WormAgentConfig>;
};
export type ChannelSetupWizardTextInput = {
    inputKey: keyof ChannelSetupInput;
    message: string;
    placeholder?: string;
    required?: boolean;
    applyEmptyValue?: boolean;
    helpTitle?: string;
    helpLines?: string[];
    confirmCurrentValue?: boolean;
    keepPrompt?: string | ((value: string) => string);
    currentValue?: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        credentialValues: ChannelSetupWizardCredentialValues;
    }) => string | undefined | Promise<string | undefined>;
    initialValue?: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        credentialValues: ChannelSetupWizardCredentialValues;
    }) => string | undefined | Promise<string | undefined>;
    shouldPrompt?: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        credentialValues: ChannelSetupWizardCredentialValues;
        currentValue?: string;
    }) => boolean | Promise<boolean>;
    applyCurrentValue?: boolean;
    validate?: (params: {
        value: string;
        cfg: WormAgentConfig;
        accountId: string;
        credentialValues: ChannelSetupWizardCredentialValues;
    }) => string | undefined;
    normalizeValue?: (params: {
        value: string;
        cfg: WormAgentConfig;
        accountId: string;
        credentialValues: ChannelSetupWizardCredentialValues;
    }) => string;
    applySet?: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        value: string;
    }) => WormAgentConfig | Promise<WormAgentConfig>;
};
export type ChannelSetupWizardAllowFromEntry = {
    input: string;
    resolved: boolean;
    id: string | null;
};
export type ChannelSetupWizardAllowFrom = {
    helpTitle?: string;
    helpLines?: string[];
    credentialInputKey?: keyof ChannelSetupInput;
    message: string;
    placeholder: string;
    invalidWithoutCredentialNote: string;
    parseInputs?: (raw: string) => string[];
    parseId: (raw: string) => string | null;
    resolveEntries: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        credentialValues: ChannelSetupWizardCredentialValues;
        entries: string[];
    }) => Promise<ChannelSetupWizardAllowFromEntry[]>;
    apply: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        allowFrom: string[];
    }) => WormAgentConfig | Promise<WormAgentConfig>;
};
export type ChannelSetupWizardGroupAccess = {
    label: string;
    placeholder: string;
    helpTitle?: string;
    helpLines?: string[];
    skipAllowlistEntries?: boolean;
    currentPolicy: (params: {
        cfg: WormAgentConfig;
        accountId: string;
    }) => ChannelAccessPolicy;
    currentEntries: (params: {
        cfg: WormAgentConfig;
        accountId: string;
    }) => string[];
    updatePrompt: (params: {
        cfg: WormAgentConfig;
        accountId: string;
    }) => boolean;
    setPolicy: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        policy: ChannelAccessPolicy;
    }) => WormAgentConfig;
    resolveAllowlist?: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        credentialValues: ChannelSetupWizardCredentialValues;
        entries: string[];
        prompter: Pick<WizardPrompter, "note">;
    }) => Promise<unknown>;
    applyAllowlist?: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        resolved: unknown;
    }) => WormAgentConfig;
};
export type ChannelSetupWizardPrepare = (params: {
    cfg: WormAgentConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    runtime: ChannelSetupConfigureContext["runtime"];
    prompter: WizardPrompter;
    options?: ChannelSetupConfigureContext["options"];
}) => {
    cfg?: WormAgentConfig;
    credentialValues?: ChannelSetupWizardCredentialValues;
} | void | Promise<{
    cfg?: WormAgentConfig;
    credentialValues?: ChannelSetupWizardCredentialValues;
} | void>;
export type ChannelSetupWizardFinalize = (params: {
    cfg: WormAgentConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    runtime: ChannelSetupConfigureContext["runtime"];
    prompter: WizardPrompter;
    options?: ChannelSetupConfigureContext["options"];
    forceAllowFrom: boolean;
}) => {
    cfg?: WormAgentConfig;
    credentialValues?: ChannelSetupWizardCredentialValues;
} | void | Promise<{
    cfg?: WormAgentConfig;
    credentialValues?: ChannelSetupWizardCredentialValues;
} | void>;
export type ChannelSetupWizard = {
    channel: string;
    status: ChannelSetupWizardStatus;
    introNote?: ChannelSetupWizardNote;
    envShortcut?: ChannelSetupWizardEnvShortcut;
    resolveAccountIdForConfigure?: (params: {
        cfg: WormAgentConfig;
        prompter: WizardPrompter;
        options?: ChannelSetupConfigureContext["options"];
        accountOverride?: string;
        shouldPromptAccountIds: boolean;
        listAccountIds: ChannelSetupWizardPlugin["config"]["listAccountIds"];
        defaultAccountId: string;
    }) => string | Promise<string>;
    resolveShouldPromptAccountIds?: (params: {
        cfg: WormAgentConfig;
        options?: ChannelSetupConfigureContext["options"];
        shouldPromptAccountIds: boolean;
    }) => boolean;
    prepare?: ChannelSetupWizardPrepare;
    stepOrder?: "credentials-first" | "text-first";
    credentials: ChannelSetupWizardCredential[];
    textInputs?: ChannelSetupWizardTextInput[];
    finalize?: ChannelSetupWizardFinalize;
    completionNote?: ChannelSetupWizardNote;
    dmPolicy?: ChannelSetupDmPolicy;
    allowFrom?: ChannelSetupWizardAllowFrom;
    groupAccess?: ChannelSetupWizardGroupAccess;
    disable?: (cfg: WormAgentConfig) => WormAgentConfig;
    onAccountRecorded?: ChannelSetupWizardAdapter["onAccountRecorded"];
};
type ChannelSetupWizardPlugin = Pick<ChannelPlugin, "id" | "meta" | "config" | "setup">;
export declare function buildChannelSetupWizardAdapterFromSetupWizard(params: {
    plugin: ChannelSetupWizardPlugin;
    wizard: ChannelSetupWizard;
}): ChannelSetupWizardAdapter;
export {};
