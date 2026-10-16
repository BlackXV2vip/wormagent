import type { WormAgentConfig } from "./types.js";
type WarnState = {
    warned: boolean;
};
export type SessionDefaultsOptions = {
    warn?: (message: string) => void;
    warnState?: WarnState;
};
export declare function applyMessageDefaults(cfg: WormAgentConfig): WormAgentConfig;
export declare function applySessionDefaults(cfg: WormAgentConfig, options?: SessionDefaultsOptions): WormAgentConfig;
export declare function applyTalkApiKey(config: WormAgentConfig): WormAgentConfig;
export declare function applyTalkConfigNormalization(config: WormAgentConfig): WormAgentConfig;
export declare function applyModelDefaults(cfg: WormAgentConfig): WormAgentConfig;
export declare function applyAgentDefaults(cfg: WormAgentConfig): WormAgentConfig;
export declare function applyLoggingDefaults(cfg: WormAgentConfig): WormAgentConfig;
export declare function applyContextPruningDefaults(cfg: WormAgentConfig): WormAgentConfig;
export declare function applyCompactionDefaults(cfg: WormAgentConfig): WormAgentConfig;
export declare function resetSessionDefaultsWarningForTests(): void;
export {};
