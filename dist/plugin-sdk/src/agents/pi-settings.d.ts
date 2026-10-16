import type { WormAgentConfig } from "../config/config.js";
import type { ContextEngineInfo } from "../context-engine/types.js";
export declare const DEFAULT_PI_COMPACTION_RESERVE_TOKENS_FLOOR = 20000;
type PiSettingsManagerLike = {
    getCompactionReserveTokens: () => number;
    getCompactionKeepRecentTokens: () => number;
    applyOverrides: (overrides: {
        compaction: {
            reserveTokens?: number;
            keepRecentTokens?: number;
        };
    }) => void;
    setCompactionEnabled?: (enabled: boolean) => void;
};
export declare function ensurePiCompactionReserveTokens(params: {
    settingsManager: PiSettingsManagerLike;
    minReserveTokens?: number;
}): {
    didOverride: boolean;
    reserveTokens: number;
};
export declare function resolveCompactionReserveTokensFloor(cfg?: WormAgentConfig): number;
export declare function applyPiCompactionSettingsFromConfig(params: {
    settingsManager: PiSettingsManagerLike;
    cfg?: WormAgentConfig;
}): {
    didOverride: boolean;
    compaction: {
        reserveTokens: number;
        keepRecentTokens: number;
    };
};
/** Decide whether Pi's internal auto-compaction should be disabled for this run. */
export declare function shouldDisablePiAutoCompaction(params: {
    contextEngineInfo?: ContextEngineInfo;
}): boolean;
/** Disable Pi auto-compaction via settings when a context engine owns compaction. */
export declare function applyPiAutoCompactionGuard(params: {
    settingsManager: PiSettingsManagerLike;
    contextEngineInfo?: ContextEngineInfo;
}): {
    supported: boolean;
    disabled: boolean;
};
export {};
