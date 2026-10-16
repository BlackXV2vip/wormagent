export type { InspectedDiscordAccount } from "wormagent/plugin-sdk/discord";
type InspectDiscordAccount = typeof import("wormagent/plugin-sdk/discord").inspectDiscordAccount;
export declare function inspectDiscordAccount(...args: Parameters<InspectDiscordAccount>): ReturnType<InspectDiscordAccount>;
