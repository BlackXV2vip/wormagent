import { r as defineChannelPluginEntry } from "./core-flS61KKf.js";
import { n as setIrcRuntime, t as ircPlugin } from "./channel-DUNl6Yu8.js";
//#region extensions/irc/index.ts
var irc_default = defineChannelPluginEntry({
	id: "irc",
	name: "IRC",
	description: "IRC channel plugin",
	plugin: ircPlugin,
	setRuntime: setIrcRuntime
});
//#endregion
export { irc_default as t };
