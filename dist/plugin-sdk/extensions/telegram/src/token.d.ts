import type { BaseTokenResolution } from "wormagent/plugin-sdk/channel-runtime";
import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
export type TelegramTokenSource = "env" | "tokenFile" | "config" | "none";
export type TelegramTokenResolution = BaseTokenResolution & {
    source: TelegramTokenSource;
};
type ResolveTelegramTokenOpts = {
    envToken?: string | null;
    accountId?: string | null;
    logMissingFile?: (message: string) => void;
};
export declare function resolveTelegramToken(cfg?: WormAgentConfig, opts?: ResolveTelegramTokenOpts): TelegramTokenResolution;
export {};
