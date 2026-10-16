import type { WormAgentConfig } from "../../config/config.js";
import type { WizardPrompter } from "../../wizard/prompts.js";
import { type ChannelAccessPolicy } from "./setup-group-access.js";
export declare function configureChannelAccessWithAllowlist<TResolved>(params: {
    cfg: WormAgentConfig;
    prompter: WizardPrompter;
    label: string;
    currentPolicy: ChannelAccessPolicy;
    currentEntries: string[];
    placeholder: string;
    updatePrompt: boolean;
    skipAllowlistEntries?: boolean;
    setPolicy: (cfg: WormAgentConfig, policy: ChannelAccessPolicy) => WormAgentConfig;
    resolveAllowlist?: (params: {
        cfg: WormAgentConfig;
        entries: string[];
    }) => Promise<TResolved>;
    applyAllowlist?: (params: {
        cfg: WormAgentConfig;
        resolved: TResolved;
    }) => WormAgentConfig;
}): Promise<WormAgentConfig>;
