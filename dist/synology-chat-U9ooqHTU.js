import { r as defineChannelPluginEntry } from "./core-flS61KKf.js";
import { n as setSynologyRuntime, t as synologyChatPlugin } from "./channel-BIuhQ7ES.js";
//#region extensions/synology-chat/index.ts
var synology_chat_default = defineChannelPluginEntry({
	id: "synology-chat",
	name: "Synology Chat",
	description: "Native Synology Chat channel plugin for WormAgent",
	plugin: synologyChatPlugin,
	setRuntime: setSynologyRuntime
});
//#endregion
export { synology_chat_default as t };
