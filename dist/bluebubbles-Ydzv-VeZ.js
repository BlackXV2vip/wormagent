import { r as defineChannelPluginEntry } from "./core-flS61KKf.js";
import { t as bluebubblesPlugin } from "./channel-BSavbwYY.js";
import { n as setBlueBubblesRuntime } from "./runtime-osIzAyRB.js";
//#region extensions/bluebubbles/index.ts
var bluebubbles_default = defineChannelPluginEntry({
	id: "bluebubbles",
	name: "BlueBubbles",
	description: "BlueBubbles channel plugin (macOS app)",
	plugin: bluebubblesPlugin,
	setRuntime: setBlueBubblesRuntime
});
//#endregion
export { bluebubbles_default as t };
