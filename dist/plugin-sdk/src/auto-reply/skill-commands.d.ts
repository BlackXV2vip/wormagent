import { type SkillCommandSpec } from "../agents/skills.js";
import type { WormAgentConfig } from "../config/config.js";
export declare function listReservedChatSlashCommandNames(extraNames?: string[]): Set<string>;
export declare function listSkillCommandsForWorkspace(params: {
    workspaceDir: string;
    cfg: WormAgentConfig;
    skillFilter?: string[];
}): SkillCommandSpec[];
declare function dedupeBySkillName(commands: SkillCommandSpec[]): SkillCommandSpec[];
export declare function listSkillCommandsForAgents(params: {
    cfg: WormAgentConfig;
    agentIds?: string[];
}): SkillCommandSpec[];
export declare const __testing: {
    dedupeBySkillName: typeof dedupeBySkillName;
};
export declare function resolveSkillCommandInvocation(params: {
    commandBodyNormalized: string;
    skillCommands: SkillCommandSpec[];
}): {
    command: SkillCommandSpec;
    args?: string;
} | null;
export {};
