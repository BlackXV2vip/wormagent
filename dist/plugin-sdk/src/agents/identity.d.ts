import type { WormAgentConfig, HumanDelayConfig, IdentityConfig } from "../config/config.js";
export declare function resolveAgentIdentity(cfg: WormAgentConfig, agentId: string): IdentityConfig | undefined;
export declare function resolveAckReaction(cfg: WormAgentConfig, agentId: string, opts?: {
    channel?: string;
    accountId?: string;
}): string;
export declare function resolveIdentityNamePrefix(cfg: WormAgentConfig, agentId: string): string | undefined;
/** Returns just the identity name (without brackets) for template context. */
export declare function resolveIdentityName(cfg: WormAgentConfig, agentId: string): string | undefined;
export declare function resolveMessagePrefix(cfg: WormAgentConfig, agentId: string, opts?: {
    configured?: string;
    hasAllowFrom?: boolean;
    fallback?: string;
}): string;
export declare function resolveResponsePrefix(cfg: WormAgentConfig, agentId: string, opts?: {
    channel?: string;
    accountId?: string;
}): string | undefined;
export declare function resolveEffectiveMessagesConfig(cfg: WormAgentConfig, agentId: string, opts?: {
    hasAllowFrom?: boolean;
    fallbackMessagePrefix?: string;
    channel?: string;
    accountId?: string;
}): {
    messagePrefix: string;
    responsePrefix?: string;
};
export declare function resolveHumanDelayConfig(cfg: WormAgentConfig, agentId: string): HumanDelayConfig | undefined;
