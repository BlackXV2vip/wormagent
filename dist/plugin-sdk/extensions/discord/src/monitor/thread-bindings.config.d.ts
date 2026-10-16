import { resolveThreadBindingIdleTimeoutMs, resolveThreadBindingMaxAgeMs, resolveThreadBindingsEnabled } from "wormagent/plugin-sdk/channel-runtime";
import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
export { resolveThreadBindingIdleTimeoutMs, resolveThreadBindingMaxAgeMs, resolveThreadBindingsEnabled, };
export declare function resolveDiscordThreadBindingIdleTimeoutMs(params: {
    cfg: WormAgentConfig;
    accountId?: string;
}): number;
export declare function resolveDiscordThreadBindingMaxAgeMs(params: {
    cfg: WormAgentConfig;
    accountId?: string;
}): number;
