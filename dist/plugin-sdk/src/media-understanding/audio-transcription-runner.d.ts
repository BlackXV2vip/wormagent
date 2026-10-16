import type { MsgContext } from "../auto-reply/templating.js";
import type { WormAgentConfig } from "../config/config.js";
import { type ActiveMediaModel } from "./runner.js";
import type { MediaAttachment, MediaUnderstandingProvider } from "./types.js";
export declare function runAudioTranscription(params: {
    ctx: MsgContext;
    cfg: WormAgentConfig;
    attachments?: MediaAttachment[];
    agentDir?: string;
    providers?: Record<string, MediaUnderstandingProvider>;
    activeModel?: ActiveMediaModel;
    localPathRoots?: readonly string[];
}): Promise<{
    transcript: string | undefined;
    attachments: MediaAttachment[];
}>;
