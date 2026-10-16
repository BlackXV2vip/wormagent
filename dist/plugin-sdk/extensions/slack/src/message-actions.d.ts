import type { ChannelMessageActionName, ChannelToolSend } from "wormagent/plugin-sdk/channel-runtime";
import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
export declare function listSlackMessageActions(cfg: WormAgentConfig): ChannelMessageActionName[];
export declare function extractSlackToolSend(args: Record<string, unknown>): ChannelToolSend | null;
