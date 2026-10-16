import type { WormAgentConfig } from "../../config/config.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { ReplyPayload } from "../types.js";
import type { CommandHandler } from "./commands-types.js";
export type ModelsProviderData = {
    byProvider: Map<string, Set<string>>;
    providers: string[];
    resolvedDefault: {
        provider: string;
        model: string;
    };
};
/**
 * Build provider/model data from config and catalog.
 * Exported for reuse by callback handlers.
 */
export declare function buildModelsProviderData(cfg: WormAgentConfig, agentId?: string): Promise<ModelsProviderData>;
export declare function formatModelsAvailableHeader(params: {
    provider: string;
    total: number;
    cfg: WormAgentConfig;
    agentDir?: string;
    sessionEntry?: SessionEntry;
}): string;
export declare function resolveModelsCommandReply(params: {
    cfg: WormAgentConfig;
    commandBodyNormalized: string;
    surface?: string;
    currentModel?: string;
    agentId?: string;
    agentDir?: string;
    sessionEntry?: SessionEntry;
}): Promise<ReplyPayload | null>;
export declare const handleModelsCommand: CommandHandler;
