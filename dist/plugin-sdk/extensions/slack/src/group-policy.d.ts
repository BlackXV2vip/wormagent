import { type GroupToolPolicyConfig } from "wormagent/plugin-sdk/channel-policy";
import { type ChannelGroupContext } from "wormagent/plugin-sdk/channel-runtime";
export declare function resolveSlackGroupRequireMention(params: ChannelGroupContext): boolean;
export declare function resolveSlackGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
