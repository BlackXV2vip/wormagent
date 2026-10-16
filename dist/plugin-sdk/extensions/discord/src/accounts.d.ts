import { type WormAgentConfig, type DiscordAccountConfig, type DiscordActionConfig } from "./runtime-api.js";
export type ResolvedDiscordAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    token: string;
    tokenSource: "env" | "config" | "none";
    config: DiscordAccountConfig;
};
export declare const listDiscordAccountIds: (cfg: WormAgentConfig) => string[];
export declare const resolveDefaultDiscordAccountId: (cfg: WormAgentConfig) => string;
export declare function resolveDiscordAccountConfig(cfg: WormAgentConfig, accountId: string): DiscordAccountConfig | undefined;
export declare function mergeDiscordAccountConfig(cfg: WormAgentConfig, accountId: string): DiscordAccountConfig;
export declare function createDiscordActionGate(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): (key: keyof DiscordActionConfig, defaultValue?: boolean) => boolean;
export declare function resolveDiscordAccount(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): ResolvedDiscordAccount;
export declare function resolveDiscordMaxLinesPerMessage(params: {
    cfg: WormAgentConfig;
    discordConfig?: DiscordAccountConfig | null;
    accountId?: string | null;
}): number | undefined;
export declare function listEnabledDiscordAccounts(cfg: WormAgentConfig): ResolvedDiscordAccount[];
