import type { AcpRuntimeEvent, AcpSessionUpdateTag } from "../../acp/runtime/types.js";
import type { WormAgentConfig } from "../../config/config.js";
import type { ReplyPayload } from "../types.js";
import type { ReplyDispatchKind } from "./reply-dispatcher.js";
export type AcpProjectedDeliveryMeta = {
    tag?: AcpSessionUpdateTag;
    toolCallId?: string;
    toolStatus?: string;
    allowEdit?: boolean;
};
export type AcpReplyProjector = {
    onEvent: (event: AcpRuntimeEvent) => Promise<void>;
    flush: (force?: boolean) => Promise<void>;
};
export declare function createAcpReplyProjector(params: {
    cfg: WormAgentConfig;
    shouldSendToolSummaries: boolean;
    deliver: (kind: ReplyDispatchKind, payload: ReplyPayload, meta?: AcpProjectedDeliveryMeta) => Promise<boolean>;
    provider?: string;
    accountId?: string;
}): AcpReplyProjector;
