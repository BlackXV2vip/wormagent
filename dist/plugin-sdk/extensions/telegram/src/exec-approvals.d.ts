import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import type { TelegramExecApprovalConfig } from "wormagent/plugin-sdk/config-runtime";
import type { ReplyPayload } from "wormagent/plugin-sdk/reply-runtime";
export declare function resolveTelegramExecApprovalConfig(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): TelegramExecApprovalConfig | undefined;
export declare function getTelegramExecApprovalApprovers(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): string[];
export declare function isTelegramExecApprovalClientEnabled(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): boolean;
export declare function isTelegramExecApprovalApprover(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
    senderId?: string | null;
}): boolean;
export declare function resolveTelegramExecApprovalTarget(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): "dm" | "channel" | "both";
export declare function shouldInjectTelegramExecApprovalButtons(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
    to: string;
}): boolean;
export declare function shouldEnableTelegramExecApprovalButtons(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
    to: string;
}): boolean;
export declare function shouldSuppressLocalTelegramExecApprovalPrompt(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
    payload: ReplyPayload;
}): boolean;
