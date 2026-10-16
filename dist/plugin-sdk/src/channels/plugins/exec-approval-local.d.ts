import type { ReplyPayload } from "../../auto-reply/types.js";
import type { WormAgentConfig } from "../../config/config.js";
export declare function shouldSuppressLocalExecApprovalPrompt(params: {
    channel?: string | null;
    cfg: WormAgentConfig;
    accountId?: string | null;
    payload: ReplyPayload;
}): boolean;
