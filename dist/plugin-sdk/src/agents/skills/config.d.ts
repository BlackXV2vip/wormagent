import type { WormAgentConfig, SkillConfig } from "../../config/config.js";
import { hasBinary, resolveConfigPath, resolveRuntimePlatform } from "../../shared/config-eval.js";
import type { SkillEligibilityContext, SkillEntry } from "./types.js";
export { hasBinary, resolveConfigPath, resolveRuntimePlatform };
export declare function isConfigPathTruthy(config: WormAgentConfig | undefined, pathStr: string): boolean;
export declare function resolveSkillConfig(config: WormAgentConfig | undefined, skillKey: string): SkillConfig | undefined;
export declare function resolveBundledAllowlist(config?: WormAgentConfig): string[] | undefined;
export declare function isBundledSkillAllowed(entry: SkillEntry, allowlist?: string[]): boolean;
export declare function shouldIncludeSkill(params: {
    entry: SkillEntry;
    config?: WormAgentConfig;
    eligibility?: SkillEligibilityContext;
}): boolean;
