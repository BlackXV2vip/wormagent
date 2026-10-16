import type { ChannelStatusIssue } from "../channels/plugins/types.js";
type RuntimeLifecycleSnapshot = {
    running?: boolean | null;
    lastStartAt?: number | null;
    lastStopAt?: number | null;
    lastError?: string | null;
    lastInboundAt?: number | null;
    lastOutboundAt?: number | null;
};
/** Create the baseline runtime snapshot shape used by channel/account status stores. */
export declare function createDefaultChannelRuntimeState<T extends Record<string, unknown>>(accountId: string, extra?: T): {
    accountId: string;
    running: false;
    lastStartAt: null;
    lastStopAt: null;
    lastError: null;
} & T;
/** Normalize a channel-level status summary so missing lifecycle fields become explicit nulls. */
export declare function buildBaseChannelStatusSummary(snapshot: {
    configured?: boolean | null;
    running?: boolean | null;
    lastStartAt?: number | null;
    lastStopAt?: number | null;
    lastError?: string | null;
}): {
    configured: boolean;
    running: boolean;
    lastStartAt: number | null;
    lastStopAt: number | null;
    lastError: string | null;
};
/** Extend the base summary with probe fields while preserving stable null defaults. */
export declare function buildProbeChannelStatusSummary<TExtra extends Record<string, unknown>>(snapshot: {
    configured?: boolean | null;
    running?: boolean | null;
    lastStartAt?: number | null;
    lastStopAt?: number | null;
    lastError?: string | null;
    probe?: unknown;
    lastProbeAt?: number | null;
}, extra?: TExtra): {
    configured: boolean;
    running: boolean;
    lastStartAt: number | null;
    lastStopAt: number | null;
    lastError: string | null;
} & TExtra & {
    probe: unknown;
    lastProbeAt: number | null;
};
/** Build the standard per-account status payload from config metadata plus runtime state. */
export declare function buildBaseAccountStatusSnapshot(params: {
    account: {
        accountId: string;
        name?: string;
        enabled?: boolean;
        configured?: boolean;
    };
    runtime?: RuntimeLifecycleSnapshot | null;
    probe?: unknown;
}): {
    lastInboundAt: number | null;
    lastOutboundAt: number | null;
    running: boolean;
    lastStartAt: number | null;
    lastStopAt: number | null;
    lastError: string | null;
    probe: unknown;
    accountId: string;
    name: string | undefined;
    enabled: boolean | undefined;
    configured: boolean | undefined;
};
/** Convenience wrapper when the caller already has flattened account fields instead of an account object. */
export declare function buildComputedAccountStatusSnapshot(params: {
    accountId: string;
    name?: string;
    enabled?: boolean;
    configured?: boolean;
    runtime?: RuntimeLifecycleSnapshot | null;
    probe?: unknown;
}): {
    lastInboundAt: number | null;
    lastOutboundAt: number | null;
    running: boolean;
    lastStartAt: number | null;
    lastStopAt: number | null;
    lastError: string | null;
    probe: unknown;
    accountId: string;
    name: string | undefined;
    enabled: boolean | undefined;
    configured: boolean | undefined;
};
/** Normalize runtime-only account state into the shared status snapshot fields. */
export declare function buildRuntimeAccountStatusSnapshot(params: {
    runtime?: RuntimeLifecycleSnapshot | null;
    probe?: unknown;
}): {
    running: boolean;
    lastStartAt: number | null;
    lastStopAt: number | null;
    lastError: string | null;
    probe: unknown;
};
/** Build token-based channel status summaries with optional mode reporting. */
export declare function buildTokenChannelStatusSummary(snapshot: {
    configured?: boolean | null;
    tokenSource?: string | null;
    running?: boolean | null;
    mode?: string | null;
    lastStartAt?: number | null;
    lastStopAt?: number | null;
    lastError?: string | null;
    probe?: unknown;
    lastProbeAt?: number | null;
}, opts?: {
    includeMode?: boolean;
}): {
    tokenSource: string;
    probe: unknown;
    lastProbeAt: number | null;
    configured: boolean;
    running: boolean;
    lastStartAt: number | null;
    lastStopAt: number | null;
    lastError: string | null;
} | {
    mode: string | null;
    tokenSource: string;
    probe: unknown;
    lastProbeAt: number | null;
    configured: boolean;
    running: boolean;
    lastStartAt: number | null;
    lastStopAt: number | null;
    lastError: string | null;
};
/** Convert account runtime errors into the generic channel status issue format. */
export declare function collectStatusIssuesFromLastError(channel: string, accounts: Array<{
    accountId: string;
    lastError?: unknown;
}>): ChannelStatusIssue[];
export {};
