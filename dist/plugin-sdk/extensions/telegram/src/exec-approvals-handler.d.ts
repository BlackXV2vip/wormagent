import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import type { ExecApprovalRequest, ExecApprovalResolved } from "wormagent/plugin-sdk/infra-runtime";
import type { RuntimeEnv } from "wormagent/plugin-sdk/runtime-env";
import { editMessageReplyMarkupTelegram, sendMessageTelegram, sendTypingTelegram } from "./send.js";
export type TelegramExecApprovalHandlerOpts = {
    token: string;
    accountId: string;
    cfg: WormAgentConfig;
    gatewayUrl?: string;
    runtime?: RuntimeEnv;
};
export type TelegramExecApprovalHandlerDeps = {
    nowMs?: () => number;
    sendTyping?: typeof sendTypingTelegram;
    sendMessage?: typeof sendMessageTelegram;
    editReplyMarkup?: typeof editMessageReplyMarkupTelegram;
};
export declare class TelegramExecApprovalHandler {
    private readonly opts;
    private gatewayClient;
    private pending;
    private started;
    private readonly nowMs;
    private readonly sendTyping;
    private readonly sendMessage;
    private readonly editReplyMarkup;
    constructor(opts: TelegramExecApprovalHandlerOpts, deps?: TelegramExecApprovalHandlerDeps);
    shouldHandle(request: ExecApprovalRequest): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    handleRequested(request: ExecApprovalRequest): Promise<void>;
    handleResolved(resolved: ExecApprovalResolved): Promise<void>;
    private handleGatewayEvent;
}
