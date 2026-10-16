import { m as normalizeE164 } from "./utils-1TVTmhOV.js";
import { Md as listSignalAccountIds, Nd as resolveDefaultSignalAccountId, Pd as resolveSignalAccount } from "./auth-profiles-DHKWTcix.js";
import { s as SignalConfigSchema } from "./zod-schema.providers-core-Doq9WIkR.js";
import { r as getChatChannelMeta } from "./registry-bBUk5Kld.js";
import { p as createAllowlistProviderRestrictSendersWarningCollector } from "./group-policy-warnings-CrQ_hLRZ.js";
import { i as createScopedChannelConfigAdapter, o as createScopedDmSecurityResolver } from "./channel-config-helpers-Cw--QYL9.js";
import { r as buildChannelConfigSchema } from "./config-schema-DwLf-YhC.js";
import { n as createChannelPluginBase } from "./core-flS61KKf.js";
import { n as createSignalSetupWizardProxy } from "./setup-core-mSzrORPV.js";
//#region extensions/signal/src/shared.ts
const SIGNAL_CHANNEL = "signal";
async function loadSignalChannelRuntime() {
	return await import("./channel.runtime-jsaFNH92.js");
}
const signalSetupWizard = createSignalSetupWizardProxy(async () => (await loadSignalChannelRuntime()).signalSetupWizard);
const signalConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: SIGNAL_CHANNEL,
	listAccountIds: listSignalAccountIds,
	resolveAccount: (cfg, accountId) => resolveSignalAccount({
		cfg,
		accountId
	}),
	defaultAccountId: resolveDefaultSignalAccountId,
	clearBaseFields: [
		"account",
		"httpUrl",
		"httpHost",
		"httpPort",
		"cliPath",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => allowFrom.map((entry) => String(entry).trim()).filter(Boolean).map((entry) => entry === "*" ? "*" : normalizeE164(entry.replace(/^signal:/i, ""))).filter(Boolean),
	resolveDefaultTo: (account) => account.config.defaultTo
});
const signalResolveDmPolicy = createScopedDmSecurityResolver({
	channelKey: SIGNAL_CHANNEL,
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => normalizeE164(raw.replace(/^signal:/i, "").trim())
});
const collectSignalSecurityWarnings = createAllowlistProviderRestrictSendersWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.signal !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	surface: "Signal groups",
	openScope: "any member",
	groupPolicyPath: "channels.signal.groupPolicy",
	groupAllowFromPath: "channels.signal.groupAllowFrom",
	mentionGated: false
});
function createSignalPluginBase(params) {
	return createChannelPluginBase({
		id: SIGNAL_CHANNEL,
		meta: { ...getChatChannelMeta(SIGNAL_CHANNEL) },
		setupWizard: params.setupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			media: true,
			reactions: true
		},
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		reload: { configPrefixes: ["channels.signal"] },
		configSchema: buildChannelConfigSchema(SignalConfigSchema),
		config: {
			...signalConfigAdapter,
			isConfigured: (account) => account.configured,
			describeAccount: (account) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured,
				baseUrl: account.baseUrl
			})
		},
		security: {
			resolveDmPolicy: signalResolveDmPolicy,
			collectWarnings: collectSignalSecurityWarnings
		},
		setup: params.setup
	});
}
//#endregion
export { signalSetupWizard as a, signalResolveDmPolicy as i, createSignalPluginBase as n, signalConfigAdapter as r, collectSignalSecurityWarnings as t };
