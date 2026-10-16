import type { WormAgentConfig } from "../../config/config.js";
import { type RoutePeer } from "../../routing/resolve-route.js";
export declare function buildOutboundBaseSessionKey(params: {
    cfg: WormAgentConfig;
    agentId: string;
    channel: string;
    accountId?: string | null;
    peer: RoutePeer;
}): string;
