import type { WormAgentConfig } from "../../config/config.js";
export declare function resolveEffectiveResetTargetSessionKey(params: {
    cfg: WormAgentConfig;
    channel?: string | null;
    accountId?: string | null;
    conversationId?: string | null;
    parentConversationId?: string | null;
    activeSessionKey?: string | null;
    allowNonAcpBindingSessionKey?: boolean;
    skipConfiguredFallbackWhenActiveSessionNonAcp?: boolean;
    fallbackToActiveAcpWhenUnbound?: boolean;
}): string | undefined;
