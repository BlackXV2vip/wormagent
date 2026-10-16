import type { WormAgentConfig } from "./runtime-api.js";
import type { ResolvedZaloAccount } from "./types.js";
export type { ResolvedZaloAccount };
declare const listZaloAccountIds: (cfg: WormAgentConfig) => string[], resolveDefaultZaloAccountId: (cfg: WormAgentConfig) => string;
export { listZaloAccountIds, resolveDefaultZaloAccountId };
export declare function resolveZaloAccount(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
    allowUnresolvedSecretRef?: boolean;
}): ResolvedZaloAccount;
export declare function listEnabledZaloAccounts(cfg: WormAgentConfig): ResolvedZaloAccount[];
