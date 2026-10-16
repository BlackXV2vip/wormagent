import { type AcpSessionStoreEntry } from "wormagent/plugin-sdk/acp-runtime";
import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import type { ThreadBindingRecord, ThreadBindingTargetKind } from "./thread-bindings.types.js";
export type AcpThreadBindingReconciliationResult = {
    checked: number;
    removed: number;
    staleSessionKeys: string[];
};
export type AcpThreadBindingHealthStatus = "healthy" | "stale" | "uncertain";
export type AcpThreadBindingHealthProbe = (params: {
    cfg: WormAgentConfig;
    accountId: string;
    sessionKey: string;
    binding: ThreadBindingRecord;
    session: AcpSessionStoreEntry;
}) => Promise<{
    status: AcpThreadBindingHealthStatus;
    reason?: string;
}>;
export declare function listThreadBindingsForAccount(accountId?: string): ThreadBindingRecord[];
export declare function listThreadBindingsBySessionKey(params: {
    targetSessionKey: string;
    accountId?: string;
    targetKind?: ThreadBindingTargetKind;
}): ThreadBindingRecord[];
export declare function autoBindSpawnedDiscordSubagent(params: {
    cfg?: WormAgentConfig;
    accountId?: string;
    channel?: string;
    to?: string;
    threadId?: string | number;
    childSessionKey: string;
    agentId: string;
    label?: string;
    boundBy?: string;
}): Promise<ThreadBindingRecord | null>;
export declare function unbindThreadBindingsBySessionKey(params: {
    targetSessionKey: string;
    accountId?: string;
    targetKind?: ThreadBindingTargetKind;
    reason?: string;
    sendFarewell?: boolean;
    farewellText?: string;
}): ThreadBindingRecord[];
export declare function setThreadBindingIdleTimeoutBySessionKey(params: {
    targetSessionKey: string;
    accountId?: string;
    idleTimeoutMs: number;
}): ThreadBindingRecord[];
export declare function setThreadBindingMaxAgeBySessionKey(params: {
    targetSessionKey: string;
    accountId?: string;
    maxAgeMs: number;
}): ThreadBindingRecord[];
export declare function reconcileAcpThreadBindingsOnStartup(params: {
    cfg: WormAgentConfig;
    accountId?: string;
    sendFarewell?: boolean;
    healthProbe?: AcpThreadBindingHealthProbe;
}): Promise<AcpThreadBindingReconciliationResult>;
