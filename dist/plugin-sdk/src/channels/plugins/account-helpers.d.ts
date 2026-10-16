import type { WormAgentConfig } from "../../config/config.js";
export declare function createAccountListHelpers(channelKey: string, options?: {
    normalizeAccountId?: (id: string) => string;
}): {
    listConfiguredAccountIds: (cfg: WormAgentConfig) => string[];
    listAccountIds: (cfg: WormAgentConfig) => string[];
    resolveDefaultAccountId: (cfg: WormAgentConfig) => string;
};
