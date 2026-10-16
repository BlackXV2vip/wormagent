import type { UpdatePresenceData } from "@buape/carbon/gateway";
import type { DiscordAccountConfig } from "wormagent/plugin-sdk/config-runtime";
type DiscordPresenceConfig = Pick<DiscordAccountConfig, "activity" | "status" | "activityType" | "activityUrl">;
export declare function resolveDiscordPresenceUpdate(config: DiscordPresenceConfig): UpdatePresenceData | null;
export {};
