import { type WormAgentConfig } from "wormagent/plugin-sdk/provider-onboard";
export declare const MOONSHOT_CN_BASE_URL = "https://api.moonshot.cn/v1";
export declare const MOONSHOT_DEFAULT_MODEL_REF = "moonshot/kimi-k2.5";
export declare function applyMoonshotProviderConfig(cfg: WormAgentConfig): WormAgentConfig;
export declare function applyMoonshotProviderConfigCn(cfg: WormAgentConfig): WormAgentConfig;
export declare function applyMoonshotConfig(cfg: WormAgentConfig): WormAgentConfig;
export declare function applyMoonshotConfigCn(cfg: WormAgentConfig): WormAgentConfig;
