import { r as defineChannelPluginEntry } from "./core-flS61KKf.js";
import { n as setNextcloudTalkRuntime, t as nextcloudTalkPlugin } from "./channel-Dby7I4mP.js";
//#region extensions/nextcloud-talk/index.ts
var nextcloud_talk_default = defineChannelPluginEntry({
	id: "nextcloud-talk",
	name: "Nextcloud Talk",
	description: "Nextcloud Talk channel plugin",
	plugin: nextcloudTalkPlugin,
	setRuntime: setNextcloudTalkRuntime
});
//#endregion
export { nextcloud_talk_default as t };
