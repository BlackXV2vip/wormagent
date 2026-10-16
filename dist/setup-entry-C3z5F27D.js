import { a as defineSetupPluginEntry } from "./core-flS61KKf.js";
import { a as signalSetupWizard, n as createSignalPluginBase } from "./shared-rA49RVZl.js";
import { o as signalSetupAdapter } from "./setup-core-mSzrORPV.js";
//#region extensions/signal/src/channel.setup.ts
const signalSetupPlugin = { ...createSignalPluginBase({
	setupWizard: signalSetupWizard,
	setup: signalSetupAdapter
}) };
//#endregion
//#region extensions/signal/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(signalSetupPlugin);
//#endregion
export { signalSetupPlugin as n, setup_entry_default as t };
