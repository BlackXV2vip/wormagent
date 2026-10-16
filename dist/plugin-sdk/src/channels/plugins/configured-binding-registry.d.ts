import type { WormAgentConfig } from "../../config/config.js";
import type { ConversationRef } from "../../infra/outbound/session-binding-service.js";
import type { ConfiguredBindingRecordResolution, ConfiguredBindingResolution } from "./binding-types.js";
export declare function primeConfiguredBindingRegistry(params: {
    cfg: WormAgentConfig;
}): {
    bindingCount: number;
    channelCount: number;
};
export declare function resolveConfiguredBindingRecord(params: {
    cfg: WormAgentConfig;
    channel: string;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
}): ConfiguredBindingRecordResolution | null;
export declare function resolveConfiguredBindingRecordForConversation(params: {
    cfg: WormAgentConfig;
    conversation: ConversationRef;
}): ConfiguredBindingRecordResolution | null;
export declare function resolveConfiguredBinding(params: {
    cfg: WormAgentConfig;
    conversation: ConversationRef;
}): ConfiguredBindingResolution | null;
export declare function resolveConfiguredBindingRecordBySessionKey(params: {
    cfg: WormAgentConfig;
    sessionKey: string;
}): ConfiguredBindingRecordResolution | null;
