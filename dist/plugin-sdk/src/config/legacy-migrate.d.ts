import type { WormAgentConfig } from "./types.js";
export declare function migrateLegacyConfig(raw: unknown): {
    config: WormAgentConfig | null;
    changes: string[];
};
