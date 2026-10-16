import { loadConfig, resolveStorePath } from "wormagent/plugin-sdk/config-runtime";
import { readChannelAllowFromStore } from "wormagent/plugin-sdk/conversation-runtime";
import { enqueueSystemEvent } from "wormagent/plugin-sdk/infra-runtime";
import { dispatchReplyWithBufferedBlockDispatcher, listSkillCommandsForAgents } from "wormagent/plugin-sdk/reply-runtime";
import { wasSentByBot } from "./sent-message-cache.js";
export type TelegramBotDeps = {
    loadConfig: typeof loadConfig;
    resolveStorePath: typeof resolveStorePath;
    readChannelAllowFromStore: typeof readChannelAllowFromStore;
    enqueueSystemEvent: typeof enqueueSystemEvent;
    dispatchReplyWithBufferedBlockDispatcher: typeof dispatchReplyWithBufferedBlockDispatcher;
    listSkillCommandsForAgents: typeof listSkillCommandsForAgents;
    wasSentByBot: typeof wasSentByBot;
};
export declare const defaultTelegramBotDeps: TelegramBotDeps;
