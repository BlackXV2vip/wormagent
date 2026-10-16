import type { PluginRuntime } from "wormagent/plugin-sdk/core";
import { createPluginRuntimeStore } from "wormagent/plugin-sdk/runtime-store";

const { setRuntime: setTelegramRuntime, getRuntime: getTelegramRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Telegram runtime not initialized");
export { getTelegramRuntime, setTelegramRuntime };
