import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
export declare function isSlackInteractiveRepliesEnabled(params: {
    cfg: WormAgentConfig;
    accountId?: string | null;
}): boolean;
