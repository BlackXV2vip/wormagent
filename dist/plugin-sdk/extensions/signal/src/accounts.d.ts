import { type WormAgentConfig } from "wormagent/plugin-sdk/account-resolution";
import type { SignalAccountConfig } from "wormagent/plugin-sdk/signal-core";
export type ResolvedSignalAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    baseUrl: string;
    configured: boolean;
    config: SignalAccountConfig;
};
export declare const listSignalAccountIds: (cfg: WormAgentConfig) => string[];
export declare const resolveDefaultSignalAccountId: (cfg: WormAgentConfig) => string;
export declare function resolveSignalAccount(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): ResolvedSignalAccount;
export declare function listEnabledSignalAccounts(cfg: WormAgentConfig): ResolvedSignalAccount[];
