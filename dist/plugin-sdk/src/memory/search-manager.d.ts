import type { WormAgentConfig } from "../config/config.js";
import type { MemorySearchManager } from "./types.js";
export type MemorySearchManagerResult = {
    manager: MemorySearchManager | null;
    error?: string;
};
export declare function getMemorySearchManager(params: {
    cfg: WormAgentConfig;
    agentId: string;
    purpose?: "default" | "status";
}): Promise<MemorySearchManagerResult>;
export declare function closeAllMemorySearchManagers(): Promise<void>;
