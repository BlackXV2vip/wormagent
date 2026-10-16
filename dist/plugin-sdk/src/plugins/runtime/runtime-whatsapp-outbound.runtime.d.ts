import { sendMessageWhatsApp as sendMessageWhatsAppImpl, sendPollWhatsApp as sendPollWhatsAppImpl } from "wormagent/plugin-sdk/whatsapp";
export declare const runtimeWhatsAppOutbound: {
    sendMessageWhatsApp: typeof sendMessageWhatsAppImpl;
    sendPollWhatsApp: typeof sendPollWhatsAppImpl;
};
