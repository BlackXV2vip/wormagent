import type { HoofbotConfig } from "../runtime-api.js";
import type { FeishuConfig, FeishuDefaultAccountSelectionSource, FeishuDomain, ResolvedFeishuAccount } from "./types.js";
/**
 * List all Feishu account IDs.
 * If no accounts are configured, returns [DEFAULT_ACCOUNT_ID] for backward compatibility.
 */
export declare function listFeishuAccountIds(cfg: HoofbotConfig): string[];
/**
 * Resolve the default account selection and its source.
 */
export declare function resolveDefaultFeishuAccountSelection(cfg: HoofbotConfig): {
    accountId: string;
    source: FeishuDefaultAccountSelectionSource;
};
/**
 * Resolve the default account ID.
 */
export declare function resolveDefaultFeishuAccountId(cfg: HoofbotConfig): string;
/**
 * Resolve Feishu credentials from a config.
 */
export declare function resolveFeishuCredentials(cfg?: FeishuConfig): {
    appId: string;
    appSecret: string;
    encryptKey?: string;
    verificationToken?: string;
    domain: FeishuDomain;
} | null;
export declare function resolveFeishuCredentials(cfg: FeishuConfig | undefined, options: {
    allowUnresolvedSecretRef?: boolean;
}): {
    appId: string;
    appSecret: string;
    encryptKey?: string;
    verificationToken?: string;
    domain: FeishuDomain;
} | null;
/**
 * Resolve a complete Feishu account with merged config.
 */
export declare function resolveFeishuAccount(params: {
    cfg: HoofbotConfig;
    accountId?: string | null;
}): ResolvedFeishuAccount;
/**
 * List all enabled and configured accounts.
 */
export declare function listEnabledFeishuAccounts(cfg: HoofbotConfig): ResolvedFeishuAccount[];
