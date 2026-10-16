import { type WormAgentConfig } from "./runtime-api.js";
export declare function resolveAuthorizedWhatsAppOutboundTarget(params: {
    cfg: WormAgentConfig;
    chatJid: string;
    accountId?: string;
    actionLabel: string;
}): {
    to: string;
    accountId: string;
};
