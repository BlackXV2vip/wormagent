import type { PluginRuntime } from "wormagent/plugin-sdk/core";
import { createPluginRuntimeStore } from "wormagent/plugin-sdk/runtime-store";

const { setRuntime: setSlackRuntime, getRuntime: getSlackRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Slack runtime not initialized");
export { getSlackRuntime, setSlackRuntime };
