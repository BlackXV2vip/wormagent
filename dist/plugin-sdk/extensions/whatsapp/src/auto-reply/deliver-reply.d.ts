import type { MarkdownTableMode } from "wormagent/plugin-sdk/config-runtime";
import { type ChunkMode } from "wormagent/plugin-sdk/reply-runtime";
import type { ReplyPayload } from "wormagent/plugin-sdk/reply-runtime";
import type { WebInboundMsg } from "./types.js";
export declare function deliverWebReply(params: {
    replyResult: ReplyPayload;
    msg: WebInboundMsg;
    mediaLocalRoots?: readonly string[];
    maxMediaBytes: number;
    textLimit: number;
    chunkMode?: ChunkMode;
    replyLogger: {
        info: (obj: unknown, msg: string) => void;
        warn: (obj: unknown, msg: string) => void;
    };
    connectionId?: string;
    skipLog?: boolean;
    tableMode?: MarkdownTableMode;
}): Promise<void>;
