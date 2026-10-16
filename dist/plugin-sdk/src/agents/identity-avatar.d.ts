import type { WormAgentConfig } from "../config/config.js";
export type AgentAvatarResolution = {
    kind: "none";
    reason: string;
} | {
    kind: "local";
    filePath: string;
} | {
    kind: "remote";
    url: string;
} | {
    kind: "data";
    url: string;
};
export declare function resolveAgentAvatar(cfg: WormAgentConfig, agentId: string): AgentAvatarResolution;
