import { type WormAgentConfig } from "../../config/config.js";
import type { MsgContext } from "../templating.js";
import type { GetReplyOptions, ReplyPayload } from "../types.js";
export declare function getReplyFromConfig(ctx: MsgContext, opts?: GetReplyOptions, configOverride?: WormAgentConfig): Promise<ReplyPayload | ReplyPayload[] | undefined>;
