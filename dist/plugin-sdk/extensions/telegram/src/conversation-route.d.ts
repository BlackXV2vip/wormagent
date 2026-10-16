import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import { type ConfiguredBindingRouteResult } from "wormagent/plugin-sdk/conversation-runtime";
import { resolveAgentRoute } from "wormagent/plugin-sdk/routing";
export declare function resolveTelegramConversationRoute(params: {
    cfg: WormAgentConfig;
    accountId: string;
    chatId: number | string;
    isGroup: boolean;
    resolvedThreadId?: number;
    replyThreadId?: number;
    senderId?: string | number | null;
    topicAgentId?: string | null;
}): {
    route: ReturnType<typeof resolveAgentRoute>;
    configuredBinding: ConfiguredBindingRouteResult["bindingResolution"];
    configuredBindingSessionKey: string;
};
export declare function resolveTelegramConversationBaseSessionKey(params: {
    cfg: WormAgentConfig;
    route: Pick<ReturnType<typeof resolveTelegramConversationRoute>["route"], "agentId" | "accountId" | "matchedBy" | "sessionKey">;
    chatId: number | string;
    isGroup: boolean;
    senderId?: string | number | null;
}): string;
