import type { MsgContext } from "../auto-reply/templating.js";
import type { WormAgentConfig } from "../config/config.js";
export declare function recordInboundSessionMetaSafe(params: {
    cfg: WormAgentConfig;
    agentId: string;
    sessionKey: string;
    ctx: MsgContext;
    onError?: (error: unknown) => void;
}): Promise<void>;
