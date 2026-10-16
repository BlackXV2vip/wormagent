import type { WormAgentConfig } from "../../config/config.js";
import type { AuthProfileIdRepairResult, AuthProfileStore } from "./types.js";
export declare function suggestOAuthProfileIdForLegacyDefault(params: {
    cfg?: WormAgentConfig;
    store: AuthProfileStore;
    provider: string;
    legacyProfileId: string;
}): string | null;
export declare function repairOAuthProfileIdMismatch(params: {
    cfg: WormAgentConfig;
    store: AuthProfileStore;
    provider: string;
    legacyProfileId?: string;
}): AuthProfileIdRepairResult;
