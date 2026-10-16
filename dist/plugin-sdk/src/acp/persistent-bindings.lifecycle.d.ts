import type { WormAgentConfig } from "../config/config.js";
import { type ConfiguredAcpBindingSpec, type ResolvedConfiguredAcpBinding } from "./persistent-bindings.types.js";
export declare function ensureConfiguredAcpBindingSession(params: {
    cfg: WormAgentConfig;
    spec: ConfiguredAcpBindingSpec;
}): Promise<{
    ok: true;
    sessionKey: string;
} | {
    ok: false;
    sessionKey: string;
    error: string;
}>;
export declare function ensureConfiguredAcpBindingReady(params: {
    cfg: WormAgentConfig;
    configuredBinding: ResolvedConfiguredAcpBinding | null;
}): Promise<{
    ok: true;
} | {
    ok: false;
    error: string;
}>;
export declare function resetAcpSessionInPlace(params: {
    cfg: WormAgentConfig;
    sessionKey: string;
    reason: "new" | "reset";
}): Promise<{
    ok: true;
} | {
    ok: false;
    skipped?: boolean;
    error?: string;
}>;
