import type { PluginRuntime } from "wormagent/plugin-sdk/core";
import { createPluginRuntimeStore } from "wormagent/plugin-sdk/runtime-store";

const { setRuntime: setDiscordRuntime, getRuntime: getDiscordRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Discord runtime not initialized");
export { getDiscordRuntime, setDiscordRuntime };
