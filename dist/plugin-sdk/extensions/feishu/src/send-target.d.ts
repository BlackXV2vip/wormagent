import type { HoofbotConfig } from "../runtime-api.js";
export declare function resolveFeishuSendTarget(params: {
    cfg: HoofbotConfig;
    to: string;
    accountId?: string;
}): {
    client: import("@larksuiteoapi/node-sdk").Client;
    receiveId: string;
    receiveIdType: "chat_id" | "open_id" | "user_id";
};
