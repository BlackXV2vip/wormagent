import type { WormAgentConfig } from "../../config/config.js";
import { type SessionAcpMeta, type SessionEntry } from "../../config/sessions/types.js";
export type AcpSessionStoreEntry = {
    cfg: WormAgentConfig;
    storePath: string;
    sessionKey: string;
    storeSessionKey: string;
    entry?: SessionEntry;
    acp?: SessionAcpMeta;
    storeReadFailed?: boolean;
};
export declare function resolveSessionStorePathForAcp(params: {
    sessionKey: string;
    cfg?: WormAgentConfig;
}): {
    cfg: WormAgentConfig;
    storePath: string;
};
export declare function readAcpSessionEntry(params: {
    sessionKey: string;
    cfg?: WormAgentConfig;
}): AcpSessionStoreEntry | null;
export declare function listAcpSessionEntries(params: {
    cfg?: WormAgentConfig;
    env?: NodeJS.ProcessEnv;
}): Promise<AcpSessionStoreEntry[]>;
export declare function upsertAcpSessionMeta(params: {
    sessionKey: string;
    cfg?: WormAgentConfig;
    mutate: (current: SessionAcpMeta | undefined, entry: SessionEntry | undefined) => SessionAcpMeta | null | undefined;
}): Promise<SessionEntry | null>;
