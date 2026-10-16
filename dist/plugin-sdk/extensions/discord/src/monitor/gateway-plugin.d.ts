import { GatewayPlugin } from "@buape/carbon/gateway";
import type { DiscordAccountConfig } from "wormagent/plugin-sdk/config-runtime";
import type { RuntimeEnv } from "wormagent/plugin-sdk/runtime-env";
export declare function resolveDiscordGatewayIntents(intentsConfig?: import("wormagent/plugin-sdk/config-runtime").DiscordIntentsConfig): number;
export declare function createDiscordGatewayPlugin(params: {
    discordConfig: DiscordAccountConfig;
    runtime: RuntimeEnv;
}): GatewayPlugin;
