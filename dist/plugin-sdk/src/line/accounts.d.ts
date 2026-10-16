import type { WormAgentConfig } from "../config/config.js";
import type { ResolvedLineAccount } from "./types.js";
export { DEFAULT_ACCOUNT_ID } from "../routing/account-id.js";
export declare function resolveLineAccount(params: {
    cfg: WormAgentConfig;
    accountId?: string;
}): ResolvedLineAccount;
export declare function listLineAccountIds(cfg: WormAgentConfig): string[];
export declare function resolveDefaultLineAccountId(cfg: WormAgentConfig): string;
export declare function normalizeAccountId(accountId: string | undefined): string;
