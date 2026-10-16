import type { WormAgentConfig } from "../config/config.js";
import type { ConversationRef } from "../infra/outbound/session-binding-service.js";
import { type ConfiguredAcpBindingSpec, type ResolvedConfiguredAcpBinding } from "./persistent-bindings.types.js";
export declare function resolveConfiguredAcpBindingRecord(params: {
    cfg: WormAgentConfig;
    channel: string;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
}): ResolvedConfiguredAcpBinding | null;
export declare function resolveConfiguredAcpBindingRecordForConversation(params: {
    cfg: WormAgentConfig;
    conversation: ConversationRef;
}): ResolvedConfiguredAcpBinding | null;
export declare function resolveConfiguredAcpBindingSpecBySessionKey(params: {
    cfg: WormAgentConfig;
    sessionKey: string;
}): ConfiguredAcpBindingSpec | null;
