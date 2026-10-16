import type { ReplyPayload } from "wormagent/plugin-sdk/reply-runtime";
import type { RuntimeEnv } from "wormagent/plugin-sdk/runtime-env";
import type { createIMessageRpcClient } from "../client.js";
import type { SentMessageCache } from "./echo-cache.js";
export declare function deliverReplies(params: {
    replies: ReplyPayload[];
    target: string;
    client: Awaited<ReturnType<typeof createIMessageRpcClient>>;
    accountId?: string;
    runtime: RuntimeEnv;
    maxBytes: number;
    textLimit: number;
    sentMessageCache?: Pick<SentMessageCache, "remember">;
}): Promise<void>;
