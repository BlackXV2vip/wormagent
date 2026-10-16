import { definePluginEntry } from "wormagent/plugin-sdk/core";
import type { AnyAgentTool, WormAgentPluginApi, WormAgentPluginToolFactory } from "./runtime-api.js";
import { createMustangTool } from "./src/mustang-tool.js";

export default definePluginEntry({
  id: "mustang",
  name: "Mustang",
  description: "Optional local shell helper tools",
  register(api: WormAgentPluginApi) {
    api.registerTool(
      ((ctx) => {
        if (ctx.sandboxed) {
          return null;
        }
        return createMustangTool(api) as AnyAgentTool;
      }) as WormAgentPluginToolFactory,
      { optional: true },
    );
  },
});
