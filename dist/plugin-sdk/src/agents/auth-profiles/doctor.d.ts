import type { WormAgentConfig } from "../../config/config.js";
import type { AuthProfileStore } from "./types.js";
export declare function formatAuthDoctorHint(params: {
    cfg?: WormAgentConfig;
    store: AuthProfileStore;
    provider: string;
    profileId?: string;
}): Promise<string>;
