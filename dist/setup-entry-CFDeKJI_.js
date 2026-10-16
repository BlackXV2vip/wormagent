import { a as defineSetupPluginEntry } from "./core-flS61KKf.js";
import { a as imessageSetupAdapter } from "./setup-core-Bkwvx3fh.js";
import { i as imessageSetupWizard, n as createIMessagePluginBase } from "./shared-BF_-1LJ8.js";
//#region extensions/imessage/src/channel.setup.ts
const imessageSetupPlugin = { ...createIMessagePluginBase({
	setupWizard: imessageSetupWizard,
	setup: imessageSetupAdapter
}) };
//#endregion
//#region extensions/imessage/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(imessageSetupPlugin);
//#endregion
export { imessageSetupPlugin as n, setup_entry_default as t };
