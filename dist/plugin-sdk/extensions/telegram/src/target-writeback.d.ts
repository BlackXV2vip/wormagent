import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
export declare function maybePersistResolvedTelegramTarget(params: {
    cfg: WormAgentConfig;
    rawTarget: string;
    resolvedChatId: string;
    verbose?: boolean;
}): Promise<void>;
