import { type ChannelMessageActionAdapter } from "wormagent/plugin-sdk/channel-runtime";
import { handleTelegramAction } from "./action-runtime.js";
export declare const telegramMessageActionRuntime: {
    handleTelegramAction: typeof handleTelegramAction;
};
export declare const telegramMessageActions: ChannelMessageActionAdapter;
