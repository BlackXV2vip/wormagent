import type { WormAgentConfig } from "./types.js";
export declare function collectConfigRuntimeEnvVars(cfg?: WormAgentConfig): Record<string, string>;
export declare function collectConfigServiceEnvVars(cfg?: WormAgentConfig): Record<string, string>;
/** @deprecated Use `collectConfigRuntimeEnvVars` or `collectConfigServiceEnvVars`. */
export declare function collectConfigEnvVars(cfg?: WormAgentConfig): Record<string, string>;
export declare function createConfigRuntimeEnv(cfg: WormAgentConfig, baseEnv?: NodeJS.ProcessEnv): NodeJS.ProcessEnv;
export declare function applyConfigEnvVars(cfg: WormAgentConfig, env?: NodeJS.ProcessEnv): void;
