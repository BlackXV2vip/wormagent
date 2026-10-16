import type { BaseTokenResolution } from "wormagent/plugin-sdk/channel-runtime";
import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
export type DiscordTokenSource = "env" | "config" | "none";
export type DiscordTokenResolution = BaseTokenResolution & {
    source: DiscordTokenSource;
};
export declare function normalizeDiscordToken(raw: unknown, path: string): string | undefined;
export declare function resolveDiscordToken(cfg?: WormAgentConfig, opts?: {
    accountId?: string | null;
    envToken?: string | null;
}): DiscordTokenResolution;
