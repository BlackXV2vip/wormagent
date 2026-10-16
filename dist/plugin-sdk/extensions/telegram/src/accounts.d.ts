import { type WormAgentConfig } from "wormagent/plugin-sdk/account-resolution";
import type { TelegramAccountConfig, TelegramActionConfig } from "../runtime-api.js";
export type ResolvedTelegramAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    token: string;
    tokenSource: "env" | "tokenFile" | "config" | "none";
    config: TelegramAccountConfig;
};
export declare function listTelegramAccountIds(cfg: WormAgentConfig): string[];
/** @internal Reset the once-per-process warning flag. Exported for tests only. */
export declare function resetMissingDefaultWarnFlag(): void;
export declare function resolveDefaultTelegramAccountId(cfg: WormAgentConfig): string;
export declare function resolveTelegramAccountConfig(cfg: WormAgentConfig, accountId: string): TelegramAccountConfig | undefined;
export declare function mergeTelegramAccountConfig(cfg: WormAgentConfig, accountId: string): TelegramAccountConfig;
export declare function createTelegramActionGate(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): (key: keyof TelegramActionConfig, defaultValue?: boolean) => boolean;
export type TelegramPollActionGateState = {
    sendMessageEnabled: boolean;
    pollEnabled: boolean;
    enabled: boolean;
};
export declare function resolveTelegramPollActionGateState(isActionEnabled: (key: keyof TelegramActionConfig, defaultValue?: boolean) => boolean): TelegramPollActionGateState;
export declare function resolveTelegramAccount(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): ResolvedTelegramAccount;
export declare function listEnabledTelegramAccounts(cfg: WormAgentConfig): ResolvedTelegramAccount[];
