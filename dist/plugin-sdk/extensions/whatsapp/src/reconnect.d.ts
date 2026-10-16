import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import type { BackoffPolicy } from "wormagent/plugin-sdk/infra-runtime";
import { computeBackoff, sleepWithAbort } from "wormagent/plugin-sdk/infra-runtime";
export type ReconnectPolicy = BackoffPolicy & {
    maxAttempts: number;
};
export declare const DEFAULT_HEARTBEAT_SECONDS = 60;
export declare const DEFAULT_RECONNECT_POLICY: ReconnectPolicy;
export declare function resolveHeartbeatSeconds(cfg: WormAgentConfig, overrideSeconds?: number): number;
export declare function resolveReconnectPolicy(cfg: WormAgentConfig, overrides?: Partial<ReconnectPolicy>): ReconnectPolicy;
export { computeBackoff, sleepWithAbort };
export declare function newConnectionId(): `${string}-${string}-${string}-${string}-${string}`;
