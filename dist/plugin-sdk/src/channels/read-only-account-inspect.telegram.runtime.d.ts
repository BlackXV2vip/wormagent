export type { InspectedTelegramAccount } from "wormagent/plugin-sdk/telegram";
type InspectTelegramAccount = typeof import("wormagent/plugin-sdk/telegram").inspectTelegramAccount;
export declare function inspectTelegramAccount(...args: Parameters<InspectTelegramAccount>): ReturnType<InspectTelegramAccount>;
