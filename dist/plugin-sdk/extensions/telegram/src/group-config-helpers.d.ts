import type { TelegramDirectConfig, TelegramGroupConfig, TelegramTopicConfig } from "wormagent/plugin-sdk/config-runtime";
export declare function resolveTelegramGroupPromptSettings(params: {
    groupConfig?: TelegramGroupConfig | TelegramDirectConfig;
    topicConfig?: TelegramTopicConfig;
}): {
    skillFilter: string[] | undefined;
    groupSystemPrompt: string | undefined;
};
