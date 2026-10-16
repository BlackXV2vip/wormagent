import type { BaseProbeResult } from "wormagent/plugin-sdk/channel-runtime";
export type SlackProbe = BaseProbeResult & {
    status?: number | null;
    elapsedMs?: number | null;
    bot?: {
        id?: string;
        name?: string;
    };
    team?: {
        id?: string;
        name?: string;
    };
};
export declare function probeSlack(token: string, timeoutMs?: number): Promise<SlackProbe>;
