import { type WormAgentConfig } from "wormagent/plugin-sdk/account-resolution";
import type { SlackAccountSurfaceFields } from "./account-surface-fields.js";
import type { SlackAccountConfig } from "./runtime-api.js";
export type SlackTokenSource = "env" | "config" | "none";
export type ResolvedSlackAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    botToken?: string;
    appToken?: string;
    userToken?: string;
    botTokenSource: SlackTokenSource;
    appTokenSource: SlackTokenSource;
    userTokenSource: SlackTokenSource;
    config: SlackAccountConfig;
} & SlackAccountSurfaceFields;
export declare const listSlackAccountIds: (cfg: WormAgentConfig) => string[];
export declare const resolveDefaultSlackAccountId: (cfg: WormAgentConfig) => string;
export declare function mergeSlackAccountConfig(cfg: WormAgentConfig, accountId: string): SlackAccountConfig;
export declare function resolveSlackAccount(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): ResolvedSlackAccount;
export declare function listEnabledSlackAccounts(cfg: WormAgentConfig): ResolvedSlackAccount[];
export declare function resolveSlackReplyToMode(account: ResolvedSlackAccount, chatType?: string | null): "off" | "first" | "all";
