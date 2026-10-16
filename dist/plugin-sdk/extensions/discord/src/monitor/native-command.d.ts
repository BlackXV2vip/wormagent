import { Button, Command, StringSelectMenu } from "@buape/carbon";
import type { WormAgentConfig, loadConfig } from "wormagent/plugin-sdk/config-runtime";
import type { NativeCommandSpec } from "wormagent/plugin-sdk/reply-runtime";
import { type DiscordCommandArgContext, type DiscordModelPickerContext } from "./native-command-ui.js";
import type { ThreadBindingManager } from "./thread-bindings.js";
type DiscordConfig = NonNullable<WormAgentConfig["channels"]>["discord"];
export declare function createDiscordNativeCommand(params: {
    command: NativeCommandSpec;
    cfg: ReturnType<typeof loadConfig>;
    discordConfig: DiscordConfig;
    accountId: string;
    sessionPrefix: string;
    ephemeralDefault: boolean;
    threadBindings: ThreadBindingManager;
}): Command;
export declare function createDiscordCommandArgFallbackButton(params: DiscordCommandArgContext): Button;
export declare function createDiscordModelPickerFallbackButton(params: DiscordModelPickerContext): Button;
export declare function createDiscordModelPickerFallbackSelect(params: DiscordModelPickerContext): StringSelectMenu;
export {};
