import type { WormAgentConfig } from "../../config/config.js";
type HeartbeatRecipientsResult = {
    recipients: string[];
    source: string;
};
type HeartbeatRecipientsOpts = {
    to?: string;
    all?: boolean;
};
export declare function resolveWhatsAppHeartbeatRecipients(cfg: WormAgentConfig, opts?: HeartbeatRecipientsOpts): HeartbeatRecipientsResult;
export {};
