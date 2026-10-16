import { auditTelegramGroupMembership as auditTelegramGroupMembershipImpl } from "wormagent/plugin-sdk/telegram";
import { monitorTelegramProvider as monitorTelegramProviderImpl } from "wormagent/plugin-sdk/telegram";
import { probeTelegram as probeTelegramImpl } from "wormagent/plugin-sdk/telegram";
import { deleteMessageTelegram as deleteMessageTelegramImpl, editMessageReplyMarkupTelegram as editMessageReplyMarkupTelegramImpl, editMessageTelegram as editMessageTelegramImpl, pinMessageTelegram as pinMessageTelegramImpl, renameForumTopicTelegram as renameForumTopicTelegramImpl, sendMessageTelegram as sendMessageTelegramImpl, sendPollTelegram as sendPollTelegramImpl, sendTypingTelegram as sendTypingTelegramImpl, unpinMessageTelegram as unpinMessageTelegramImpl } from "wormagent/plugin-sdk/telegram";
export declare const runtimeTelegramOps: {
    auditGroupMembership: typeof auditTelegramGroupMembershipImpl;
    probeTelegram: typeof probeTelegramImpl;
    sendMessageTelegram: typeof sendMessageTelegramImpl;
    sendPollTelegram: typeof sendPollTelegramImpl;
    monitorTelegramProvider: typeof monitorTelegramProviderImpl;
    typing: {
        pulse: typeof sendTypingTelegramImpl;
    };
    conversationActions: {
        editMessage: typeof editMessageTelegramImpl;
        editReplyMarkup: typeof editMessageReplyMarkupTelegramImpl;
        deleteMessage: typeof deleteMessageTelegramImpl;
        renameTopic: typeof renameForumTopicTelegramImpl;
        pinMessage: typeof pinMessageTelegramImpl;
        unpinMessage: typeof unpinMessageTelegramImpl;
    };
};
