import type { ModelDefinitionConfig } from "wormagent/plugin-sdk/provider-models";
export declare const MODELSTUDIO_CN_BASE_URL = "https://coding.dashscope.aliyuncs.com/v1";
export declare const MODELSTUDIO_GLOBAL_BASE_URL = "https://coding-intl.dashscope.aliyuncs.com/v1";
export declare const MODELSTUDIO_DEFAULT_MODEL_ID = "qwen3.5-plus";
export declare const MODELSTUDIO_DEFAULT_MODEL_REF = "modelstudio/qwen3.5-plus";
export declare const MODELSTUDIO_DEFAULT_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare function buildModelStudioModelDefinition(params: {
    id: string;
    name?: string;
    reasoning?: boolean;
    input?: string[];
    cost?: ModelDefinitionConfig["cost"];
    contextWindow?: number;
    maxTokens?: number;
}): ModelDefinitionConfig;
export declare function buildModelStudioDefaultModelDefinition(): ModelDefinitionConfig;
