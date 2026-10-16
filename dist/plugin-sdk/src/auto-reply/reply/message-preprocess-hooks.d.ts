import type { WormAgentConfig } from "../../config/config.js";
import type { FinalizedMsgContext } from "../templating.js";
export declare function emitPreAgentMessageHooks(params: {
    ctx: FinalizedMsgContext;
    cfg: WormAgentConfig;
    isFastTestEnv: boolean;
}): void;
