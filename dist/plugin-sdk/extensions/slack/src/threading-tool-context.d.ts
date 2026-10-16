import type { ChannelThreadingContext, ChannelThreadingToolContext } from "wormagent/plugin-sdk/channel-runtime";
import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
export declare function buildSlackThreadingToolContext(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
    context: ChannelThreadingContext;
    hasRepliedRef?: {
        value: boolean;
    };
}): ChannelThreadingToolContext;
