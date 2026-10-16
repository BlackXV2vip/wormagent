import type { WormAgentConfig } from "../../config/config.js";
export type SessionHookContext = {
    sessionId: string;
    sessionKey: string;
    agentId: string;
};
export declare function buildSessionStartHookPayload(params: {
    sessionId: string;
    sessionKey: string;
    cfg: WormAgentConfig;
    resumedFrom?: string;
}): {
    event: {
        sessionId: string;
        sessionKey: string;
        resumedFrom?: string;
    };
    context: SessionHookContext;
};
export declare function buildSessionEndHookPayload(params: {
    sessionId: string;
    sessionKey: string;
    cfg: WormAgentConfig;
    messageCount?: number;
}): {
    event: {
        sessionId: string;
        sessionKey: string;
        messageCount: number;
    };
    context: SessionHookContext;
};
