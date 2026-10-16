import type { WormAgentConfig } from "../../config/config.js";
import type { DmPolicy, GroupPolicy } from "../../config/types.js";
import type { SecretInput } from "../../config/types.secrets.js";
import type { WizardPrompter } from "../../wizard/prompts.js";
import type { ChannelSetupDmPolicy, PromptAccountId } from "./setup-wizard-types.js";
import type { ChannelSetupWizard, ChannelSetupWizardAllowFromEntry } from "./setup-wizard.js";
export declare const promptAccountId: PromptAccountId;
export declare function addWildcardAllowFrom(allowFrom?: Array<string | number> | null): string[];
export declare function mergeAllowFromEntries(current: Array<string | number> | null | undefined, additions: Array<string | number>): string[];
export declare function splitSetupEntries(raw: string): string[];
type ParsedSetupEntry = {
    value: string;
} | {
    error: string;
};
export declare function parseSetupEntriesWithParser(raw: string, parseEntry: (entry: string) => ParsedSetupEntry): {
    entries: string[];
    error?: string;
};
export declare function parseSetupEntriesAllowingWildcard(raw: string, parseEntry: (entry: string) => ParsedSetupEntry): {
    entries: string[];
    error?: string;
};
export declare function parseMentionOrPrefixedId(params: {
    value: string;
    mentionPattern: RegExp;
    prefixPattern?: RegExp;
    idPattern: RegExp;
    normalizeId?: (id: string) => string;
}): string | null;
export declare function normalizeAllowFromEntries(entries: Array<string | number>, normalizeEntry?: (value: string) => string | null | undefined): string[];
export declare function resolveSetupAccountId(params: {
    accountId?: string;
    defaultAccountId: string;
}): string;
export declare function resolveAccountIdForConfigure(params: {
    cfg: WormAgentConfig;
    prompter: WizardPrompter;
    label: string;
    accountOverride?: string;
    shouldPromptAccountIds: boolean;
    listAccountIds: (cfg: WormAgentConfig) => string[];
    defaultAccountId: string;
}): Promise<string>;
export declare function setAccountAllowFromForChannel(params: {
    cfg: WormAgentConfig;
    channel: "imessage" | "signal";
    accountId: string;
    allowFrom: string[];
}): WormAgentConfig;
export declare function patchTopLevelChannelConfigSection(params: {
    cfg: WormAgentConfig;
    channel: string;
    enabled?: boolean;
    clearFields?: string[];
    patch: Record<string, unknown>;
}): WormAgentConfig;
export declare function patchNestedChannelConfigSection(params: {
    cfg: WormAgentConfig;
    channel: string;
    section: string;
    enabled?: boolean;
    clearFields?: string[];
    patch: Record<string, unknown>;
}): WormAgentConfig;
export declare function setTopLevelChannelAllowFrom(params: {
    cfg: WormAgentConfig;
    channel: string;
    allowFrom: string[];
    enabled?: boolean;
}): WormAgentConfig;
export declare function setNestedChannelAllowFrom(params: {
    cfg: WormAgentConfig;
    channel: string;
    section: string;
    allowFrom: string[];
    enabled?: boolean;
}): WormAgentConfig;
export declare function setTopLevelChannelDmPolicyWithAllowFrom(params: {
    cfg: WormAgentConfig;
    channel: string;
    dmPolicy: DmPolicy;
    getAllowFrom?: (cfg: WormAgentConfig) => Array<string | number> | undefined;
}): WormAgentConfig;
export declare function setNestedChannelDmPolicyWithAllowFrom(params: {
    cfg: WormAgentConfig;
    channel: string;
    section: string;
    dmPolicy: DmPolicy;
    getAllowFrom?: (cfg: WormAgentConfig) => Array<string | number> | undefined;
    enabled?: boolean;
}): WormAgentConfig;
export declare function setTopLevelChannelGroupPolicy(params: {
    cfg: WormAgentConfig;
    channel: string;
    groupPolicy: GroupPolicy;
    enabled?: boolean;
}): WormAgentConfig;
export declare function createTopLevelChannelDmPolicy(params: {
    label: string;
    channel: string;
    policyKey: string;
    allowFromKey: string;
    getCurrent: (cfg: WormAgentConfig) => DmPolicy;
    promptAllowFrom?: ChannelSetupDmPolicy["promptAllowFrom"];
    getAllowFrom?: (cfg: WormAgentConfig) => Array<string | number> | undefined;
}): ChannelSetupDmPolicy;
export declare function createNestedChannelDmPolicy(params: {
    label: string;
    channel: string;
    section: string;
    policyKey: string;
    allowFromKey: string;
    getCurrent: (cfg: WormAgentConfig) => DmPolicy;
    promptAllowFrom?: ChannelSetupDmPolicy["promptAllowFrom"];
    getAllowFrom?: (cfg: WormAgentConfig) => Array<string | number> | undefined;
    enabled?: boolean;
}): ChannelSetupDmPolicy;
export declare function createTopLevelChannelDmPolicySetter(params: {
    channel: string;
    getAllowFrom?: (cfg: WormAgentConfig) => Array<string | number> | undefined;
}): (cfg: WormAgentConfig, dmPolicy: DmPolicy) => WormAgentConfig;
export declare function createNestedChannelDmPolicySetter(params: {
    channel: string;
    section: string;
    getAllowFrom?: (cfg: WormAgentConfig) => Array<string | number> | undefined;
    enabled?: boolean;
}): (cfg: WormAgentConfig, dmPolicy: DmPolicy) => WormAgentConfig;
export declare function createTopLevelChannelAllowFromSetter(params: {
    channel: string;
    enabled?: boolean;
}): (cfg: WormAgentConfig, allowFrom: string[]) => WormAgentConfig;
export declare function createNestedChannelAllowFromSetter(params: {
    channel: string;
    section: string;
    enabled?: boolean;
}): (cfg: WormAgentConfig, allowFrom: string[]) => WormAgentConfig;
export declare function createTopLevelChannelGroupPolicySetter(params: {
    channel: string;
    enabled?: boolean;
}): (cfg: WormAgentConfig, groupPolicy: "open" | "allowlist" | "disabled") => WormAgentConfig;
export declare function setChannelDmPolicyWithAllowFrom(params: {
    cfg: WormAgentConfig;
    channel: "imessage" | "signal" | "telegram";
    dmPolicy: DmPolicy;
}): WormAgentConfig;
export declare function setLegacyChannelDmPolicyWithAllowFrom(params: {
    cfg: WormAgentConfig;
    channel: LegacyDmChannel;
    dmPolicy: DmPolicy;
}): WormAgentConfig;
export declare function setLegacyChannelAllowFrom(params: {
    cfg: WormAgentConfig;
    channel: LegacyDmChannel;
    allowFrom: string[];
}): WormAgentConfig;
export declare function setAccountGroupPolicyForChannel(params: {
    cfg: WormAgentConfig;
    channel: "discord" | "slack";
    accountId: string;
    groupPolicy: GroupPolicy;
}): WormAgentConfig;
export declare function setAccountDmAllowFromForChannel(params: {
    cfg: WormAgentConfig;
    channel: "discord" | "slack";
    accountId: string;
    allowFrom: string[];
}): WormAgentConfig;
export declare function createLegacyCompatChannelDmPolicy(params: {
    label: string;
    channel: LegacyDmChannel;
    promptAllowFrom?: ChannelSetupDmPolicy["promptAllowFrom"];
}): ChannelSetupDmPolicy;
export declare function resolveGroupAllowlistWithLookupNotes<TResolved>(params: {
    label: string;
    prompter: Pick<WizardPrompter, "note">;
    entries: string[];
    fallback: TResolved;
    resolve: () => Promise<TResolved>;
}): Promise<TResolved>;
export declare function createAccountScopedAllowFromSection(params: {
    channel: "discord" | "slack";
    credentialInputKey?: NonNullable<ChannelSetupWizard["allowFrom"]>["credentialInputKey"];
    helpTitle?: string;
    helpLines?: string[];
    message: string;
    placeholder: string;
    invalidWithoutCredentialNote: string;
    parseId: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["parseId"]>;
    resolveEntries: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["resolveEntries"]>;
}): NonNullable<ChannelSetupWizard["allowFrom"]>;
export declare function createAccountScopedGroupAccessSection<TResolved>(params: {
    channel: "discord" | "slack";
    label: string;
    placeholder: string;
    helpTitle?: string;
    helpLines?: string[];
    skipAllowlistEntries?: boolean;
    currentPolicy: NonNullable<ChannelSetupWizard["groupAccess"]>["currentPolicy"];
    currentEntries: NonNullable<ChannelSetupWizard["groupAccess"]>["currentEntries"];
    updatePrompt: NonNullable<ChannelSetupWizard["groupAccess"]>["updatePrompt"];
    resolveAllowlist?: NonNullable<NonNullable<ChannelSetupWizard["groupAccess"]>["resolveAllowlist"]>;
    fallbackResolved: (entries: string[]) => TResolved;
    applyAllowlist: (params: {
        cfg: WormAgentConfig;
        accountId: string;
        resolved: TResolved;
    }) => WormAgentConfig;
}): NonNullable<ChannelSetupWizard["groupAccess"]>;
type AccountScopedChannel = "bluebubbles" | "discord" | "imessage" | "line" | "signal" | "slack" | "telegram";
type LegacyDmChannel = "discord" | "slack";
export declare function patchLegacyDmChannelConfig(params: {
    cfg: WormAgentConfig;
    channel: LegacyDmChannel;
    patch: Record<string, unknown>;
}): WormAgentConfig;
export declare function setSetupChannelEnabled(cfg: WormAgentConfig, channel: string, enabled: boolean): WormAgentConfig;
export declare function patchChannelConfigForAccount(params: {
    cfg: WormAgentConfig;
    channel: AccountScopedChannel;
    accountId: string;
    patch: Record<string, unknown>;
}): WormAgentConfig;
export declare function applySingleTokenPromptResult(params: {
    cfg: WormAgentConfig;
    channel: "discord" | "telegram";
    accountId: string;
    tokenPatchKey: "token" | "botToken";
    tokenResult: {
        useEnv: boolean;
        token: SecretInput | null;
    };
}): WormAgentConfig;
export declare function buildSingleChannelSecretPromptState(params: {
    accountConfigured: boolean;
    hasConfigToken: boolean;
    allowEnv: boolean;
    envValue?: string;
}): {
    accountConfigured: boolean;
    hasConfigToken: boolean;
    canUseEnv: boolean;
};
export declare function promptSingleChannelToken(params: {
    prompter: Pick<WizardPrompter, "confirm" | "text">;
    accountConfigured: boolean;
    canUseEnv: boolean;
    hasConfigToken: boolean;
    envPrompt: string;
    keepPrompt: string;
    inputPrompt: string;
}): Promise<{
    useEnv: boolean;
    token: string | null;
}>;
export type SingleChannelSecretInputPromptResult = {
    action: "keep";
} | {
    action: "use-env";
} | {
    action: "set";
    value: SecretInput;
    resolvedValue: string;
};
export declare function runSingleChannelSecretStep(params: {
    cfg: WormAgentConfig;
    prompter: Pick<WizardPrompter, "confirm" | "text" | "select" | "note">;
    providerHint: string;
    credentialLabel: string;
    secretInputMode?: "plaintext" | "ref";
    accountConfigured: boolean;
    hasConfigToken: boolean;
    allowEnv: boolean;
    envValue?: string;
    envPrompt: string;
    keepPrompt: string;
    inputPrompt: string;
    preferredEnvVar?: string;
    onMissingConfigured?: () => Promise<void>;
    applyUseEnv?: (cfg: WormAgentConfig) => WormAgentConfig | Promise<WormAgentConfig>;
    applySet?: (cfg: WormAgentConfig, value: SecretInput, resolvedValue: string) => WormAgentConfig | Promise<WormAgentConfig>;
}): Promise<{
    cfg: WormAgentConfig;
    action: SingleChannelSecretInputPromptResult["action"];
    resolvedValue?: string;
}>;
export declare function promptSingleChannelSecretInput(params: {
    cfg: WormAgentConfig;
    prompter: Pick<WizardPrompter, "confirm" | "text" | "select" | "note">;
    providerHint: string;
    credentialLabel: string;
    secretInputMode?: "plaintext" | "ref";
    accountConfigured: boolean;
    canUseEnv: boolean;
    hasConfigToken: boolean;
    envPrompt: string;
    keepPrompt: string;
    inputPrompt: string;
    preferredEnvVar?: string;
}): Promise<SingleChannelSecretInputPromptResult>;
type ParsedAllowFromResult = {
    entries: string[];
    error?: string;
};
export declare function promptParsedAllowFromForAccount<TConfig extends WormAgentConfig>(params: {
    cfg: TConfig;
    accountId?: string;
    defaultAccountId: string;
    prompter: Pick<WizardPrompter, "note" | "text">;
    noteTitle: string;
    noteLines: string[];
    message: string;
    placeholder: string;
    parseEntries: (raw: string) => ParsedAllowFromResult;
    getExistingAllowFrom: (params: {
        cfg: TConfig;
        accountId: string;
    }) => Array<string | number>;
    mergeEntries?: (params: {
        existing: Array<string | number>;
        parsed: string[];
    }) => string[];
    applyAllowFrom: (params: {
        cfg: TConfig;
        accountId: string;
        allowFrom: string[];
    }) => TConfig | Promise<TConfig>;
}): Promise<TConfig>;
export declare function promptParsedAllowFromForScopedChannel(params: {
    cfg: WormAgentConfig;
    channel: "imessage" | "signal";
    accountId?: string;
    defaultAccountId: string;
    prompter: Pick<WizardPrompter, "note" | "text">;
    noteTitle: string;
    noteLines: string[];
    message: string;
    placeholder: string;
    parseEntries: (raw: string) => ParsedAllowFromResult;
    getExistingAllowFrom: (params: {
        cfg: WormAgentConfig;
        accountId: string;
    }) => Array<string | number>;
}): Promise<WormAgentConfig>;
export declare function resolveParsedAllowFromEntries(params: {
    entries: string[];
    parseId: (raw: string) => string | null;
}): ChannelSetupWizardAllowFromEntry[];
export declare function createAllowFromSection(params: {
    helpTitle?: string;
    helpLines?: string[];
    credentialInputKey?: NonNullable<ChannelSetupWizard["allowFrom"]>["credentialInputKey"];
    message: string;
    placeholder: string;
    invalidWithoutCredentialNote: string;
    parseInputs?: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["parseInputs"]>;
    parseId: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["parseId"]>;
    resolveEntries?: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["resolveEntries"]>;
    apply: NonNullable<NonNullable<ChannelSetupWizard["allowFrom"]>["apply"]>;
}): NonNullable<ChannelSetupWizard["allowFrom"]>;
export declare function noteChannelLookupSummary(params: {
    prompter: Pick<WizardPrompter, "note">;
    label: string;
    resolvedSections: Array<{
        title: string;
        values: string[];
    }>;
    unresolved?: string[];
}): Promise<void>;
export declare function noteChannelLookupFailure(params: {
    prompter: Pick<WizardPrompter, "note">;
    label: string;
    error: unknown;
}): Promise<void>;
type AllowFromResolution = {
    input: string;
    resolved: boolean;
    id?: string | null;
};
export declare function resolveEntriesWithOptionalToken<TResult>(params: {
    token?: string | null;
    entries: string[];
    buildWithoutToken: (input: string) => TResult;
    resolveEntries: (params: {
        token: string;
        entries: string[];
    }) => Promise<TResult[]>;
}): Promise<TResult[]>;
export declare function promptResolvedAllowFrom(params: {
    prompter: WizardPrompter;
    existing: Array<string | number>;
    token?: string | null;
    message: string;
    placeholder: string;
    label: string;
    parseInputs: (value: string) => string[];
    parseId: (value: string) => string | null;
    invalidWithoutTokenNote: string;
    resolveEntries: (params: {
        token: string;
        entries: string[];
    }) => Promise<AllowFromResolution[]>;
}): Promise<string[]>;
export declare function promptLegacyChannelAllowFrom(params: {
    cfg: WormAgentConfig;
    channel: LegacyDmChannel;
    prompter: WizardPrompter;
    existing: Array<string | number>;
    token?: string | null;
    noteTitle: string;
    noteLines: string[];
    message: string;
    placeholder: string;
    parseId: (value: string) => string | null;
    invalidWithoutTokenNote: string;
    resolveEntries: (params: {
        token: string;
        entries: string[];
    }) => Promise<AllowFromResolution[]>;
}): Promise<WormAgentConfig>;
export declare function promptLegacyChannelAllowFromForAccount<TAccount>(params: {
    cfg: WormAgentConfig;
    channel: LegacyDmChannel;
    prompter: WizardPrompter;
    accountId?: string;
    defaultAccountId: string;
    resolveAccount: (cfg: WormAgentConfig, accountId: string) => TAccount;
    resolveExisting: (account: TAccount, cfg: WormAgentConfig) => Array<string | number>;
    resolveToken: (account: TAccount) => string | null | undefined;
    noteTitle: string;
    noteLines: string[];
    message: string;
    placeholder: string;
    parseId: (value: string) => string | null;
    invalidWithoutTokenNote: string;
    resolveEntries: (params: {
        token: string;
        entries: string[];
    }) => Promise<AllowFromResolution[]>;
}): Promise<WormAgentConfig>;
export {};
