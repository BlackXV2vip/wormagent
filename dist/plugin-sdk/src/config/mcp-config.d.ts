import type { WormAgentConfig } from "./types.wormagent.js";
export type ConfigMcpServers = Record<string, Record<string, unknown>>;
type ConfigMcpReadResult = {
    ok: true;
    path: string;
    config: WormAgentConfig;
    mcpServers: ConfigMcpServers;
} | {
    ok: false;
    path: string;
    error: string;
};
type ConfigMcpWriteResult = {
    ok: true;
    path: string;
    config: WormAgentConfig;
    mcpServers: ConfigMcpServers;
    removed?: boolean;
} | {
    ok: false;
    path: string;
    error: string;
};
export declare function normalizeConfiguredMcpServers(value: unknown): ConfigMcpServers;
export declare function listConfiguredMcpServers(): Promise<ConfigMcpReadResult>;
export declare function setConfiguredMcpServer(params: {
    name: string;
    server: unknown;
}): Promise<ConfigMcpWriteResult>;
export declare function unsetConfiguredMcpServer(params: {
    name: string;
}): Promise<ConfigMcpWriteResult>;
export {};
