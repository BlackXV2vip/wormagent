import { m as normalizeE164 } from "./utils-1TVTmhOV.js";
import { n as normalizeAccountId } from "./account-id-B0Ci-_gE.js";
import { r as normalizeStringEntries } from "./string-normalization-CnYrQB31.js";
import { t as getChannelPlugin } from "./registry-BQSOw8NA.js";
import { n as deleteAccountFromConfigSection, r as setAccountEnabledInConfigSection } from "./config-helpers-DqKTxdfr.js";
import { t as buildAccountScopedDmSecurityPolicy } from "./helpers-B6WRZ2PN.js";
//#region src/whatsapp/normalize.ts
const WHATSAPP_USER_JID_RE = /^(\d+)(?::\d+)?@s\.whatsapp\.net$/i;
const WHATSAPP_LID_RE = /^(\d+)@lid$/i;
function stripWhatsAppTargetPrefixes(value) {
	let candidate = value.trim();
	for (;;) {
		const before = candidate;
		candidate = candidate.replace(/^whatsapp:/i, "").trim();
		if (candidate === before) return candidate;
	}
}
function isWhatsAppGroupJid(value) {
	const candidate = stripWhatsAppTargetPrefixes(value);
	if (!candidate.toLowerCase().endsWith("@g.us")) return false;
	const localPart = candidate.slice(0, candidate.length - 5);
	if (!localPart || localPart.includes("@")) return false;
	return /^[0-9]+(-[0-9]+)*$/.test(localPart);
}
/**
* Check if value looks like a WhatsApp user target (e.g. "41796666864:0@s.whatsapp.net" or "123@lid").
*/
function isWhatsAppUserTarget(value) {
	const candidate = stripWhatsAppTargetPrefixes(value);
	return WHATSAPP_USER_JID_RE.test(candidate) || WHATSAPP_LID_RE.test(candidate);
}
/**
* Extract the phone number from a WhatsApp user JID.
* "41796666864:0@s.whatsapp.net" -> "41796666864"
* "123456@lid" -> "123456"
*/
function extractUserJidPhone(jid) {
	const userMatch = jid.match(WHATSAPP_USER_JID_RE);
	if (userMatch) return userMatch[1];
	const lidMatch = jid.match(WHATSAPP_LID_RE);
	if (lidMatch) return lidMatch[1];
	return null;
}
function normalizeWhatsAppTarget(value) {
	const candidate = stripWhatsAppTargetPrefixes(value);
	if (!candidate) return null;
	if (isWhatsAppGroupJid(candidate)) return `${candidate.slice(0, candidate.length - 5)}@g.us`;
	if (isWhatsAppUserTarget(candidate)) {
		const phone = extractUserJidPhone(candidate);
		if (!phone) return null;
		const normalized = normalizeE164(phone);
		return normalized.length > 1 ? normalized : null;
	}
	if (candidate.includes("@")) return null;
	const normalized = normalizeE164(candidate);
	return normalized.length > 1 ? normalized : null;
}
//#endregion
//#region src/channels/plugins/normalize/shared.ts
function trimMessagingTarget(raw) {
	return raw.trim() || void 0;
}
function looksLikeHandleOrPhoneTarget(params) {
	const trimmed = params.raw.trim();
	if (!trimmed) return false;
	if (params.prefixPattern.test(trimmed)) return true;
	if (trimmed.includes("@")) return true;
	return (params.phonePattern ?? /^\+?\d{3,}$/).test(trimmed);
}
//#endregion
//#region src/channels/plugins/normalize/whatsapp.ts
function normalizeWhatsAppMessagingTarget(raw) {
	const trimmed = trimMessagingTarget(raw);
	if (!trimmed) return;
	return normalizeWhatsAppTarget(trimmed) ?? void 0;
}
function normalizeWhatsAppAllowFromEntries(allowFrom) {
	return allowFrom.map((entry) => String(entry).trim()).filter((entry) => Boolean(entry)).map((entry) => entry === "*" ? entry : normalizeWhatsAppTarget(entry)).filter((entry) => Boolean(entry));
}
function looksLikeWhatsAppTargetId(raw) {
	return looksLikeHandleOrPhoneTarget({
		raw,
		prefixPattern: /^whatsapp:/i
	});
}
//#endregion
//#region src/plugin-sdk/channel-config-helpers.ts
/** Coerce mixed allowlist config values into plain strings without trimming or deduping. */
function mapAllowFromEntries(allowFrom) {
	return (allowFrom ?? []).map((entry) => String(entry));
}
/** Normalize user-facing allowlist entries the same way config and doctor flows expect. */
function formatTrimmedAllowFromEntries(allowFrom) {
	return normalizeStringEntries(allowFrom);
}
/** Collapse nullable config scalars into a trimmed optional string. */
function resolveOptionalConfigString(value) {
	if (value == null) return;
	return String(value).trim() || void 0;
}
/** Build the shared allowlist/default target adapter surface for account-scoped channel configs. */
function createScopedAccountConfigAccessors(params) {
	const base = {
		resolveAllowFrom: ({ cfg, accountId }) => mapAllowFromEntries(params.resolveAllowFrom(params.resolveAccount({
			cfg,
			accountId
		}))),
		formatAllowFrom: ({ allowFrom }) => params.formatAllowFrom(allowFrom)
	};
	if (!params.resolveDefaultTo) return base;
	return {
		...base,
		resolveDefaultTo: ({ cfg, accountId }) => resolveOptionalConfigString(params.resolveDefaultTo?.(params.resolveAccount({
			cfg,
			accountId
		})))
	};
}
/** Build the common CRUD/config helpers for channels that store multiple named accounts. */
function createScopedChannelConfigBase(params) {
	return {
		listAccountIds: (cfg) => params.listAccountIds(cfg),
		resolveAccount: (cfg, accountId) => params.resolveAccount(cfg, accountId),
		inspectAccount: params.inspectAccount ? (cfg, accountId) => params.inspectAccount?.(cfg, accountId) : void 0,
		defaultAccountId: (cfg) => params.defaultAccountId(cfg),
		setAccountEnabled: ({ cfg, accountId, enabled }) => setAccountEnabledInConfigSection({
			cfg,
			sectionKey: params.sectionKey,
			accountId,
			enabled,
			allowTopLevel: params.allowTopLevel ?? true
		}),
		deleteAccount: ({ cfg, accountId }) => deleteAccountFromConfigSection({
			cfg,
			sectionKey: params.sectionKey,
			accountId,
			clearBaseFields: params.clearBaseFields
		})
	};
}
/** Build the full shared config adapter for account-scoped channels with allowlist/default target accessors. */
function createScopedChannelConfigAdapter(params) {
	const resolveAccessorAccount = params.resolveAccessorAccount ?? (({ cfg, accountId }) => params.resolveAccount(cfg, accountId));
	return {
		...createScopedChannelConfigBase({
			sectionKey: params.sectionKey,
			listAccountIds: params.listAccountIds,
			resolveAccount: params.resolveAccount,
			inspectAccount: params.inspectAccount,
			defaultAccountId: params.defaultAccountId,
			clearBaseFields: params.clearBaseFields,
			allowTopLevel: params.allowTopLevel
		}),
		...createScopedAccountConfigAccessors({
			resolveAccount: resolveAccessorAccount,
			resolveAllowFrom: params.resolveAllowFrom,
			formatAllowFrom: params.formatAllowFrom,
			resolveDefaultTo: params.resolveDefaultTo
		})
	};
}
function setTopLevelChannelEnabledInConfigSection(params) {
	const section = params.cfg.channels?.[params.sectionKey];
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.sectionKey]: {
				...section,
				enabled: params.enabled
			}
		}
	};
}
function removeTopLevelChannelConfigSection(params) {
	const nextChannels = { ...params.cfg.channels };
	delete nextChannels[params.sectionKey];
	const nextCfg = { ...params.cfg };
	if (Object.keys(nextChannels).length > 0) nextCfg.channels = nextChannels;
	else delete nextCfg.channels;
	return nextCfg;
}
function clearTopLevelChannelConfigFields(params) {
	const section = params.cfg.channels?.[params.sectionKey];
	if (!section) return params.cfg;
	const nextSection = { ...section };
	for (const field of params.clearBaseFields) delete nextSection[field];
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			[params.sectionKey]: nextSection
		}
	};
}
/** Build CRUD/config helpers for top-level single-account channels. */
function createTopLevelChannelConfigBase(params) {
	return {
		listAccountIds: (cfg) => params.listAccountIds?.(cfg) ?? ["default"],
		resolveAccount: (cfg) => params.resolveAccount(cfg),
		inspectAccount: params.inspectAccount ? (cfg) => params.inspectAccount?.(cfg) : void 0,
		defaultAccountId: (cfg) => params.defaultAccountId?.(cfg) ?? "default",
		setAccountEnabled: ({ cfg, enabled }) => setTopLevelChannelEnabledInConfigSection({
			cfg,
			sectionKey: params.sectionKey,
			enabled
		}),
		deleteAccount: ({ cfg }) => params.deleteMode === "clear-fields" ? clearTopLevelChannelConfigFields({
			cfg,
			sectionKey: params.sectionKey,
			clearBaseFields: params.clearBaseFields ?? []
		}) : removeTopLevelChannelConfigSection({
			cfg,
			sectionKey: params.sectionKey
		})
	};
}
/** Build the full shared config adapter for top-level single-account channels with allowlist/default target accessors. */
function createTopLevelChannelConfigAdapter(params) {
	const resolveAccessorAccount = params.resolveAccessorAccount ?? (({ cfg }) => params.resolveAccount(cfg));
	return {
		...createTopLevelChannelConfigBase({
			sectionKey: params.sectionKey,
			resolveAccount: params.resolveAccount,
			listAccountIds: params.listAccountIds,
			defaultAccountId: params.defaultAccountId,
			inspectAccount: params.inspectAccount,
			deleteMode: params.deleteMode,
			clearBaseFields: params.clearBaseFields
		}),
		...createScopedAccountConfigAccessors({
			resolveAccount: resolveAccessorAccount,
			resolveAllowFrom: params.resolveAllowFrom,
			formatAllowFrom: params.formatAllowFrom,
			resolveDefaultTo: params.resolveDefaultTo
		})
	};
}
/** Build CRUD/config helpers for channels where the default account lives at channel root and named accounts live under `accounts`. */
function createHybridChannelConfigBase(params) {
	return {
		listAccountIds: (cfg) => params.listAccountIds(cfg),
		resolveAccount: (cfg, accountId) => params.resolveAccount(cfg, accountId),
		inspectAccount: params.inspectAccount ? (cfg, accountId) => params.inspectAccount?.(cfg, accountId) : void 0,
		defaultAccountId: (cfg) => params.defaultAccountId(cfg),
		setAccountEnabled: ({ cfg, accountId, enabled }) => {
			if (normalizeAccountId(accountId) === "default") return setTopLevelChannelEnabledInConfigSection({
				cfg,
				sectionKey: params.sectionKey,
				enabled
			});
			return setAccountEnabledInConfigSection({
				cfg,
				sectionKey: params.sectionKey,
				accountId,
				enabled
			});
		},
		deleteAccount: ({ cfg, accountId }) => {
			if (normalizeAccountId(accountId) === "default") {
				if (params.preserveSectionOnDefaultDelete) return clearTopLevelChannelConfigFields({
					cfg,
					sectionKey: params.sectionKey,
					clearBaseFields: params.clearBaseFields
				});
				return deleteAccountFromConfigSection({
					cfg,
					sectionKey: params.sectionKey,
					accountId,
					clearBaseFields: params.clearBaseFields
				});
			}
			return deleteAccountFromConfigSection({
				cfg,
				sectionKey: params.sectionKey,
				accountId,
				clearBaseFields: params.clearBaseFields
			});
		}
	};
}
/** Build the full shared config adapter for hybrid channels with allowlist/default target accessors. */
function createHybridChannelConfigAdapter(params) {
	const resolveAccessorAccount = params.resolveAccessorAccount ?? (({ cfg, accountId }) => params.resolveAccount(cfg, accountId));
	return {
		...createHybridChannelConfigBase({
			sectionKey: params.sectionKey,
			listAccountIds: params.listAccountIds,
			resolveAccount: params.resolveAccount,
			inspectAccount: params.inspectAccount,
			defaultAccountId: params.defaultAccountId,
			clearBaseFields: params.clearBaseFields,
			preserveSectionOnDefaultDelete: params.preserveSectionOnDefaultDelete
		}),
		...createScopedAccountConfigAccessors({
			resolveAccount: resolveAccessorAccount,
			resolveAllowFrom: params.resolveAllowFrom,
			formatAllowFrom: params.formatAllowFrom,
			resolveDefaultTo: params.resolveDefaultTo
		})
	};
}
/** Convert account-specific DM security fields into the shared runtime policy resolver shape. */
function createScopedDmSecurityResolver(params) {
	return ({ cfg, accountId, account }) => buildAccountScopedDmSecurityPolicy({
		cfg,
		channelKey: params.channelKey,
		accountId,
		fallbackAccountId: params.resolveFallbackAccountId?.(account) ?? account.accountId,
		policy: params.resolvePolicy(account),
		allowFrom: params.resolveAllowFrom(account) ?? [],
		defaultPolicy: params.defaultPolicy,
		allowFromPathSuffix: params.allowFromPathSuffix,
		policyPathSuffix: params.policyPathSuffix,
		approveChannelId: params.approveChannelId,
		approveHint: params.approveHint,
		normalizeEntry: params.normalizeEntry
	});
}
/** Read the effective WhatsApp allowlist through the active plugin contract. */
function resolveWhatsAppConfigAllowFrom(params) {
	const account = getChannelPlugin("whatsapp")?.config.resolveAccount(params.cfg, params.accountId);
	return account && typeof account === "object" && Array.isArray(account.allowFrom) ? account.allowFrom.map(String) : [];
}
/** Format WhatsApp allowlist entries with the same normalization used by the channel plugin. */
function formatWhatsAppConfigAllowFromEntries(allowFrom) {
	return normalizeWhatsAppAllowFromEntries(allowFrom);
}
/** Resolve the effective WhatsApp default recipient after account and root config fallback. */
function resolveWhatsAppConfigDefaultTo(params) {
	const root = params.cfg.channels?.whatsapp;
	const normalized = normalizeAccountId(params.accountId);
	return ((root?.accounts?.[normalized])?.defaultTo ?? root?.defaultTo)?.trim() || void 0;
}
/** Read iMessage allowlist entries from the active plugin's resolved account view. */
function resolveIMessageConfigAllowFrom(params) {
	const account = getChannelPlugin("imessage")?.config.resolveAccount(params.cfg, params.accountId);
	if (!account || typeof account !== "object" || !("config" in account)) return [];
	return mapAllowFromEntries(account.config.allowFrom);
}
/** Resolve the effective iMessage default recipient from the plugin-resolved account config. */
function resolveIMessageConfigDefaultTo(params) {
	const account = getChannelPlugin("imessage")?.config.resolveAccount(params.cfg, params.accountId);
	if (!account || typeof account !== "object" || !("config" in account)) return;
	return resolveOptionalConfigString(account.config.defaultTo);
}
//#endregion
export { isWhatsAppUserTarget as C, isWhatsAppGroupJid as S, looksLikeWhatsAppTargetId as _, createScopedChannelConfigBase as a, looksLikeHandleOrPhoneTarget as b, createTopLevelChannelConfigBase as c, mapAllowFromEntries as d, resolveIMessageConfigAllowFrom as f, resolveWhatsAppConfigDefaultTo as g, resolveWhatsAppConfigAllowFrom as h, createScopedChannelConfigAdapter as i, formatTrimmedAllowFromEntries as l, resolveOptionalConfigString as m, createHybridChannelConfigBase as n, createScopedDmSecurityResolver as o, resolveIMessageConfigDefaultTo as p, createScopedAccountConfigAccessors as r, createTopLevelChannelConfigAdapter as s, createHybridChannelConfigAdapter as t, formatWhatsAppConfigAllowFromEntries as u, normalizeWhatsAppAllowFromEntries as v, normalizeWhatsAppTarget as w, trimMessagingTarget as x, normalizeWhatsAppMessagingTarget as y };
