import type { Bot } from "grammy";
import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import type { ChannelGroupPolicy } from "wormagent/plugin-sdk/config-runtime";
import type { ReplyToMode, TelegramAccountConfig, TelegramGroupConfig, TelegramTopicConfig } from "wormagent/plugin-sdk/config-runtime";
import { getChildLogger } from "wormagent/plugin-sdk/runtime-env";
import type { RuntimeEnv } from "wormagent/plugin-sdk/runtime-env";
import { type TelegramBotDeps } from "./bot-deps.js";
import type { TelegramMediaRef } from "./bot-message-context.js";
import { TelegramUpdateKeyContext } from "./bot-updates.js";
import { TelegramBotOptions } from "./bot.js";
import type { TelegramContext } from "./bot/types.js";
import type { TelegramTransport } from "./fetch.js";
export type RegisterTelegramHandlerParams = {
    cfg: WormAgentConfig;
    accountId: string;
    bot: Bot;
    mediaMaxBytes: number;
    opts: TelegramBotOptions;
    telegramTransport?: TelegramTransport;
    runtime: RuntimeEnv;
    telegramCfg: TelegramAccountConfig;
    telegramDeps?: TelegramBotDeps;
    allowFrom?: Array<string | number>;
    groupAllowFrom?: Array<string | number>;
    resolveGroupPolicy: (chatId: string | number) => ChannelGroupPolicy;
    resolveTelegramGroupConfig: (chatId: string | number, messageThreadId?: number) => {
        groupConfig?: TelegramGroupConfig;
        topicConfig?: TelegramTopicConfig;
    };
    shouldSkipUpdate: (ctx: TelegramUpdateKeyContext) => boolean;
    processMessage: (ctx: TelegramContext, allMedia: TelegramMediaRef[], storeAllowFrom: string[], options?: {
        messageIdOverride?: string;
        forceWasMentioned?: boolean;
    }, replyMedia?: TelegramMediaRef[]) => Promise<void>;
    logger: ReturnType<typeof getChildLogger>;
};
export type RegisterTelegramNativeCommandsParams = {
    bot: Bot;
    cfg: WormAgentConfig;
    runtime: RuntimeEnv;
    accountId: string;
    telegramCfg: TelegramAccountConfig;
    allowFrom?: Array<string | number>;
    groupAllowFrom?: Array<string | number>;
    replyToMode: ReplyToMode;
    textLimit: number;
    useAccessGroups: boolean;
    nativeEnabled: boolean;
    nativeSkillsEnabled: boolean;
    nativeDisabledExplicit: boolean;
    resolveGroupPolicy: (chatId: string | number) => ChannelGroupPolicy;
    resolveTelegramGroupConfig: (chatId: string | number, messageThreadId?: number) => {
        groupConfig?: TelegramGroupConfig;
        topicConfig?: TelegramTopicConfig;
    };
    shouldSkipUpdate: (ctx: TelegramUpdateKeyContext) => boolean;
    telegramDeps?: TelegramBotDeps;
    opts: {
        token: string;
    };
};
export declare const registerTelegramNativeCommands: ({ bot, cfg, runtime, accountId, telegramCfg, allowFrom, groupAllowFrom, replyToMode, textLimit, useAccessGroups, nativeEnabled, nativeSkillsEnabled, nativeDisabledExplicit, resolveGroupPolicy, resolveTelegramGroupConfig, shouldSkipUpdate, telegramDeps, opts, }: RegisterTelegramNativeCommandsParams) => void;
