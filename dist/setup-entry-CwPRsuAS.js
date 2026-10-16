import { L_ as resolveWhatsAppGroupRequireMention, M_ as resolveWhatsAppGroupIntroHint, Mg as webAuthExists, R_ as resolveWhatsAppGroupToolPolicy } from "./auth-profiles-DHKWTcix.js";
import { a as defineSetupPluginEntry } from "./core-flS61KKf.js";
import { t as whatsappSetupAdapter } from "./setup-core-CWYv1S7U.js";
import { i as whatsappSetupWizardProxy, n as createWhatsAppPluginBase } from "./shared-BB4b3PZD.js";
//#region extensions/whatsapp/src/channel.setup.ts
const whatsappSetupPlugin = { ...createWhatsAppPluginBase({
	groups: {
		resolveRequireMention: resolveWhatsAppGroupRequireMention,
		resolveToolPolicy: resolveWhatsAppGroupToolPolicy,
		resolveGroupIntroHint: resolveWhatsAppGroupIntroHint
	},
	setupWizard: whatsappSetupWizardProxy,
	setup: whatsappSetupAdapter,
	isConfigured: async (account) => await webAuthExists(account.authDir)
}) };
//#endregion
//#region extensions/whatsapp/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(whatsappSetupPlugin);
//#endregion
export { whatsappSetupPlugin as n, setup_entry_default as t };
