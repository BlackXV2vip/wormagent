export type { InspectedSlackAccount } from "wormagent/plugin-sdk/slack";
type InspectSlackAccount = typeof import("wormagent/plugin-sdk/slack").inspectSlackAccount;
export declare function inspectSlackAccount(...args: Parameters<InspectSlackAccount>): ReturnType<InspectSlackAccount>;
