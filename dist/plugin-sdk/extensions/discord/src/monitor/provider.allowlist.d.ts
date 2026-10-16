import type { DiscordGuildEntry } from "wormagent/plugin-sdk/config-runtime";
import type { RuntimeEnv } from "wormagent/plugin-sdk/runtime-env";
type GuildEntries = Record<string, DiscordGuildEntry>;
export declare function resolveDiscordAllowlistConfig(params: {
    token: string;
    guildEntries: unknown;
    allowFrom: unknown;
    fetcher: typeof fetch;
    runtime: RuntimeEnv;
}): Promise<{
    guildEntries: GuildEntries | undefined;
    allowFrom: string[] | undefined;
}>;
export {};
