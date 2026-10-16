import { resolveOpenProviderRuntimeGroupPolicy, resolveDefaultGroupPolicy } from "wormagent/plugin-sdk/config-runtime";
import type { MonitorIMessageOpts } from "./types.js";
export declare function monitorIMessageProvider(opts?: MonitorIMessageOpts): Promise<void>;
export declare const __testing: {
    resolveIMessageRuntimeGroupPolicy: typeof resolveOpenProviderRuntimeGroupPolicy;
    resolveDefaultGroupPolicy: typeof resolveDefaultGroupPolicy;
};
