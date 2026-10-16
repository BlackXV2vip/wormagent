import { type ChannelSetupAdapter, type WormAgentConfig } from "wormagent/plugin-sdk/setup";
export declare function setFeishuNamedAccountEnabled(cfg: WormAgentConfig, accountId: string, enabled: boolean): WormAgentConfig;
export declare const feishuSetupAdapter: ChannelSetupAdapter;
