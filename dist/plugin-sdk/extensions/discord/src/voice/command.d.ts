import { CommandWithSubcommands } from "@buape/carbon";
import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import type { DiscordAccountConfig } from "wormagent/plugin-sdk/config-runtime";
import type { DiscordVoiceManager } from "./manager.js";
type VoiceCommandContext = {
    cfg: WormAgentConfig;
    discordConfig: DiscordAccountConfig;
    accountId: string;
    groupPolicy: "open" | "disabled" | "allowlist";
    useAccessGroups: boolean;
    getManager: () => DiscordVoiceManager | null;
    ephemeralDefault: boolean;
};
export declare function createDiscordVoiceCommand(params: VoiceCommandContext): CommandWithSubcommands;
export {};
