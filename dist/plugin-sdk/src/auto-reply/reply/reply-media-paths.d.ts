import type { WormAgentConfig } from "../../config/config.js";
import type { ReplyPayload } from "../types.js";
export declare function createReplyMediaPathNormalizer(params: {
    cfg: WormAgentConfig;
    sessionKey?: string;
    workspaceDir: string;
}): (payload: ReplyPayload) => Promise<ReplyPayload>;
