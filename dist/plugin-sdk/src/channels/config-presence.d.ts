import type { WormAgentConfig } from "../config/config.js";
export declare function hasMeaningfulChannelConfig(value: unknown): boolean;
export declare function listPotentialConfiguredChannelIds(cfg: WormAgentConfig, env?: NodeJS.ProcessEnv): string[];
export declare function hasPotentialConfiguredChannels(cfg: WormAgentConfig, env?: NodeJS.ProcessEnv): boolean;
