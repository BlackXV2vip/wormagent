import { resolveThreadBindingsEnabled } from "wormagent/plugin-sdk/channel-runtime";
import type { WormAgentConfig, ReplyToMode } from "wormagent/plugin-sdk/config-runtime";
import { resolveOpenProviderRuntimeGroupPolicy, resolveDefaultGroupPolicy } from "wormagent/plugin-sdk/config-runtime";
import { type RuntimeEnv } from "wormagent/plugin-sdk/runtime-env";
import { createDiscordGatewayPlugin } from "./gateway-plugin.js";
import { resolveDiscordRestFetch } from "./rest-fetch.js";
import type { DiscordMonitorStatusSink } from "./status.js";
export type MonitorDiscordOpts = {
    token?: string;
    accountId?: string;
    config?: WormAgentConfig;
    runtime?: RuntimeEnv;
    abortSignal?: AbortSignal;
    mediaMaxMb?: number;
    historyLimit?: number;
    replyToMode?: ReplyToMode;
    setStatus?: DiscordMonitorStatusSink;
};
export declare function monitorDiscordProvider(opts?: MonitorDiscordOpts): Promise<void>;
export declare const __testing: {
    createDiscordGatewayPlugin: typeof createDiscordGatewayPlugin;
    resolveDiscordRuntimeGroupPolicy: typeof resolveOpenProviderRuntimeGroupPolicy;
    resolveDefaultGroupPolicy: typeof resolveDefaultGroupPolicy;
    resolveDiscordRestFetch: typeof resolveDiscordRestFetch;
    resolveThreadBindingsEnabled: typeof resolveThreadBindingsEnabled;
};
