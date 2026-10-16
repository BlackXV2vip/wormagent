import { cs as listIMessageAccountIds, ls as resolveDefaultIMessageAccountId, us as resolveIMessageAccount } from "./auth-profiles-DHKWTcix.js";
import { i as IMessageConfigSchema } from "./zod-schema.providers-core-Doq9WIkR.js";
import { r as getChatChannelMeta } from "./registry-bBUk5Kld.js";
import { p as createAllowlistProviderRestrictSendersWarningCollector } from "./group-policy-warnings-CrQ_hLRZ.js";
import { i as createScopedChannelConfigAdapter, l as formatTrimmedAllowFromEntries, o as createScopedDmSecurityResolver } from "./channel-config-helpers-Cw--QYL9.js";
import { r as buildChannelConfigSchema } from "./config-schema-DwLf-YhC.js";
import { n as createChannelPluginBase } from "./core-flS61KKf.js";
import { n as createIMessageSetupWizardProxy } from "./setup-core-Bkwvx3fh.js";
//#region extensions/imessage/src/shared.ts
const IMESSAGE_CHANNEL = "imessage";
async function loadIMessageChannelRuntime() {
	return await import("./channel.runtime-C2XZ4ZCX.js");
}
const imessageSetupWizard = createIMessageSetupWizardProxy(async () => (await loadIMessageChannelRuntime()).imessageSetupWizard);
const imessageConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: IMESSAGE_CHANNEL,
	listAccountIds: listIMessageAccountIds,
	resolveAccount: (cfg, accountId) => resolveIMessageAccount({
		cfg,
		accountId
	}),
	defaultAccountId: resolveDefaultIMessageAccountId,
	clearBaseFields: [
		"cliPath",
		"dbPath",
		"service",
		"region",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatTrimmedAllowFromEntries(allowFrom),
	resolveDefaultTo: (account) => account.config.defaultTo
});
const imessageResolveDmPolicy = createScopedDmSecurityResolver({
	channelKey: IMESSAGE_CHANNEL,
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy"
});
const collectIMessageSecurityWarnings = createAllowlistProviderRestrictSendersWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.imessage !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	surface: "iMessage groups",
	openScope: "any member",
	groupPolicyPath: "channels.imessage.groupPolicy",
	groupAllowFromPath: "channels.imessage.groupAllowFrom",
	mentionGated: false
});
function createIMessagePluginBase(params) {
	return createChannelPluginBase({
		id: IMESSAGE_CHANNEL,
		meta: {
			...getChatChannelMeta(IMESSAGE_CHANNEL),
			aliases: ["imsg"],
			showConfigured: false
		},
		setupWizard: params.setupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			media: true
		},
		reload: { configPrefixes: ["channels.imessage"] },
		configSchema: buildChannelConfigSchema(IMessageConfigSchema),
		config: {
			...imessageConfigAdapter,
			isConfigured: (account) => account.configured,
			describeAccount: (account) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured
			})
		},
		security: {
			resolveDmPolicy: imessageResolveDmPolicy,
			collectWarnings: collectIMessageSecurityWarnings
		},
		setup: params.setup
	});
}
//#endregion
export { imessageSetupWizard as i, createIMessagePluginBase as n, imessageResolveDmPolicy as r, collectIMessageSecurityWarnings as t };
