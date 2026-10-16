/**
 * Plugin Command Registry
 *
 * Manages commands registered by plugins that bypass the LLM agent.
 * These commands are processed before built-in commands and before agent invocation.
 */
import type { WormAgentConfig } from "../config/config.js";
import type { WormAgentPluginCommandDefinition, PluginCommandContext, PluginCommandResult } from "./types.js";
type RegisteredPluginCommand = WormAgentPluginCommandDefinition & {
    pluginId: string;
    pluginName?: string;
    pluginRoot?: string;
};
/**
 * Validate a command name.
 * Returns an error message if invalid, or null if valid.
 */
export declare function validateCommandName(name: string): string | null;
export type CommandRegistrationResult = {
    ok: boolean;
    error?: string;
};
/**
 * Validate a plugin command definition without registering it.
 * Returns an error message if invalid, or null if valid.
 * Shared by both the global registration path and snapshot (non-activating) loads.
 */
export declare function validatePluginCommandDefinition(command: WormAgentPluginCommandDefinition): string | null;
/**
 * Register a plugin command.
 * Returns an error if the command name is invalid or reserved.
 */
export declare function registerPluginCommand(pluginId: string, command: WormAgentPluginCommandDefinition, opts?: {
    pluginName?: string;
    pluginRoot?: string;
}): CommandRegistrationResult;
/**
 * Clear all registered plugin commands.
 * Called during plugin reload.
 */
export declare function clearPluginCommands(): void;
/**
 * Clear plugin commands for a specific plugin.
 */
export declare function clearPluginCommandsForPlugin(pluginId: string): void;
/**
 * Check if a command body matches a registered plugin command.
 * Returns the command definition and parsed args if matched.
 *
 * Note: If a command has `acceptsArgs: false` and the user provides arguments,
 * the command will not match. This allows the message to fall through to
 * built-in handlers or the agent. Document this behavior to plugin authors.
 */
export declare function matchPluginCommand(commandBody: string): {
    command: RegisteredPluginCommand;
    args?: string;
} | null;
declare function resolveBindingConversationFromCommand(params: {
    channel: string;
    from?: string;
    to?: string;
    accountId?: string;
    messageThreadId?: number;
}): {
    channel: string;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
    threadId?: string | number;
} | null;
/**
 * Execute a plugin command handler.
 *
 * Note: Plugin authors should still validate and sanitize ctx.args for their
 * specific use case. This function provides basic defense-in-depth sanitization.
 */
export declare function executePluginCommand(params: {
    command: RegisteredPluginCommand;
    args?: string;
    senderId?: string;
    channel: string;
    channelId?: PluginCommandContext["channelId"];
    isAuthorizedSender: boolean;
    commandBody: string;
    config: WormAgentConfig;
    from?: PluginCommandContext["from"];
    to?: PluginCommandContext["to"];
    accountId?: PluginCommandContext["accountId"];
    messageThreadId?: PluginCommandContext["messageThreadId"];
}): Promise<PluginCommandResult>;
/**
 * List all registered plugin commands.
 * Used for /help and /commands output.
 */
export declare function listPluginCommands(): Array<{
    name: string;
    description: string;
    pluginId: string;
}>;
/**
 * Get plugin command specs for native command registration (e.g., Telegram).
 */
export declare function getPluginCommandSpecs(provider?: string): Array<{
    name: string;
    description: string;
    acceptsArgs: boolean;
}>;
export declare const __testing: {
    resolveBindingConversationFromCommand: typeof resolveBindingConversationFromCommand;
};
export {};
