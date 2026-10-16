import { r as defineChannelPluginEntry } from "./core-flS61KKf.js";
import { t as zaloPlugin } from "./channel-JXUKYAoh.js";
import { n as setZaloRuntime } from "./runtime-C_t7mgKF.js";
//#region extensions/zalo/index.ts
var zalo_default = defineChannelPluginEntry({
	id: "zalo",
	name: "Zalo",
	description: "Zalo channel plugin",
	plugin: zaloPlugin,
	setRuntime: setZaloRuntime
});
//#endregion
export { zalo_default as t };
