import { type WormAgentConfig } from "wormagent/plugin-sdk/account-resolution";
import type { IMessageAccountConfig } from "../runtime-api.js";
export type ResolvedIMessageAccount = {
    accountId: string;
    enabled: boolean;
    name?: string;
    config: IMessageAccountConfig;
    configured: boolean;
};
export declare const listIMessageAccountIds: (cfg: WormAgentConfig) => string[];
export declare const resolveDefaultIMessageAccountId: (cfg: WormAgentConfig) => string;
export declare function resolveIMessageAccount(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): ResolvedIMessageAccount;
export declare function listEnabledIMessageAccounts(cfg: WormAgentConfig): ResolvedIMessageAccount[];
