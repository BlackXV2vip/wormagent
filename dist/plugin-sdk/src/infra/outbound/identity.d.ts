import type { WormAgentConfig } from "../../config/config.js";
export type OutboundIdentity = {
    name?: string;
    avatarUrl?: string;
    emoji?: string;
    theme?: string;
};
export declare function normalizeOutboundIdentity(identity?: OutboundIdentity | null): OutboundIdentity | undefined;
export declare function resolveAgentOutboundIdentity(cfg: WormAgentConfig, agentId: string): OutboundIdentity | undefined;
