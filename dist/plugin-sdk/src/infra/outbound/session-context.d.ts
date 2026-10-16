import type { WormAgentConfig } from "../../config/config.js";
export type OutboundSessionContext = {
    /** Canonical session key used for internal hook dispatch. */
    key?: string;
    /** Active agent id used for workspace-scoped media roots. */
    agentId?: string;
};
export declare function buildOutboundSessionContext(params: {
    cfg: WormAgentConfig;
    sessionKey?: string | null;
    agentId?: string | null;
}): OutboundSessionContext | undefined;
