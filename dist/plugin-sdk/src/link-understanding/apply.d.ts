import type { MsgContext } from "../auto-reply/templating.js";
import type { WormAgentConfig } from "../config/config.js";
export type ApplyLinkUnderstandingResult = {
    outputs: string[];
    urls: string[];
};
export declare function applyLinkUnderstanding(params: {
    ctx: MsgContext;
    cfg: WormAgentConfig;
}): Promise<ApplyLinkUnderstandingResult>;
