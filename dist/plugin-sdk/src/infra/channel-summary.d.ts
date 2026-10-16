import { type WormAgentConfig } from "../config/config.js";
export type ChannelSummaryOptions = {
    colorize?: boolean;
    includeAllowFrom?: boolean;
    sourceConfig?: WormAgentConfig;
};
export declare function buildChannelSummary(cfg?: WormAgentConfig, options?: ChannelSummaryOptions): Promise<string[]>;
