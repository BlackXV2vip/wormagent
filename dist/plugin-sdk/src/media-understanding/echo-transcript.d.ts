import type { MsgContext } from "../auto-reply/templating.js";
import type { WormAgentConfig } from "../config/config.js";
export declare const DEFAULT_ECHO_TRANSCRIPT_FORMAT = "\uD83D\uDCDD \"{transcript}\"";
/**
 * Sends the transcript echo back to the originating chat.
 * Best-effort: logs on failure, never throws.
 */
export declare function sendTranscriptEcho(params: {
    ctx: MsgContext;
    cfg: WormAgentConfig;
    transcript: string;
    format?: string;
}): Promise<void>;
