import { Container } from "@buape/carbon";
import type { WormAgentConfig } from "wormagent/plugin-sdk/config-runtime";
type DiscordContainerComponents = ConstructorParameters<typeof Container>[0];
type ResolveDiscordAccentColorParams = {
    cfg: WormAgentConfig;
    accountId?: string | null;
};
export declare function normalizeDiscordAccentColor(raw?: string | null): string | null;
export declare function resolveDiscordAccentColor(params: ResolveDiscordAccentColorParams): string;
export declare class DiscordUiContainer extends Container {
    constructor(params: {
        cfg: WormAgentConfig;
        accountId?: string | null;
        components?: DiscordContainerComponents;
        accentColor?: string;
        spoiler?: boolean;
    });
}
export {};
