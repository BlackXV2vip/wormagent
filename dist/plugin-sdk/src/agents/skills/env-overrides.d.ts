import type { WormAgentConfig } from "../../config/config.js";
import type { SkillEntry, SkillSnapshot } from "./types.js";
/** Returns a snapshot of env var keys currently injected by skill overrides. */
export declare function getActiveSkillEnvKeys(): ReadonlySet<string>;
export declare function applySkillEnvOverrides(params: {
    skills: SkillEntry[];
    config?: WormAgentConfig;
}): () => void;
export declare function applySkillEnvOverridesFromSnapshot(params: {
    snapshot?: SkillSnapshot;
    config?: WormAgentConfig;
}): () => void;
