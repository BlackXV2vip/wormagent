import { type GroupToolPolicyConfig } from "wormagent/plugin-sdk/channel-policy";
import type { WormAgentConfig } from "wormagent/plugin-sdk/core";
type IMessageGroupContext = {
    cfg: WormAgentConfig;
    accountId?: string | null;
    groupId?: string | null;
    senderId?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
};
export declare function resolveIMessageGroupRequireMention(params: IMessageGroupContext): boolean;
export declare function resolveIMessageGroupToolPolicy(params: IMessageGroupContext): GroupToolPolicyConfig | undefined;
export {};
