import type { ReplyToMode } from "wormagent/plugin-sdk/config-runtime";
import type { TelegramAccountConfig } from "wormagent/plugin-sdk/config-runtime";
import type { RuntimeEnv } from "wormagent/plugin-sdk/runtime-env";
import type { TelegramBotDeps } from "./bot-deps.js";
import { type BuildTelegramMessageContextParams, type TelegramMediaRef } from "./bot-message-context.js";
import type { TelegramBotOptions } from "./bot.js";
import type { TelegramContext, TelegramStreamMode } from "./bot/types.js";
/** Dependencies injected once when creating the message processor. */
type TelegramMessageProcessorDeps = Omit<BuildTelegramMessageContextParams, "primaryCtx" | "allMedia" | "storeAllowFrom" | "options"> & {
    telegramCfg: TelegramAccountConfig;
    runtime: RuntimeEnv;
    replyToMode: ReplyToMode;
    streamMode: TelegramStreamMode;
    textLimit: number;
    telegramDeps: TelegramBotDeps;
    opts: Pick<TelegramBotOptions, "token">;
};
export declare const createTelegramMessageProcessor: (deps: TelegramMessageProcessorDeps) => (primaryCtx: TelegramContext, allMedia: TelegramMediaRef[], storeAllowFrom: string[], options?: {
    messageIdOverride?: string;
    forceWasMentioned?: boolean;
}, replyMedia?: TelegramMediaRef[]) => Promise<void>;
export {};
