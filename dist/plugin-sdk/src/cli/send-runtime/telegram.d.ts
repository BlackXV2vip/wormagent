import { sendMessageTelegram as sendMessageTelegramImpl } from "wormagent/plugin-sdk/telegram";
export declare const runtimeSend: {
    sendMessage: typeof sendMessageTelegramImpl;
};
