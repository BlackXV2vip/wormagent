import type { OAuthCredentials } from "@mariozechner/pi-ai";
import type { WormAgentConfig } from "../config/config.js";
import { type SecretInput, type SecretRef } from "../config/types.secrets.js";
import type { SecretInputMode } from "./provider-auth-types.js";
export type ApiKeyStorageOptions = {
    secretInputMode?: SecretInputMode;
};
export type WriteOAuthCredentialsOptions = {
    syncSiblingAgents?: boolean;
};
export declare function buildApiKeyCredential(provider: string, input: SecretInput, metadata?: Record<string, string>, options?: ApiKeyStorageOptions): {
    type: "api_key";
    provider: string;
    key?: string;
    keyRef?: SecretRef;
    metadata?: Record<string, string>;
};
export declare function applyAuthProfileConfig(cfg: WormAgentConfig, params: {
    profileId: string;
    provider: string;
    mode: "api_key" | "oauth" | "token";
    email?: string;
    preferProfileFirst?: boolean;
}): WormAgentConfig;
export declare function writeOAuthCredentials(provider: string, creds: OAuthCredentials, agentDir?: string, options?: WriteOAuthCredentialsOptions): Promise<string>;
