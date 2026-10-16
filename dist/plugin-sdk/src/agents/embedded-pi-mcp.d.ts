import type { WormAgentConfig } from "../config/config.js";
import type { BundleMcpDiagnostic, BundleMcpServerConfig } from "../plugins/bundle-mcp.js";
export type EmbeddedPiMcpConfig = {
    mcpServers: Record<string, BundleMcpServerConfig>;
    diagnostics: BundleMcpDiagnostic[];
};
export declare function loadEmbeddedPiMcpConfig(params: {
    workspaceDir: string;
    cfg?: WormAgentConfig;
}): EmbeddedPiMcpConfig;
