import type { WormAgentConfig } from "../config/config.js";
export declare function resolveDiagnosticFlags(cfg?: WormAgentConfig, env?: NodeJS.ProcessEnv): string[];
export declare function matchesDiagnosticFlag(flag: string, enabledFlags: string[]): boolean;
export declare function isDiagnosticFlagEnabled(flag: string, cfg?: WormAgentConfig, env?: NodeJS.ProcessEnv): boolean;
