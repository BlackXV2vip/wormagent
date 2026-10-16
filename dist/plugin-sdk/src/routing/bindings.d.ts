import type { WormAgentConfig } from "../config/config.js";
import type { AgentRouteBinding } from "../config/types.agents.js";
export declare function listBindings(cfg: WormAgentConfig): AgentRouteBinding[];
export declare function listBoundAccountIds(cfg: WormAgentConfig, channelId: string): string[];
export declare function resolveDefaultAgentBoundAccountId(cfg: WormAgentConfig, channelId: string): string | null;
export declare function buildChannelAccountBindings(cfg: WormAgentConfig): Map<string, Map<string, string[]>>;
export declare function resolvePreferredAccountId(params: {
    accountIds: string[];
    defaultAccountId: string;
    boundAccounts: string[];
}): string;
