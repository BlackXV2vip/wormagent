import { listSkillCommandsForAgents as listSkillCommandsForAgentsImpl } from "wormagent/plugin-sdk/reply-runtime";

type ListSkillCommandsForAgents =
  typeof import("wormagent/plugin-sdk/reply-runtime").listSkillCommandsForAgents;

export function listSkillCommandsForAgents(
  ...args: Parameters<ListSkillCommandsForAgents>
): ReturnType<ListSkillCommandsForAgents> {
  return listSkillCommandsForAgentsImpl(...args);
}
