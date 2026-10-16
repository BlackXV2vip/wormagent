import { sendMessageSlack as sendMessageSlackImpl } from "wormagent/plugin-sdk/slack";
export declare const runtimeSend: {
    sendMessage: typeof sendMessageSlackImpl;
};
