import { q as createChannelDirectoryAdapter, w as createStaticReplyToModeResolver } from "./auth-profiles-DHKWTcix.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-B0Ci-_gE.js";
import { a as DmPolicySchema, c as GroupPolicySchema, m as MarkdownConfigSchema } from "./zod-schema.core-CsOaEAxi.js";
import { n as buildOpenGroupPolicyRestrictSendersWarning, r as buildOpenGroupPolicyWarning, v as createOpenProviderGroupPolicyWarningCollector } from "./group-policy-warnings-CrQ_hLRZ.js";
import { d as mapAllowFromEntries, i as createScopedChannelConfigAdapter, o as createScopedDmSecurityResolver } from "./channel-config-helpers-Cw--QYL9.js";
import { n as buildCatchallMultiAccountChannelSchema, r as buildChannelConfigSchema, t as AllowFromListSchema } from "./config-schema-DwLf-YhC.js";
import { d as listResolvedDirectoryUserEntriesFromAllowFrom } from "./directory-runtime-CPrvW_du.js";
import { o as buildTokenChannelStatusSummary, t as buildBaseAccountStatusSnapshot } from "./status-helpers-IU0tygtP.js";
import { h as sendPayloadWithChunkedTextAndMedia, l as isNumericTargetId } from "./reply-payload-D-kJUwPE.js";
import { a as createEmptyChannelResult, o as createRawChannelSendResultAdapter } from "./channel-send-result-BiB2m5Rr.js";
import { p as readStringParam, s as jsonResult } from "./common-CFQzxgdg.js";
import { o as stripChannelTargetPrefix, s as stripTargetKindPrefix, t as buildChannelOutboundSessionRoute } from "./core-flS61KKf.js";
import { i as createLazyRuntimeNamedExport, r as createLazyRuntimeModule } from "./lazy-runtime-D1BGR7mw.js";
import { t as extractToolSend } from "./tool-send-Hlyd-Ahs.js";
import { t as formatAllowFromLowercase } from "./allow-from-BxX5ZYW6.js";
import { t as buildSecretInputSchema } from "./secret-input-schema-JfYrkoIw.js";
import { a as resolveZaloAccount, i as resolveDefaultZaloAccountId, n as listEnabledZaloAccounts, r as listZaloAccountIds, s as zaloSetupAdapter, t as zaloSetupWizard } from "./zalo-CpKgQLui.js";
import { t as chunkTextForOutbound } from "./text-chunking-DZzuaKFT.js";
import { z } from "zod";
//#region extensions/zalo/src/actions.ts
const loadZaloActionsRuntime = createLazyRuntimeNamedExport(() => import("./actions.runtime-5bWtoM8Z.js"), "zaloActionsRuntime");
const providerId = "zalo";
function listEnabledAccounts(cfg) {
	return listEnabledZaloAccounts(cfg).filter((account) => account.enabled && account.tokenSource !== "none");
}
const zaloMessageActions = {
	describeMessageTool: ({ cfg }) => {
		if (listEnabledAccounts(cfg).length === 0) return null;
		const actions = new Set(["send"]);
		return {
			actions: Array.from(actions),
			capabilities: []
		};
	},
	extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
	handleAction: async ({ action, params, cfg, accountId }) => {
		if (action === "send") {
			const to = readStringParam(params, "to", { required: true });
			const content = readStringParam(params, "message", {
				required: true,
				allowEmpty: true
			});
			const mediaUrl = readStringParam(params, "media", { trim: false });
			const { sendMessageZalo } = await loadZaloActionsRuntime();
			const result = await sendMessageZalo(to ?? "", content ?? "", {
				accountId: accountId ?? void 0,
				mediaUrl: mediaUrl ?? void 0,
				cfg
			});
			if (!result.ok) return jsonResult({
				ok: false,
				error: result.error ?? "Failed to send Zalo message"
			});
			return jsonResult({
				ok: true,
				to,
				messageId: result.messageId
			});
		}
		throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
	}
};
const ZaloConfigSchema = buildCatchallMultiAccountChannelSchema(z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	markdown: MarkdownConfigSchema,
	botToken: buildSecretInputSchema().optional(),
	tokenFile: z.string().optional(),
	webhookUrl: z.string().optional(),
	webhookSecret: buildSecretInputSchema().optional(),
	webhookPath: z.string().optional(),
	dmPolicy: DmPolicySchema.optional(),
	allowFrom: AllowFromListSchema,
	groupPolicy: GroupPolicySchema.optional(),
	groupAllowFrom: AllowFromListSchema,
	mediaMaxMb: z.number().optional(),
	proxy: z.string().optional(),
	responsePrefix: z.string().optional()
}));
//#endregion
//#region extensions/zalo/src/session-route.ts
function resolveZaloOutboundSessionRoute(params) {
	const trimmed = stripChannelTargetPrefix(params.target, "zalo", "zl");
	if (!trimmed) return null;
	const isGroup = trimmed.toLowerCase().startsWith("group:");
	const peerId = stripTargetKindPrefix(trimmed);
	if (!peerId) return null;
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "zalo",
		accountId: params.accountId,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: peerId
		},
		chatType: isGroup ? "group" : "direct",
		from: isGroup ? `zalo:group:${peerId}` : `zalo:${peerId}`,
		to: `zalo:${peerId}`
	});
}
//#endregion
//#region extensions/shared/status-issues.ts
function readStatusIssueFields(value, fields) {
	if (!value || typeof value !== "object") return null;
	const record = value;
	const result = {};
	for (const field of fields) result[field] = record[field];
	return result;
}
function coerceStatusIssueAccountId(value) {
	return typeof value === "string" ? value : typeof value === "number" ? String(value) : void 0;
}
//#endregion
//#region extensions/zalo/src/status-issues.ts
const ZALO_STATUS_FIELDS = [
	"accountId",
	"enabled",
	"configured",
	"dmPolicy"
];
function collectZaloStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readStatusIssueFields(entry, ZALO_STATUS_FIELDS);
		if (!account) continue;
		const accountId = coerceStatusIssueAccountId(account.accountId) ?? "default";
		const enabled = account.enabled !== false;
		const configured = account.configured === true;
		if (!enabled || !configured) continue;
		if (account.dmPolicy === "open") issues.push({
			channel: "zalo",
			accountId,
			kind: "config",
			message: "Zalo dmPolicy is \"open\", allowing any user to message the bot without pairing.",
			fix: "Set channels.zalo.dmPolicy to \"pairing\" or \"allowlist\" to restrict access."
		});
	}
	return issues;
}
//#endregion
//#region extensions/zalo/src/channel.ts
const meta = {
	id: "zalo",
	label: "Zalo",
	selectionLabel: "Zalo (Bot API)",
	docsPath: "/channels/zalo",
	docsLabel: "zalo",
	blurb: "Vietnam-focused messaging platform with Bot API.",
	aliases: ["zl"],
	order: 80,
	quickstartAllowFrom: true
};
function normalizeZaloMessagingTarget(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	return trimmed.replace(/^(zalo|zl):/i, "");
}
const loadZaloChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-CNekEu90.js"));
const zaloConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "zalo",
	listAccountIds: listZaloAccountIds,
	resolveAccount: (cfg, accountId) => resolveZaloAccount({
		cfg,
		accountId
	}),
	defaultAccountId: resolveDefaultZaloAccountId,
	clearBaseFields: [
		"botToken",
		"tokenFile",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({
		allowFrom,
		stripPrefixRe: /^(zalo|zl):/i
	})
});
const resolveZaloDmPolicy = createScopedDmSecurityResolver({
	channelKey: "zalo",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => raw.replace(/^(zalo|zl):/i, "")
});
const collectZaloSecurityWarnings = createOpenProviderGroupPolicyWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.zalo !== void 0,
	resolveGroupPolicy: ({ account }) => account.config.groupPolicy,
	collect: ({ account, groupPolicy }) => {
		if (groupPolicy !== "open") return [];
		const explicitGroupAllowFrom = mapAllowFromEntries(account.config.groupAllowFrom);
		const dmAllowFrom = mapAllowFromEntries(account.config.allowFrom);
		if ((explicitGroupAllowFrom.length > 0 ? explicitGroupAllowFrom : dmAllowFrom).length > 0) return [buildOpenGroupPolicyRestrictSendersWarning({
			surface: "Zalo groups",
			openScope: "any member",
			groupPolicyPath: "channels.zalo.groupPolicy",
			groupAllowFromPath: "channels.zalo.groupAllowFrom"
		})];
		return [buildOpenGroupPolicyWarning({
			surface: "Zalo groups",
			openBehavior: "with no groupAllowFrom/allowFrom allowlist; any member can trigger (mention-gated)",
			remediation: "Set channels.zalo.groupPolicy=\"allowlist\" + channels.zalo.groupAllowFrom"
		})];
	}
});
const zaloPlugin = {
	id: "zalo",
	meta,
	setup: zaloSetupAdapter,
	setupWizard: zaloSetupWizard,
	capabilities: {
		chatTypes: ["direct", "group"],
		media: true,
		reactions: false,
		threads: false,
		polls: false,
		nativeCommands: false,
		blockStreaming: true
	},
	reload: { configPrefixes: ["channels.zalo"] },
	configSchema: buildChannelConfigSchema(ZaloConfigSchema),
	config: {
		...zaloConfigAdapter,
		isConfigured: (account) => Boolean(account.token?.trim()),
		describeAccount: (account) => ({
			accountId: account.accountId,
			name: account.name,
			enabled: account.enabled,
			configured: Boolean(account.token?.trim()),
			tokenSource: account.tokenSource
		})
	},
	security: {
		resolveDmPolicy: resolveZaloDmPolicy,
		collectWarnings: collectZaloSecurityWarnings
	},
	groups: { resolveRequireMention: () => true },
	threading: { resolveReplyToMode: createStaticReplyToModeResolver("off") },
	actions: zaloMessageActions,
	messaging: {
		normalizeTarget: normalizeZaloMessagingTarget,
		resolveOutboundSessionRoute: (params) => resolveZaloOutboundSessionRoute(params),
		targetResolver: {
			looksLikeId: isNumericTargetId,
			hint: "<chatId>"
		}
	},
	directory: createChannelDirectoryAdapter({
		listPeers: async (params) => listResolvedDirectoryUserEntriesFromAllowFrom({
			...params,
			resolveAccount: (cfg, accountId) => resolveZaloAccount({
				cfg,
				accountId
			}),
			resolveAllowFrom: (account) => account.config.allowFrom,
			normalizeId: (entry) => entry.replace(/^(zalo|zl):/i, "")
		}),
		listGroups: async () => []
	}),
	pairing: {
		idLabel: "zaloUserId",
		normalizeAllowEntry: (entry) => entry.replace(/^(zalo|zl):/i, ""),
		notifyApproval: async (params) => await (await loadZaloChannelRuntime()).notifyZaloPairingApproval(params)
	},
	outbound: {
		deliveryMode: "direct",
		chunker: chunkTextForOutbound,
		chunkerMode: "text",
		textChunkLimit: 2e3,
		sendPayload: async (ctx) => await sendPayloadWithChunkedTextAndMedia({
			ctx,
			textChunkLimit: zaloPlugin.outbound.textChunkLimit,
			chunker: zaloPlugin.outbound.chunker,
			sendText: (nextCtx) => zaloPlugin.outbound.sendText(nextCtx),
			sendMedia: (nextCtx) => zaloPlugin.outbound.sendMedia(nextCtx),
			emptyResult: createEmptyChannelResult("zalo")
		}),
		...createRawChannelSendResultAdapter({
			channel: "zalo",
			sendText: async ({ to, text, accountId, cfg }) => await (await loadZaloChannelRuntime()).sendZaloText({
				to,
				text,
				accountId: accountId ?? void 0,
				cfg
			}),
			sendMedia: async ({ to, text, mediaUrl, accountId, cfg }) => await (await loadZaloChannelRuntime()).sendZaloText({
				to,
				text,
				accountId: accountId ?? void 0,
				mediaUrl,
				cfg
			})
		})
	},
	status: {
		defaultRuntime: {
			accountId: DEFAULT_ACCOUNT_ID,
			running: false,
			lastStartAt: null,
			lastStopAt: null,
			lastError: null
		},
		collectStatusIssues: collectZaloStatusIssues,
		buildChannelSummary: ({ snapshot }) => buildTokenChannelStatusSummary(snapshot),
		probeAccount: async ({ account, timeoutMs }) => await (await loadZaloChannelRuntime()).probeZaloAccount({
			account,
			timeoutMs
		}),
		buildAccountSnapshot: ({ account, runtime }) => {
			const configured = Boolean(account.token?.trim());
			return {
				...buildBaseAccountStatusSnapshot({
					account: {
						accountId: account.accountId,
						name: account.name,
						enabled: account.enabled,
						configured
					},
					runtime
				}),
				tokenSource: account.tokenSource,
				mode: account.config.webhookUrl ? "webhook" : "polling",
				dmPolicy: account.config.dmPolicy ?? "pairing"
			};
		}
	},
	gateway: { startAccount: async (ctx) => await (await loadZaloChannelRuntime()).startZaloGatewayAccount(ctx) }
};
//#endregion
export { zaloPlugin as t };
