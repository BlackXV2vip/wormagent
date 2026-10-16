import type { WormAgentConfig } from "../../config/config.js";
import type { AuthProfileStore } from "./types.js";
export declare function resolveAuthProfileDisplayLabel(params: {
    cfg?: WormAgentConfig;
    store: AuthProfileStore;
    profileId: string;
}): string;
