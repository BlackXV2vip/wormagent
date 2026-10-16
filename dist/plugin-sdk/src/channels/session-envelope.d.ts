import type { WormAgentConfig } from "../config/config.js";
export declare function resolveInboundSessionEnvelopeContext(params: {
    cfg: WormAgentConfig;
    agentId: string;
    sessionKey: string;
}): {
    storePath: string;
    envelopeOptions: import("../auto-reply/envelope.js").EnvelopeFormatOptions;
    previousTimestamp: number | undefined;
};
