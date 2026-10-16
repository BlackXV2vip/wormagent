import type { WormAgentConfig } from "../../config/config.js";
import type { DmPolicy } from "../../config/types.js";
import type { RuntimeEnv } from "../../runtime.js";
import type { WizardPrompter } from "../../wizard/prompts.js";
import type { ChannelId, ChannelPlugin } from "./types.js";
export type ChannelSetupPlugin = Pick<ChannelPlugin, "id" | "meta" | "capabilities" | "config" | "setup" | "setupWizard">;
export type SetupChannelsOptions = {
    allowDisable?: boolean;
    allowSignalInstall?: boolean;
    onSelection?: (selection: ChannelId[]) => void;
    accountIds?: Partial<Record<ChannelId, string>>;
    onAccountId?: (channel: ChannelId, accountId: string) => void;
    onResolvedPlugin?: (channel: ChannelId, plugin: ChannelSetupPlugin) => void;
    promptAccountIds?: boolean;
    whatsappAccountId?: string;
    promptWhatsAppAccountId?: boolean;
    onWhatsAppAccountId?: (accountId: string) => void;
    forceAllowFromChannels?: ChannelId[];
    skipStatusNote?: boolean;
    skipDmPolicyPrompt?: boolean;
    skipConfirm?: boolean;
    quickstartDefaults?: boolean;
    initialSelection?: ChannelId[];
    secretInputMode?: "plaintext" | "ref";
};
export type PromptAccountIdParams = {
    cfg: WormAgentConfig;
    prompter: WizardPrompter;
    label: string;
    currentId?: string;
    listAccountIds: (cfg: WormAgentConfig) => string[];
    defaultAccountId: string;
};
export type PromptAccountId = (params: PromptAccountIdParams) => Promise<string>;
export type ChannelSetupStatus = {
    channel: ChannelId;
    configured: boolean;
    statusLines: string[];
    selectionHint?: string;
    quickstartScore?: number;
};
export type ChannelSetupStatusContext = {
    cfg: WormAgentConfig;
    options?: SetupChannelsOptions;
    accountOverrides: Partial<Record<ChannelId, string>>;
};
export type ChannelSetupConfigureContext = {
    cfg: WormAgentConfig;
    runtime: RuntimeEnv;
    prompter: WizardPrompter;
    options?: SetupChannelsOptions;
    accountOverrides: Partial<Record<ChannelId, string>>;
    shouldPromptAccountIds: boolean;
    forceAllowFrom: boolean;
};
export type ChannelSetupResult = {
    cfg: WormAgentConfig;
    accountId?: string;
};
export type ChannelSetupConfiguredResult = ChannelSetupResult | "skip";
export type ChannelSetupInteractiveContext = ChannelSetupConfigureContext & {
    configured: boolean;
    label: string;
};
export type ChannelSetupDmPolicy = {
    label: string;
    channel: ChannelId;
    policyKey: string;
    allowFromKey: string;
    getCurrent: (cfg: WormAgentConfig) => DmPolicy;
    setPolicy: (cfg: WormAgentConfig, policy: DmPolicy) => WormAgentConfig;
    promptAllowFrom?: (params: {
        cfg: WormAgentConfig;
        prompter: WizardPrompter;
        accountId?: string;
    }) => Promise<WormAgentConfig>;
};
export type ChannelSetupWizardAdapter = {
    channel: ChannelId;
    getStatus: (ctx: ChannelSetupStatusContext) => Promise<ChannelSetupStatus>;
    configure: (ctx: ChannelSetupConfigureContext) => Promise<ChannelSetupResult>;
    configureInteractive?: (ctx: ChannelSetupInteractiveContext) => Promise<ChannelSetupConfiguredResult>;
    configureWhenConfigured?: (ctx: ChannelSetupInteractiveContext) => Promise<ChannelSetupConfiguredResult>;
    dmPolicy?: ChannelSetupDmPolicy;
    onAccountRecorded?: (accountId: string, options?: SetupChannelsOptions) => void;
    disable?: (cfg: WormAgentConfig) => WormAgentConfig;
};
