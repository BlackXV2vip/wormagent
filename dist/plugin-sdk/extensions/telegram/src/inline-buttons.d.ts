import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import type { TelegramInlineButtonsScope } from "wormagent/plugin-sdk/config-runtime";
export declare function resolveTelegramInlineButtonsScope(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): TelegramInlineButtonsScope;
export declare function isTelegramInlineButtonsEnabled(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): boolean;
export { resolveTelegramTargetChatType } from "./targets.js";
