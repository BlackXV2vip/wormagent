import { a as resolveOpenProviderRuntimeGroupPolicy, i as resolveDefaultGroupPolicy, r as resolveAllowlistProviderRuntimeGroupPolicy } from "./runtime-group-policy-za7LrU2q.js";
//#region src/channels/plugins/group-policy-warnings.ts
function composeWarningCollectors(...collectors) {
	return (params) => collectors.flatMap((collector) => collector?.(params) ?? []);
}
function projectWarningCollector(project, collector) {
	return (params) => collector(project(params));
}
function createConditionalWarningCollector(...collectors) {
	return (params) => collectors.flatMap((collector) => {
		const next = collector(params);
		if (!next) return [];
		return Array.isArray(next) ? next : [next];
	});
}
function buildOpenGroupPolicyWarning(params) {
	return `- ${params.surface}: groupPolicy="open" ${params.openBehavior}. ${params.remediation}.`;
}
function buildOpenGroupPolicyRestrictSendersWarning(params) {
	const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
	return buildOpenGroupPolicyWarning({
		surface: params.surface,
		openBehavior: `allows ${params.openScope} to trigger${mentionSuffix}`,
		remediation: `Set ${params.groupPolicyPath}="allowlist" + ${params.groupAllowFromPath} to restrict senders`
	});
}
function buildOpenGroupPolicyNoRouteAllowlistWarning(params) {
	const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
	return buildOpenGroupPolicyWarning({
		surface: params.surface,
		openBehavior: `with no ${params.routeAllowlistPath} allowlist; any ${params.routeScope} can add + ping${mentionSuffix}`,
		remediation: `Set ${params.groupPolicyPath}="allowlist" + ${params.groupAllowFromPath} or configure ${params.routeAllowlistPath}`
	});
}
function buildOpenGroupPolicyConfigureRouteAllowlistWarning(params) {
	const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
	return buildOpenGroupPolicyWarning({
		surface: params.surface,
		openBehavior: `allows ${params.openScope} to trigger${mentionSuffix}`,
		remediation: `Set ${params.groupPolicyPath}="allowlist" and configure ${params.routeAllowlistPath}`
	});
}
function collectOpenGroupPolicyRestrictSendersWarnings(params) {
	if (params.groupPolicy !== "open") return [];
	return [buildOpenGroupPolicyRestrictSendersWarning(params)];
}
function collectAllowlistProviderRestrictSendersWarnings(params) {
	return collectAllowlistProviderGroupPolicyWarnings({
		cfg: params.cfg,
		providerConfigPresent: params.providerConfigPresent,
		configuredGroupPolicy: params.configuredGroupPolicy,
		collect: (groupPolicy) => collectOpenGroupPolicyRestrictSendersWarnings({
			groupPolicy,
			surface: params.surface,
			openScope: params.openScope,
			groupPolicyPath: params.groupPolicyPath,
			groupAllowFromPath: params.groupAllowFromPath,
			mentionGated: params.mentionGated
		})
	});
}
/** Build an account-aware allowlist-provider warning collector for sender-restricted groups. */
function createAllowlistProviderRestrictSendersWarningCollector(params) {
	return createAllowlistProviderGroupPolicyWarningCollector({
		providerConfigPresent: params.providerConfigPresent,
		resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
		collect: ({ groupPolicy }) => collectOpenGroupPolicyRestrictSendersWarnings({
			groupPolicy,
			surface: params.surface,
			openScope: params.openScope,
			groupPolicyPath: params.groupPolicyPath,
			groupAllowFromPath: params.groupAllowFromPath,
			mentionGated: params.mentionGated
		})
	});
}
/** Build a direct account-aware warning collector when the policy already lives on the account. */
function createOpenGroupPolicyRestrictSendersWarningCollector(params) {
	return (account) => collectOpenGroupPolicyRestrictSendersWarnings({
		groupPolicy: params.resolveGroupPolicy(account) ?? params.defaultGroupPolicy ?? "allowlist",
		surface: params.surface,
		openScope: params.openScope,
		groupPolicyPath: params.groupPolicyPath,
		groupAllowFromPath: params.groupAllowFromPath,
		mentionGated: params.mentionGated
	});
}
function collectAllowlistProviderGroupPolicyWarnings(params) {
	const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
	const { groupPolicy } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: params.providerConfigPresent,
		groupPolicy: params.configuredGroupPolicy ?? void 0,
		defaultGroupPolicy
	});
	return params.collect(groupPolicy);
}
/** Build a config-aware allowlist-provider warning collector from an arbitrary policy resolver. */
function createAllowlistProviderGroupPolicyWarningCollector(params) {
	return (runtime) => collectAllowlistProviderGroupPolicyWarnings({
		cfg: runtime.cfg,
		providerConfigPresent: params.providerConfigPresent(runtime.cfg),
		configuredGroupPolicy: params.resolveGroupPolicy(runtime),
		collect: (groupPolicy) => params.collect({
			...runtime,
			groupPolicy
		})
	});
}
function collectOpenProviderGroupPolicyWarnings(params) {
	const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
	const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: params.providerConfigPresent,
		groupPolicy: params.configuredGroupPolicy ?? void 0,
		defaultGroupPolicy
	});
	return params.collect(groupPolicy);
}
/** Build a config-aware open-provider warning collector from an arbitrary policy resolver. */
function createOpenProviderGroupPolicyWarningCollector(params) {
	return (runtime) => collectOpenProviderGroupPolicyWarnings({
		cfg: runtime.cfg,
		providerConfigPresent: params.providerConfigPresent(runtime.cfg),
		configuredGroupPolicy: params.resolveGroupPolicy(runtime),
		collect: (groupPolicy) => params.collect({
			...runtime,
			groupPolicy
		})
	});
}
/** Build an account-aware allowlist-provider warning collector for simple open-policy warnings. */
function createAllowlistProviderOpenWarningCollector(params) {
	return createAllowlistProviderGroupPolicyWarningCollector({
		providerConfigPresent: params.providerConfigPresent,
		resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
		collect: ({ groupPolicy }) => groupPolicy === "open" ? [buildOpenGroupPolicyWarning(params.buildOpenWarning)] : []
	});
}
function collectOpenGroupPolicyRouteAllowlistWarnings(params) {
	if (params.groupPolicy !== "open") return [];
	if (params.routeAllowlistConfigured) return [buildOpenGroupPolicyRestrictSendersWarning(params.restrictSenders)];
	return [buildOpenGroupPolicyNoRouteAllowlistWarning(params.noRouteAllowlist)];
}
/** Build an account-aware allowlist-provider warning collector for route-allowlisted groups. */
function createAllowlistProviderRouteAllowlistWarningCollector(params) {
	return createAllowlistProviderGroupPolicyWarningCollector({
		providerConfigPresent: params.providerConfigPresent,
		resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
		collect: ({ account, groupPolicy }) => collectOpenGroupPolicyRouteAllowlistWarnings({
			groupPolicy,
			routeAllowlistConfigured: params.resolveRouteAllowlistConfigured(account),
			restrictSenders: params.restrictSenders,
			noRouteAllowlist: params.noRouteAllowlist
		})
	});
}
function collectOpenGroupPolicyConfiguredRouteWarnings(params) {
	if (params.groupPolicy !== "open") return [];
	if (params.routeAllowlistConfigured) return [buildOpenGroupPolicyConfigureRouteAllowlistWarning(params.configureRouteAllowlist)];
	return [buildOpenGroupPolicyWarning(params.missingRouteAllowlist)];
}
/** Build an account-aware open-provider warning collector for configured-route channels. */
function createOpenProviderConfiguredRouteWarningCollector(params) {
	return createOpenProviderGroupPolicyWarningCollector({
		providerConfigPresent: params.providerConfigPresent,
		resolveGroupPolicy: ({ account }) => params.resolveGroupPolicy(account),
		collect: ({ account, groupPolicy }) => collectOpenGroupPolicyConfiguredRouteWarnings({
			groupPolicy,
			routeAllowlistConfigured: params.resolveRouteAllowlistConfigured(account),
			configureRouteAllowlist: params.configureRouteAllowlist,
			missingRouteAllowlist: params.missingRouteAllowlist
		})
	});
}
//#endregion
export { createOpenProviderConfiguredRouteWarningCollector as _, collectAllowlistProviderRestrictSendersWarnings as a, collectOpenGroupPolicyRouteAllowlistWarnings as c, createAllowlistProviderGroupPolicyWarningCollector as d, createAllowlistProviderOpenWarningCollector as f, createOpenGroupPolicyRestrictSendersWarningCollector as g, createConditionalWarningCollector as h, collectAllowlistProviderGroupPolicyWarnings as i, collectOpenProviderGroupPolicyWarnings as l, createAllowlistProviderRouteAllowlistWarningCollector as m, buildOpenGroupPolicyRestrictSendersWarning as n, collectOpenGroupPolicyConfiguredRouteWarnings as o, createAllowlistProviderRestrictSendersWarningCollector as p, buildOpenGroupPolicyWarning as r, collectOpenGroupPolicyRestrictSendersWarnings as s, buildOpenGroupPolicyConfigureRouteAllowlistWarning as t, composeWarningCollectors as u, createOpenProviderGroupPolicyWarningCollector as v, projectWarningCollector as y };
