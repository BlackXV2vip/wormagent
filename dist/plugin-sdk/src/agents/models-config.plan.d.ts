import type { WormAgentConfig } from "../config/config.js";
export type ModelsJsonPlan = {
    action: "skip";
} | {
    action: "noop";
} | {
    action: "write";
    contents: string;
};
export declare function planWormAgentModelsJson(params: {
    cfg: WormAgentConfig;
    sourceConfigForSecrets?: WormAgentConfig;
    agentDir: string;
    env: NodeJS.ProcessEnv;
    existingRaw: string;
    existingParsed: unknown;
}): Promise<ModelsJsonPlan>;
