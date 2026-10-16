import { type GroupToolPolicyConfig } from "wormagent/plugin-sdk/channel-policy";
import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
type BlueBubblesGroupContext = {
    cfg: WormAgentConfig;
    accountId?: string | null;
    groupId?: string | null;
    senderId?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
};
export declare function resolveBlueBubblesGroupRequireMention(params: BlueBubblesGroupContext): boolean;
export declare function resolveBlueBubblesGroupToolPolicy(params: BlueBubblesGroupContext): GroupToolPolicyConfig | undefined;
export {};
