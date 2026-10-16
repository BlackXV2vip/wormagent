import type { WormAgentConfig } from "./config.js";
export type DangerousNameMatchingConfig = {
    dangerouslyAllowNameMatching?: boolean;
};
export type ProviderDangerousNameMatchingScope = {
    prefix: string;
    account: Record<string, unknown>;
    dangerousNameMatchingEnabled: boolean;
    dangerousFlagPath: string;
};
export declare function isDangerousNameMatchingEnabled(config: DangerousNameMatchingConfig | null | undefined): boolean;
export declare function collectProviderDangerousNameMatchingScopes(cfg: WormAgentConfig, provider: string): ProviderDangerousNameMatchingScope[];
