import type { ChannelSetupAdapter, WormAgentConfig } from "wormagent/plugin-sdk/setup";
import { listLineAccountIds } from "../runtime-api.js";
export declare function patchLineAccountConfig(params: {
    cfg: WormAgentConfig;
    accountId: string;
    patch: Record<string, unknown>;
    clearFields?: string[];
    enabled?: boolean;
}): WormAgentConfig;
export declare function isLineConfigured(cfg: WormAgentConfig, accountId: string): boolean;
export declare function parseLineAllowFromId(raw: string): string | null;
export declare const lineSetupAdapter: ChannelSetupAdapter;
export { listLineAccountIds };
