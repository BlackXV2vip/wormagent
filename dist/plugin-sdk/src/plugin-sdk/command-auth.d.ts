import type { WormAgentConfig } from "../config/config.js";
export type ResolveSenderCommandAuthorizationParams = {
    cfg: WormAgentConfig;
    rawBody: string;
    isGroup: boolean;
    dmPolicy: string;
    configuredAllowFrom: string[];
    configuredGroupAllowFrom?: string[];
    senderId: string;
    isSenderAllowed: (senderId: string, allowFrom: string[]) => boolean;
    readAllowFromStore: () => Promise<string[]>;
    shouldComputeCommandAuthorized: (rawBody: string, cfg: WormAgentConfig) => boolean;
    resolveCommandAuthorizedFromAuthorizers: (params: {
        useAccessGroups: boolean;
        authorizers: Array<{
            configured: boolean;
            allowed: boolean;
        }>;
    }) => boolean;
};
export type CommandAuthorizationRuntime = {
    shouldComputeCommandAuthorized: (rawBody: string, cfg: WormAgentConfig) => boolean;
    resolveCommandAuthorizedFromAuthorizers: (params: {
        useAccessGroups: boolean;
        authorizers: Array<{
            configured: boolean;
            allowed: boolean;
        }>;
    }) => boolean;
};
export type ResolveSenderCommandAuthorizationWithRuntimeParams = Omit<ResolveSenderCommandAuthorizationParams, "shouldComputeCommandAuthorized" | "resolveCommandAuthorizedFromAuthorizers"> & {
    runtime: CommandAuthorizationRuntime;
};
/** Fast-path DM command authorization when only policy and sender allowlist state matter. */
export declare function resolveDirectDmAuthorizationOutcome(params: {
    isGroup: boolean;
    dmPolicy: string;
    senderAllowedForCommands: boolean;
}): "disabled" | "unauthorized" | "allowed";
/** Runtime-backed wrapper around sender command authorization for grouped helper surfaces. */
export declare function resolveSenderCommandAuthorizationWithRuntime(params: ResolveSenderCommandAuthorizationWithRuntimeParams): ReturnType<typeof resolveSenderCommandAuthorization>;
/** Compute effective allowlists and command authorization for one inbound sender. */
export declare function resolveSenderCommandAuthorization(params: ResolveSenderCommandAuthorizationParams): Promise<{
    shouldComputeAuth: boolean;
    effectiveAllowFrom: string[];
    effectiveGroupAllowFrom: string[];
    senderAllowedForCommands: boolean;
    commandAuthorized: boolean | undefined;
}>;
