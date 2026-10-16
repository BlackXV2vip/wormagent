import type { WormAgentConfig } from "../config/config.js";
export declare const GOOGLE_GEMINI_DEFAULT_MODEL = "google/gemini-3.1-pro-preview";
export declare const OPENAI_DEFAULT_MODEL = "openai/gpt-5.1-codex";
export declare const OPENCODE_GO_DEFAULT_MODEL_REF = "opencode-go/kimi-k2.5";
export declare const OPENCODE_ZEN_DEFAULT_MODEL = "opencode/claude-opus-4-6";
export declare function applyGoogleGeminiModelDefault(cfg: WormAgentConfig): {
    next: WormAgentConfig;
    changed: boolean;
};
export declare function applyOpenAIProviderConfig(cfg: WormAgentConfig): WormAgentConfig;
export declare function applyOpenAIConfig(cfg: WormAgentConfig): WormAgentConfig;
export declare function applyOpencodeGoModelDefault(cfg: WormAgentConfig): {
    next: WormAgentConfig;
    changed: boolean;
};
export declare function applyOpencodeZenModelDefault(cfg: WormAgentConfig): {
    next: WormAgentConfig;
    changed: boolean;
};
