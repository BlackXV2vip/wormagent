import type { WormAgentConfig } from "../config/config.js";
import type { ExecApprovalRequest } from "./exec-approvals.js";
export type ExecApprovalSessionTarget = {
    channel?: string;
    to: string;
    accountId?: string;
    threadId?: number;
};
export declare function resolveExecApprovalSessionTarget(params: {
    cfg: WormAgentConfig;
    request: ExecApprovalRequest;
    turnSourceChannel?: string | null;
    turnSourceTo?: string | null;
    turnSourceAccountId?: string | null;
    turnSourceThreadId?: string | number | null;
}): ExecApprovalSessionTarget | null;
