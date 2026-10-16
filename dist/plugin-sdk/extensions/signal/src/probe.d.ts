import type { BaseProbeResult } from "wormagent/plugin-sdk/channel-runtime";
export type SignalProbe = BaseProbeResult & {
    status?: number | null;
    elapsedMs: number;
    version?: string | null;
};
export declare function probeSignal(baseUrl: string, timeoutMs: number): Promise<SignalProbe>;
