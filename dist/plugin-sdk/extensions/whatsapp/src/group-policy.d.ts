import { type GroupToolPolicyConfig } from "wormagent/plugin-sdk/channel-policy";
import type { WormAgentConfig } from "./runtime-api.js";
type WhatsAppGroupContext = {
    cfg: WormAgentConfig;
    accountId?: string | null;
    groupId?: string | null;
    senderId?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
};
export declare function resolveWhatsAppGroupRequireMention(params: WhatsAppGroupContext): boolean;
export declare function resolveWhatsAppGroupToolPolicy(params: WhatsAppGroupContext): GroupToolPolicyConfig | undefined;
export {};
