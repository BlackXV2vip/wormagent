import type { ChannelOutboundAdapter } from "wormagent/plugin-sdk/channel-runtime";
import type { ReplyPayload } from "wormagent/plugin-sdk/reply-runtime";
import { sendMessageTelegram } from "./send.js";
export declare const TELEGRAM_TEXT_CHUNK_LIMIT = 4000;
type TelegramSendFn = typeof sendMessageTelegram;
type TelegramSendOpts = Parameters<TelegramSendFn>[2];
export declare function sendTelegramPayloadMessages(params: {
    send: TelegramSendFn;
    to: string;
    payload: ReplyPayload;
    baseOpts: Omit<NonNullable<TelegramSendOpts>, "buttons" | "mediaUrl" | "quoteText">;
}): Promise<Awaited<ReturnType<TelegramSendFn>>>;
export declare const telegramOutbound: ChannelOutboundAdapter;
export {};
