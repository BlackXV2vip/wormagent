import type { SkillCommandSpec } from "../agents/skills.js";
import type { WormAgentConfig } from "../config/types.js";
import type { ChatCommandDefinition, CommandArgDefinition, CommandArgs, CommandDetection, CommandNormalizeOptions, NativeCommandSpec, ShouldHandleTextCommandsParams } from "./commands-registry.types.js";
export type { ChatCommandDefinition, CommandArgChoiceContext, CommandArgDefinition, CommandArgMenuSpec, CommandArgValues, CommandArgs, CommandDetection, CommandNormalizeOptions, CommandScope, NativeCommandSpec, ShouldHandleTextCommandsParams, } from "./commands-registry.types.js";
export declare function listChatCommands(params?: {
    skillCommands?: SkillCommandSpec[];
}): ChatCommandDefinition[];
export declare function isCommandEnabled(cfg: WormAgentConfig, commandKey: string): boolean;
export declare function listChatCommandsForConfig(cfg: WormAgentConfig, params?: {
    skillCommands?: SkillCommandSpec[];
}): ChatCommandDefinition[];
export declare function listNativeCommandSpecs(params?: {
    skillCommands?: SkillCommandSpec[];
    provider?: string;
}): NativeCommandSpec[];
export declare function listNativeCommandSpecsForConfig(cfg: WormAgentConfig, params?: {
    skillCommands?: SkillCommandSpec[];
    provider?: string;
}): NativeCommandSpec[];
export declare function findCommandByNativeName(name: string, provider?: string): ChatCommandDefinition | undefined;
export declare function buildCommandText(commandName: string, args?: string): string;
export declare function parseCommandArgs(command: ChatCommandDefinition, raw?: string): CommandArgs | undefined;
export declare function serializeCommandArgs(command: ChatCommandDefinition, args?: CommandArgs): string | undefined;
export declare function buildCommandTextFromArgs(command: ChatCommandDefinition, args?: CommandArgs): string;
export type ResolvedCommandArgChoice = {
    value: string;
    label: string;
};
export declare function resolveCommandArgChoices(params: {
    command: ChatCommandDefinition;
    arg: CommandArgDefinition;
    cfg?: WormAgentConfig;
    provider?: string;
    model?: string;
}): ResolvedCommandArgChoice[];
export declare function resolveCommandArgMenu(params: {
    command: ChatCommandDefinition;
    args?: CommandArgs;
    cfg?: WormAgentConfig;
}): {
    arg: CommandArgDefinition;
    choices: ResolvedCommandArgChoice[];
    title?: string;
} | null;
export declare function normalizeCommandBody(raw: string, options?: CommandNormalizeOptions): string;
export declare function isCommandMessage(raw: string): boolean;
export declare function getCommandDetection(_cfg?: WormAgentConfig): CommandDetection;
export declare function maybeResolveTextAlias(raw: string, cfg?: WormAgentConfig): string | null;
export declare function resolveTextCommand(raw: string, cfg?: WormAgentConfig): {
    command: ChatCommandDefinition;
    args?: string;
} | null;
export declare function isNativeCommandSurface(surface?: string): boolean;
export declare function shouldHandleTextCommands(params: ShouldHandleTextCommandsParams): boolean;
