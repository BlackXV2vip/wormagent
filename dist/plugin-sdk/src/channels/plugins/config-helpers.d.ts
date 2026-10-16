import type { WormAgentConfig } from "../../config/config.js";
export declare function setAccountEnabledInConfigSection(params: {
    cfg: WormAgentConfig;
    sectionKey: string;
    accountId: string;
    enabled: boolean;
    allowTopLevel?: boolean;
}): WormAgentConfig;
export declare function deleteAccountFromConfigSection(params: {
    cfg: WormAgentConfig;
    sectionKey: string;
    accountId: string;
    clearBaseFields?: string[];
}): WormAgentConfig;
export declare function clearAccountEntryFields<TAccountEntry extends object>(params: {
    accounts?: Record<string, TAccountEntry>;
    accountId: string;
    fields: string[];
    isValueSet?: (value: unknown) => boolean;
    markClearedOnFieldPresence?: boolean;
}): {
    nextAccounts?: Record<string, TAccountEntry>;
    changed: boolean;
    cleared: boolean;
};
