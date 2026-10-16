import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import { type WormAgentConfig } from "../runtime-api.js";
export declare function handleDiscordAction(params: Record<string, unknown>, cfg: WormAgentConfig, options?: {
    mediaLocalRoots?: readonly string[];
}): Promise<AgentToolResult<unknown>>;
