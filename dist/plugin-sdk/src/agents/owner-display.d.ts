import type { WormAgentConfig } from "../config/config.js";
export type OwnerDisplaySetting = {
    ownerDisplay?: "raw" | "hash";
    ownerDisplaySecret?: string;
};
export type OwnerDisplaySecretResolution = {
    config: WormAgentConfig;
    generatedSecret?: string;
};
/**
 * Resolve owner display settings for prompt rendering.
 * Keep auth secrets decoupled from owner hash secrets.
 */
export declare function resolveOwnerDisplaySetting(config?: WormAgentConfig): OwnerDisplaySetting;
/**
 * Ensure hash mode has a dedicated secret.
 * Returns updated config and generated secret when autofill was needed.
 */
export declare function ensureOwnerDisplaySecret(config: WormAgentConfig, generateSecret?: () => string): OwnerDisplaySecretResolution;
