import { type GroupToolPolicyConfig } from "wormagent/plugin-sdk/channel-policy";
import { type ChannelGroupContext } from "wormagent/plugin-sdk/channel-runtime";
export declare function resolveDiscordGroupRequireMention(params: ChannelGroupContext): boolean;
export declare function resolveDiscordGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
