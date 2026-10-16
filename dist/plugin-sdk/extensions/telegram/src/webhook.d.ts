import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
import type { RuntimeEnv } from "wormagent/plugin-sdk/runtime-env";
export declare function startTelegramWebhook(opts: {
    token: string;
    accountId?: string;
    config?: WormAgentConfig;
    path?: string;
    port?: number;
    host?: string;
    secret?: string;
    runtime?: RuntimeEnv;
    fetch?: typeof fetch;
    abortSignal?: AbortSignal;
    healthPath?: string;
    publicUrl?: string;
    webhookCertPath?: string;
}): Promise<{
    server: import("node:http").Server<typeof import("node:http").IncomingMessage, typeof import("node:http").ServerResponse>;
    bot: import("grammy").Bot<import("grammy").Context, import("grammy").Api<import("grammy").RawApi>>;
    stop: () => void;
}>;
