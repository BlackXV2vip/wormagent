import { type GroupToolPolicyConfig } from "wormagent/plugin-sdk/channel-policy";
import { type ChannelGroupContext } from "wormagent/plugin-sdk/channel-runtime";
export declare function resolveTelegramGroupRequireMention(params: ChannelGroupContext): boolean | undefined;
export declare function resolveTelegramGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
