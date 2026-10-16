import type { WormAgentConfig } from "../../config/config.js";
export declare function buildEmbeddedMessageActionDiscoveryInput(params: {
    cfg?: WormAgentConfig;
    channel: string;
    currentChannelId?: string | null;
    currentThreadTs?: string | null;
    currentMessageId?: string | number | null;
    accountId?: string | null;
    sessionKey?: string | null;
    sessionId?: string | null;
    agentId?: string | null;
    senderId?: string | null;
}): {
    cfg: WormAgentConfig | undefined;
    channel: string;
    currentChannelId: string | undefined;
    currentThreadTs: string | undefined;
    currentMessageId: string | number | undefined;
    accountId: string | undefined;
    sessionKey: string | undefined;
    sessionId: string | undefined;
    agentId: string | undefined;
    requesterSenderId: string | undefined;
};
