import type { PluginRuntime } from "wormagent/plugin-sdk/core";
import { createPluginRuntimeStore } from "wormagent/plugin-sdk/runtime-store";

const { setRuntime: setIMessageRuntime, getRuntime: getIMessageRuntime } =
  createPluginRuntimeStore<PluginRuntime>("iMessage runtime not initialized");
export { getIMessageRuntime, setIMessageRuntime };
