export { DEFAULT_WEB_MEDIA_BYTES, HEARTBEAT_PROMPT, HEARTBEAT_TOKEN, monitorWebChannel, resolveHeartbeatRecipients, runWebHeartbeatOnce, } from "wormagent/plugin-sdk/whatsapp";
export { extractMediaPlaceholder, extractText, monitorWebInbox, } from "wormagent/plugin-sdk/whatsapp";
export { loginWeb } from "wormagent/plugin-sdk/whatsapp";
export { loadWebMedia, optimizeImageToJpeg } from "./media/web-media.js";
export { sendMessageWhatsApp } from "wormagent/plugin-sdk/whatsapp";
export { createWaSocket, formatError, getStatusCode, logoutWeb, logWebSelfId, pickWebChannel, WA_WEB_AUTH_DIR, waitForWaConnection, webAuthExists, } from "wormagent/plugin-sdk/whatsapp";
