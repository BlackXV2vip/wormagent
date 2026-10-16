import { type WormAgentConfig } from "wormagent/plugin-sdk/account-resolution";
import type { DmPolicy, GroupPolicy, WhatsAppAccountConfig } from "./runtime-api.js";
export type ResolvedWhatsAppAccount = {
    accountId: string;
    name?: string;
    enabled: boolean;
    sendReadReceipts: boolean;
    messagePrefix?: string;
    defaultTo?: string;
    authDir: string;
    isLegacyAuthDir: boolean;
    selfChatMode?: boolean;
    allowFrom?: string[];
    groupAllowFrom?: string[];
    groupPolicy?: GroupPolicy;
    dmPolicy?: DmPolicy;
    textChunkLimit?: number;
    chunkMode?: "length" | "newline";
    mediaMaxMb?: number;
    blockStreaming?: boolean;
    ackReaction?: WhatsAppAccountConfig["ackReaction"];
    groups?: WhatsAppAccountConfig["groups"];
    debounceMs?: number;
};
export declare const DEFAULT_WHATSAPP_MEDIA_MAX_MB = 50;
export declare const listWhatsAppAccountIds: (cfg: WormAgentConfig) => string[];
export declare const resolveDefaultWhatsAppAccountId: (cfg: WormAgentConfig) => string;
export declare function listWhatsAppAuthDirs(cfg: WormAgentConfig): string[];
export declare function hasAnyWhatsAppAuth(cfg: WormAgentConfig): boolean;
export declare function resolveWhatsAppAuthDir(params: {
    cfg: WormAgentConfig;
    accountId: string;
}): {
    authDir: string;
    isLegacy: boolean;
};
export declare function resolveWhatsAppAccount(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): ResolvedWhatsAppAccount;
export declare function resolveWhatsAppMediaMaxBytes(account: Pick<ResolvedWhatsAppAccount, "mediaMaxMb">): number;
export declare function listEnabledWhatsAppAccounts(cfg: WormAgentConfig): ResolvedWhatsAppAccount[];
