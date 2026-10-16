import type { WormAgentConfig } from "../../config/types.js";
export type DirectoryConfigParams = {
    cfg: WormAgentConfig;
    accountId?: string | null;
    query?: string | null;
    limit?: number | null;
};
