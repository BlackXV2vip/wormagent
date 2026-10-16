import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import { type ReactionLevel, type ResolvedReactionLevel as BaseResolvedReactionLevel } from "wormagent/plugin-sdk/text-runtime";
export type TelegramReactionLevel = ReactionLevel;
export type ResolvedReactionLevel = BaseResolvedReactionLevel;
/**
 * Resolve the effective reaction level and its implications.
 */
export declare function resolveTelegramReactionLevel(params: {
    cfg: WormAgentConfig;
    accountId?: string;
}): ResolvedReactionLevel;
