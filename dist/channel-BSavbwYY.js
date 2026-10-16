import { t as formatDocsLink } from "./links-B85QumIb.js";
import { M as createTextPairingAdapter, Oo as promptParsedAllowFromForAccount, j as createPairingPrefixStripper, mo as createTopLevelChannelDmPolicySetter, so as createAllowFromSection } from "./auth-profiles-DHKWTcix.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-B0Ci-_gE.js";
import { a as hasConfiguredSecretInput, l as normalizeSecretInputString } from "./types.secrets-Mh0km-xK.js";
import { M as ToolPolicySchema } from "./zod-schema.providers-core-Doq9WIkR.js";
import { a as DmPolicySchema, c as GroupPolicySchema, m as MarkdownConfigSchema } from "./zod-schema.core-CsOaEAxi.js";
import { g as createOpenGroupPolicyRestrictSendersWarningCollector, y as projectWarningCollector } from "./group-policy-warnings-CrQ_hLRZ.js";
import { i as createScopedChannelConfigAdapter, o as createScopedDmSecurityResolver } from "./channel-config-helpers-Cw--QYL9.js";
import { c as prepareScopedSetupConfig, s as patchScopedAccountConfig } from "./setup-helpers-COFI7uRD.js";
import { n as buildCatchallMultiAccountChannelSchema, r as buildChannelConfigSchema, t as AllowFromListSchema } from "./config-schema-DwLf-YhC.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./channel-plugin-common-D2M5Ijyp.js";
import { i as buildProbeChannelStatusSummary, r as buildComputedAccountStatusSnapshot } from "./status-helpers-IU0tygtP.js";
import { i as createAttachedChannelResultAdapter } from "./channel-send-result-BiB2m5Rr.js";
import { i as createActionGate, l as readNumberParam, p as readStringParam, s as jsonResult, u as readReactionParams } from "./common-CFQzxgdg.js";
import { o as stripChannelTargetPrefix, t as buildChannelOutboundSessionRoute } from "./core-flS61KKf.js";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-D1BGR7mw.js";
import { t as extractToolSend } from "./tool-send-Hlyd-Ahs.js";
import { t as readBooleanParam } from "./boolean-param-CNVhPX2z.js";
import { n as formatNormalizedAllowFromEntries } from "./allow-from-BxX5ZYW6.js";
import { t as createAccountStatusSink } from "./channel-lifecycle-BMj33IhG.js";
import { n as resolveBlueBubblesGroupRequireMention, r as resolveBlueBubblesGroupToolPolicy, t as collectBlueBubblesStatusIssues } from "./bluebubbles-DldvbtDR.js";
import { n as BLUEBUBBLES_ACTION_NAMES, t as BLUEBUBBLES_ACTIONS } from "./bluebubbles-CgUtxBJ6.js";
import { t as buildSecretInputSchema } from "./secret-input-schema-JfYrkoIw.js";
import { _ as isMacOS26OrHigher, a as inferBlueBubblesTargetChatType, b as resolveBlueBubblesAccount, c as looksLikeBlueBubblesTargetId, d as parseBlueBubblesAllowTarget, f as parseBlueBubblesTarget, l as normalizeBlueBubblesHandle, m as getCachedBlueBubblesPrivateApiStatus, r as extractHandleFromChatGuid, s as looksLikeBlueBubblesExplicitTargetId, t as DEFAULT_WEBHOOK_PATH, u as normalizeBlueBubblesMessagingTarget, w as normalizeBlueBubblesServerUrl, x as resolveDefaultBlueBubblesAccountId, y as listBlueBubblesAccountIds } from "./monitor-shared-7F-rcR8N.js";
import { z } from "zod";
//#region extensions/bluebubbles/src/actions.ts
const loadBlueBubblesActionsRuntime = createLazyRuntimeNamedExport(() => import("./actions.runtime-BZXfrgo0.js"), "blueBubblesActionsRuntime");
const providerId = "bluebubbles";
function mapTarget(raw) {
	const parsed = parseBlueBubblesTarget(raw);
	if (parsed.kind === "chat_guid") return {
		kind: "chat_guid",
		chatGuid: parsed.chatGuid
	};
	if (parsed.kind === "chat_id") return {
		kind: "chat_id",
		chatId: parsed.chatId
	};
	if (parsed.kind === "chat_identifier") return {
		kind: "chat_identifier",
		chatIdentifier: parsed.chatIdentifier
	};
	return {
		kind: "handle",
		address: normalizeBlueBubblesHandle(parsed.to),
		service: parsed.service
	};
}
function readMessageText(params) {
	return readStringParam(params, "text") ?? readStringParam(params, "message");
}
/** Supported action names for BlueBubbles */
const SUPPORTED_ACTIONS = new Set(BLUEBUBBLES_ACTION_NAMES);
const PRIVATE_API_ACTIONS = new Set([
	"react",
	"edit",
	"unsend",
	"reply",
	"sendWithEffect",
	"renameGroup",
	"setGroupIcon",
	"addParticipant",
	"removeParticipant",
	"leaveGroup"
]);
const bluebubblesMessageActions = {
	describeMessageTool: ({ cfg, currentChannelId }) => {
		const account = resolveBlueBubblesAccount({ cfg });
		if (!account.enabled || !account.configured) return null;
		const gate = createActionGate(cfg.channels?.bluebubbles?.actions);
		const actions = /* @__PURE__ */ new Set();
		const macOS26 = isMacOS26OrHigher(account.accountId);
		const privateApiStatus = getCachedBlueBubblesPrivateApiStatus(account.accountId);
		for (const action of BLUEBUBBLES_ACTION_NAMES) {
			const spec = BLUEBUBBLES_ACTIONS[action];
			if (!spec?.gate) continue;
			if (privateApiStatus === false && PRIVATE_API_ACTIONS.has(action)) continue;
			if ("unsupportedOnMacOS26" in spec && spec.unsupportedOnMacOS26 && macOS26) continue;
			if (gate(spec.gate)) actions.add(action);
		}
		const lowered = (currentChannelId ? normalizeBlueBubblesMessagingTarget(currentChannelId) : void 0)?.trim().toLowerCase() ?? "";
		if (!(lowered.startsWith("chat_guid:") || lowered.startsWith("chat_id:") || lowered.startsWith("chat_identifier:") || lowered.startsWith("group:"))) {
			for (const action of BLUEBUBBLES_ACTION_NAMES) if ("groupOnly" in BLUEBUBBLES_ACTIONS[action] && BLUEBUBBLES_ACTIONS[action].groupOnly) actions.delete(action);
		}
		return { actions: Array.from(actions) };
	},
	supportsAction: ({ action }) => SUPPORTED_ACTIONS.has(action),
	extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
	handleAction: async ({ action, params, cfg, accountId, toolContext }) => {
		const runtime = await loadBlueBubblesActionsRuntime();
		const account = resolveBlueBubblesAccount({
			cfg,
			accountId: accountId ?? void 0
		});
		const baseUrl = normalizeSecretInputString(account.config.serverUrl);
		const password = normalizeSecretInputString(account.config.password);
		const opts = {
			cfg,
			accountId: accountId ?? void 0
		};
		const assertPrivateApiEnabled = () => {
			if (getCachedBlueBubblesPrivateApiStatus(account.accountId) === false) throw new Error(`BlueBubbles ${action} requires Private API, but it is disabled on the BlueBubbles server.`);
		};
		const resolveChatGuid = async () => {
			const chatGuid = readStringParam(params, "chatGuid");
			if (chatGuid?.trim()) return chatGuid.trim();
			const chatIdentifier = readStringParam(params, "chatIdentifier");
			const chatId = readNumberParam(params, "chatId", { integer: true });
			const to = readStringParam(params, "to");
			const contextTarget = toolContext?.currentChannelId?.trim();
			const target = chatIdentifier?.trim() ? {
				kind: "chat_identifier",
				chatIdentifier: chatIdentifier.trim()
			} : typeof chatId === "number" ? {
				kind: "chat_id",
				chatId
			} : to ? mapTarget(to) : contextTarget ? mapTarget(contextTarget) : null;
			if (!target) throw new Error(`BlueBubbles ${action} requires chatGuid, chatIdentifier, chatId, or to.`);
			if (!baseUrl || !password) throw new Error(`BlueBubbles ${action} requires serverUrl and password.`);
			const resolved = await runtime.resolveChatGuidForTarget({
				baseUrl,
				password,
				target
			});
			if (!resolved) throw new Error(`BlueBubbles ${action} failed: chatGuid not found for target.`);
			return resolved;
		};
		if (action === "react") {
			assertPrivateApiEnabled();
			const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a BlueBubbles reaction." });
			if (isEmpty && !remove) throw new Error("BlueBubbles react requires emoji parameter. Use action=react with emoji=<emoji> and messageId=<message_id>.");
			const rawMessageId = readStringParam(params, "messageId");
			if (!rawMessageId) throw new Error("BlueBubbles react requires messageId parameter (the message ID to react to). Use action=react with messageId=<message_id>, emoji=<emoji>, and to/chatGuid to identify the chat.");
			const messageId = runtime.resolveBlueBubblesMessageId(rawMessageId, { requireKnownShortId: true });
			const partIndex = readNumberParam(params, "partIndex", { integer: true });
			const resolvedChatGuid = await resolveChatGuid();
			await runtime.sendBlueBubblesReaction({
				chatGuid: resolvedChatGuid,
				messageGuid: messageId,
				emoji,
				remove: remove || void 0,
				partIndex: typeof partIndex === "number" ? partIndex : void 0,
				opts
			});
			return jsonResult({
				ok: true,
				...remove ? { removed: true } : { added: emoji }
			});
		}
		if (action === "edit") {
			assertPrivateApiEnabled();
			if (isMacOS26OrHigher(accountId ?? void 0)) throw new Error("BlueBubbles edit is not supported on macOS 26 or higher. Apple removed the ability to edit iMessages in this version.");
			const rawMessageId = readStringParam(params, "messageId");
			const newText = readStringParam(params, "text") ?? readStringParam(params, "newText") ?? readStringParam(params, "message");
			if (!rawMessageId || !newText) {
				const missing = [];
				if (!rawMessageId) missing.push("messageId (the message ID to edit)");
				if (!newText) missing.push("text (the new message content)");
				throw new Error(`BlueBubbles edit requires: ${missing.join(", ")}. Use action=edit with messageId=<message_id>, text=<new_content>.`);
			}
			const messageId = runtime.resolveBlueBubblesMessageId(rawMessageId, { requireKnownShortId: true });
			const partIndex = readNumberParam(params, "partIndex", { integer: true });
			const backwardsCompatMessage = readStringParam(params, "backwardsCompatMessage");
			await runtime.editBlueBubblesMessage(messageId, newText, {
				...opts,
				partIndex: typeof partIndex === "number" ? partIndex : void 0,
				backwardsCompatMessage: backwardsCompatMessage ?? void 0
			});
			return jsonResult({
				ok: true,
				edited: rawMessageId
			});
		}
		if (action === "unsend") {
			assertPrivateApiEnabled();
			const rawMessageId = readStringParam(params, "messageId");
			if (!rawMessageId) throw new Error("BlueBubbles unsend requires messageId parameter (the message ID to unsend). Use action=unsend with messageId=<message_id>.");
			const messageId = runtime.resolveBlueBubblesMessageId(rawMessageId, { requireKnownShortId: true });
			const partIndex = readNumberParam(params, "partIndex", { integer: true });
			await runtime.unsendBlueBubblesMessage(messageId, {
				...opts,
				partIndex: typeof partIndex === "number" ? partIndex : void 0
			});
			return jsonResult({
				ok: true,
				unsent: rawMessageId
			});
		}
		if (action === "reply") {
			assertPrivateApiEnabled();
			const rawMessageId = readStringParam(params, "messageId");
			const text = readMessageText(params);
			const to = readStringParam(params, "to") ?? readStringParam(params, "target");
			if (!rawMessageId || !text || !to) {
				const missing = [];
				if (!rawMessageId) missing.push("messageId (the message ID to reply to)");
				if (!text) missing.push("text or message (the reply message content)");
				if (!to) missing.push("to or target (the chat target)");
				throw new Error(`BlueBubbles reply requires: ${missing.join(", ")}. Use action=reply with messageId=<message_id>, message=<your reply>, target=<chat_target>.`);
			}
			const messageId = runtime.resolveBlueBubblesMessageId(rawMessageId, { requireKnownShortId: true });
			const partIndex = readNumberParam(params, "partIndex", { integer: true });
			return jsonResult({
				ok: true,
				messageId: (await runtime.sendMessageBlueBubbles(to, text, {
					...opts,
					replyToMessageGuid: messageId,
					replyToPartIndex: typeof partIndex === "number" ? partIndex : void 0
				})).messageId,
				repliedTo: rawMessageId
			});
		}
		if (action === "sendWithEffect") {
			assertPrivateApiEnabled();
			const text = readMessageText(params);
			const to = readStringParam(params, "to") ?? readStringParam(params, "target");
			const effectId = readStringParam(params, "effectId") ?? readStringParam(params, "effect");
			if (!text || !to || !effectId) {
				const missing = [];
				if (!text) missing.push("text or message (the message content)");
				if (!to) missing.push("to or target (the chat target)");
				if (!effectId) missing.push("effectId or effect (e.g., slam, loud, gentle, invisible-ink, confetti, lasers, fireworks, balloons, heart)");
				throw new Error(`BlueBubbles sendWithEffect requires: ${missing.join(", ")}. Use action=sendWithEffect with message=<message>, target=<chat_target>, effectId=<effect_name>.`);
			}
			return jsonResult({
				ok: true,
				messageId: (await runtime.sendMessageBlueBubbles(to, text, {
					...opts,
					effectId
				})).messageId,
				effect: effectId
			});
		}
		if (action === "renameGroup") {
			assertPrivateApiEnabled();
			const resolvedChatGuid = await resolveChatGuid();
			const displayName = readStringParam(params, "displayName") ?? readStringParam(params, "name");
			if (!displayName) throw new Error("BlueBubbles renameGroup requires displayName or name parameter.");
			await runtime.renameBlueBubblesChat(resolvedChatGuid, displayName, opts);
			return jsonResult({
				ok: true,
				renamed: resolvedChatGuid,
				displayName
			});
		}
		if (action === "setGroupIcon") {
			assertPrivateApiEnabled();
			const resolvedChatGuid = await resolveChatGuid();
			const base64Buffer = readStringParam(params, "buffer");
			const filename = readStringParam(params, "filename") ?? readStringParam(params, "name") ?? "icon.png";
			const contentType = readStringParam(params, "contentType") ?? readStringParam(params, "mimeType");
			if (!base64Buffer) throw new Error("BlueBubbles setGroupIcon requires an image. Use action=setGroupIcon with media=<image_url> or path=<local_file_path> to set the group icon.");
			const buffer = Uint8Array.from(atob(base64Buffer), (c) => c.charCodeAt(0));
			await runtime.setGroupIconBlueBubbles(resolvedChatGuid, buffer, filename, {
				...opts,
				contentType: contentType ?? void 0
			});
			return jsonResult({
				ok: true,
				chatGuid: resolvedChatGuid,
				iconSet: true
			});
		}
		if (action === "addParticipant") {
			assertPrivateApiEnabled();
			const resolvedChatGuid = await resolveChatGuid();
			const address = readStringParam(params, "address") ?? readStringParam(params, "participant");
			if (!address) throw new Error("BlueBubbles addParticipant requires address or participant parameter.");
			await runtime.addBlueBubblesParticipant(resolvedChatGuid, address, opts);
			return jsonResult({
				ok: true,
				added: address,
				chatGuid: resolvedChatGuid
			});
		}
		if (action === "removeParticipant") {
			assertPrivateApiEnabled();
			const resolvedChatGuid = await resolveChatGuid();
			const address = readStringParam(params, "address") ?? readStringParam(params, "participant");
			if (!address) throw new Error("BlueBubbles removeParticipant requires address or participant parameter.");
			await runtime.removeBlueBubblesParticipant(resolvedChatGuid, address, opts);
			return jsonResult({
				ok: true,
				removed: address,
				chatGuid: resolvedChatGuid
			});
		}
		if (action === "leaveGroup") {
			assertPrivateApiEnabled();
			const resolvedChatGuid = await resolveChatGuid();
			await runtime.leaveBlueBubblesChat(resolvedChatGuid, opts);
			return jsonResult({
				ok: true,
				left: resolvedChatGuid
			});
		}
		if (action === "sendAttachment") {
			const to = readStringParam(params, "to", { required: true });
			const filename = readStringParam(params, "filename", { required: true });
			const caption = readStringParam(params, "caption");
			const contentType = readStringParam(params, "contentType") ?? readStringParam(params, "mimeType");
			const asVoice = readBooleanParam(params, "asVoice");
			const base64Buffer = readStringParam(params, "buffer");
			const filePath = readStringParam(params, "path") ?? readStringParam(params, "filePath");
			let buffer;
			if (base64Buffer) buffer = Uint8Array.from(atob(base64Buffer), (c) => c.charCodeAt(0));
			else if (filePath) throw new Error("BlueBubbles sendAttachment: filePath not supported in action, provide buffer as base64.");
			else throw new Error("BlueBubbles sendAttachment requires buffer (base64) parameter.");
			return jsonResult({
				ok: true,
				messageId: (await runtime.sendBlueBubblesAttachment({
					to,
					buffer,
					filename,
					contentType: contentType ?? void 0,
					caption: caption ?? void 0,
					asVoice: asVoice ?? void 0,
					opts
				})).messageId
			});
		}
		throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
	}
};
//#endregion
//#region extensions/bluebubbles/src/config-schema.ts
const bluebubblesActionSchema = z.object({
	reactions: z.boolean().default(true),
	edit: z.boolean().default(true),
	unsend: z.boolean().default(true),
	reply: z.boolean().default(true),
	sendWithEffect: z.boolean().default(true),
	renameGroup: z.boolean().default(true),
	setGroupIcon: z.boolean().default(true),
	addParticipant: z.boolean().default(true),
	removeParticipant: z.boolean().default(true),
	leaveGroup: z.boolean().default(true),
	sendAttachment: z.boolean().default(true)
}).optional();
const bluebubblesGroupConfigSchema = z.object({
	requireMention: z.boolean().optional(),
	tools: ToolPolicySchema
});
const BlueBubblesConfigSchema = buildCatchallMultiAccountChannelSchema(z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	markdown: MarkdownConfigSchema,
	serverUrl: z.string().optional(),
	password: buildSecretInputSchema().optional(),
	webhookPath: z.string().optional(),
	dmPolicy: DmPolicySchema.optional(),
	allowFrom: AllowFromListSchema,
	groupAllowFrom: AllowFromListSchema,
	groupPolicy: GroupPolicySchema.optional(),
	historyLimit: z.number().int().min(0).optional(),
	dmHistoryLimit: z.number().int().min(0).optional(),
	textChunkLimit: z.number().int().positive().optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	mediaMaxMb: z.number().int().positive().optional(),
	mediaLocalRoots: z.array(z.string()).optional(),
	sendReadReceipts: z.boolean().optional(),
	allowPrivateNetwork: z.boolean().optional(),
	blockStreaming: z.boolean().optional(),
	groups: z.object({}).catchall(bluebubblesGroupConfigSchema).optional()
}).superRefine((value, ctx) => {
	const serverUrl = value.serverUrl?.trim() ?? "";
	const passwordConfigured = hasConfiguredSecretInput(value.password);
	if (serverUrl && !passwordConfigured) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: ["password"],
		message: "password is required when serverUrl is configured"
	});
})).extend({ actions: bluebubblesActionSchema });
//#endregion
//#region extensions/bluebubbles/src/session-route.ts
function resolveBlueBubblesOutboundSessionRoute(params) {
	const stripped = stripChannelTargetPrefix(params.target, "bluebubbles");
	if (!stripped) return null;
	const parsed = parseBlueBubblesTarget(stripped);
	const isGroup = parsed.kind === "chat_id" || parsed.kind === "chat_guid" || parsed.kind === "chat_identifier";
	const peerId = parsed.kind === "chat_id" ? String(parsed.chatId) : parsed.kind === "chat_guid" ? parsed.chatGuid : parsed.kind === "chat_identifier" ? parsed.chatIdentifier : parsed.to;
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "bluebubbles",
		accountId: params.accountId,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: peerId
		},
		chatType: isGroup ? "group" : "direct",
		from: isGroup ? `group:${peerId}` : `bluebubbles:${peerId}`,
		to: `bluebubbles:${stripped}`
	});
}
//#endregion
//#region extensions/bluebubbles/src/config-apply.ts
function normalizePatch(patch, onlyDefinedFields) {
	if (!onlyDefinedFields) return patch;
	const next = {};
	if (patch.serverUrl !== void 0) next.serverUrl = patch.serverUrl;
	if (patch.password !== void 0) next.password = patch.password;
	if (patch.webhookPath !== void 0) next.webhookPath = patch.webhookPath;
	return next;
}
function applyBlueBubblesConnectionConfig(params) {
	const patch = normalizePatch(params.patch, params.onlyDefinedFields === true);
	if (params.accountId === "default") return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			bluebubbles: {
				...params.cfg.channels?.bluebubbles,
				enabled: true,
				...patch
			}
		}
	};
	const currentAccount = params.cfg.channels?.bluebubbles?.accounts?.[params.accountId];
	const enabled = params.accountEnabled === "preserve-or-true" ? currentAccount?.enabled ?? true : params.accountEnabled ?? true;
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			bluebubbles: {
				...params.cfg.channels?.bluebubbles,
				enabled: true,
				accounts: {
					...params.cfg.channels?.bluebubbles?.accounts,
					[params.accountId]: {
						...currentAccount,
						enabled,
						...patch
					}
				}
			}
		}
	};
}
//#endregion
//#region extensions/bluebubbles/src/setup-core.ts
const channel$1 = "bluebubbles";
const setBlueBubblesTopLevelDmPolicy = createTopLevelChannelDmPolicySetter({ channel: channel$1 });
function setBlueBubblesDmPolicy(cfg, dmPolicy) {
	return setBlueBubblesTopLevelDmPolicy(cfg, dmPolicy);
}
function setBlueBubblesAllowFrom(cfg, accountId, allowFrom) {
	return patchScopedAccountConfig({
		cfg,
		channelKey: channel$1,
		accountId,
		patch: { allowFrom },
		ensureChannelEnabled: false,
		ensureAccountEnabled: false
	});
}
const blueBubblesSetupAdapter = {
	resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
	applyAccountName: ({ cfg, accountId, name }) => prepareScopedSetupConfig({
		cfg,
		channelKey: channel$1,
		accountId,
		name
	}),
	validateInput: ({ input }) => {
		if (!input.httpUrl && !input.password) return "BlueBubbles requires --http-url and --password.";
		if (!input.httpUrl) return "BlueBubbles requires --http-url.";
		if (!input.password) return "BlueBubbles requires --password.";
		return null;
	},
	applyAccountConfig: ({ cfg, accountId, input }) => {
		return applyBlueBubblesConnectionConfig({
			cfg: prepareScopedSetupConfig({
				cfg,
				channelKey: channel$1,
				accountId,
				name: input.name,
				migrateBaseName: true
			}),
			accountId,
			patch: {
				serverUrl: input.httpUrl,
				password: input.password,
				webhookPath: input.webhookPath
			},
			onlyDefinedFields: true
		});
	}
};
//#endregion
//#region extensions/bluebubbles/src/setup-surface.ts
const channel = "bluebubbles";
const CONFIGURE_CUSTOM_WEBHOOK_FLAG = "__bluebubblesConfigureCustomWebhookPath";
function parseBlueBubblesAllowFromInput(raw) {
	return raw.split(/[\n,]+/g).map((entry) => entry.trim()).filter(Boolean);
}
function validateBlueBubblesAllowFromEntry(value) {
	try {
		if (value === "*") return value;
		const parsed = parseBlueBubblesAllowTarget(value);
		if (parsed.kind === "handle" && !parsed.handle) return null;
		return value.trim() || null;
	} catch {
		return null;
	}
}
async function promptBlueBubblesAllowFrom(params) {
	return await promptParsedAllowFromForAccount({
		cfg: params.cfg,
		accountId: params.accountId,
		defaultAccountId: resolveDefaultBlueBubblesAccountId(params.cfg),
		prompter: params.prompter,
		noteTitle: "BlueBubbles allowlist",
		noteLines: [
			"Allowlist BlueBubbles DMs by handle or chat target.",
			"Examples:",
			"- +15555550123",
			"- user@example.com",
			"- chat_id:123",
			"- chat_guid:iMessage;-;+15555550123",
			"Multiple entries: comma- or newline-separated.",
			`Docs: ${formatDocsLink("/channels/bluebubbles", "bluebubbles")}`
		],
		message: "BlueBubbles allowFrom (handle or chat_id)",
		placeholder: "+15555550123, user@example.com, chat_id:123",
		parseEntries: (raw) => {
			const entries = parseBlueBubblesAllowFromInput(raw);
			for (const entry of entries) if (!validateBlueBubblesAllowFromEntry(entry)) return {
				entries: [],
				error: `Invalid entry: ${entry}`
			};
			return { entries };
		},
		getExistingAllowFrom: ({ cfg, accountId }) => resolveBlueBubblesAccount({
			cfg,
			accountId
		}).config.allowFrom ?? [],
		applyAllowFrom: ({ cfg, accountId, allowFrom }) => setBlueBubblesAllowFrom(cfg, accountId, allowFrom)
	});
}
function validateBlueBubblesServerUrlInput(value) {
	const trimmed = String(value ?? "").trim();
	if (!trimmed) return "Required";
	try {
		const normalized = normalizeBlueBubblesServerUrl(trimmed);
		new URL(normalized);
		return;
	} catch {
		return "Invalid URL format";
	}
}
function applyBlueBubblesSetupPatch(cfg, accountId, patch) {
	return applyBlueBubblesConnectionConfig({
		cfg,
		accountId,
		patch,
		onlyDefinedFields: true,
		accountEnabled: "preserve-or-true"
	});
}
function resolveBlueBubblesServerUrl(cfg, accountId) {
	return resolveBlueBubblesAccount({
		cfg,
		accountId
	}).config.serverUrl?.trim() || void 0;
}
function resolveBlueBubblesWebhookPath(cfg, accountId) {
	return resolveBlueBubblesAccount({
		cfg,
		accountId
	}).config.webhookPath?.trim() || void 0;
}
function validateBlueBubblesWebhookPath(value) {
	const trimmed = String(value ?? "").trim();
	if (!trimmed) return "Required";
	if (!trimmed.startsWith("/")) return "Path must start with /";
}
const dmPolicy = {
	label: "BlueBubbles",
	channel,
	policyKey: "channels.bluebubbles.dmPolicy",
	allowFromKey: "channels.bluebubbles.allowFrom",
	getCurrent: (cfg) => cfg.channels?.bluebubbles?.dmPolicy ?? "pairing",
	setPolicy: (cfg, policy) => setBlueBubblesDmPolicy(cfg, policy),
	promptAllowFrom: promptBlueBubblesAllowFrom
};
const blueBubblesSetupWizard = {
	channel,
	stepOrder: "text-first",
	status: {
		configuredLabel: "configured",
		unconfiguredLabel: "needs setup",
		configuredHint: "configured",
		unconfiguredHint: "iMessage via BlueBubbles app",
		configuredScore: 1,
		unconfiguredScore: 0,
		resolveConfigured: ({ cfg }) => listBlueBubblesAccountIds(cfg).some((accountId) => {
			return resolveBlueBubblesAccount({
				cfg,
				accountId
			}).configured;
		}),
		resolveStatusLines: ({ configured }) => [`BlueBubbles: ${configured ? "configured" : "needs setup"}`],
		resolveSelectionHint: ({ configured }) => configured ? "configured" : "iMessage via BlueBubbles app"
	},
	prepare: async ({ cfg, accountId, prompter, credentialValues }) => {
		const existingWebhookPath = resolveBlueBubblesWebhookPath(cfg, accountId);
		const wantsCustomWebhook = await prompter.confirm({
			message: `Configure a custom webhook path? (default: ${DEFAULT_WEBHOOK_PATH})`,
			initialValue: Boolean(existingWebhookPath && existingWebhookPath !== "/bluebubbles-webhook")
		});
		return {
			cfg: wantsCustomWebhook ? cfg : applyBlueBubblesSetupPatch(cfg, accountId, { webhookPath: DEFAULT_WEBHOOK_PATH }),
			credentialValues: {
				...credentialValues,
				[CONFIGURE_CUSTOM_WEBHOOK_FLAG]: wantsCustomWebhook ? "1" : "0"
			}
		};
	},
	credentials: [{
		inputKey: "password",
		providerHint: channel,
		credentialLabel: "server password",
		helpTitle: "BlueBubbles password",
		helpLines: ["Enter the BlueBubbles server password.", "Find this in the BlueBubbles Server app under Settings."],
		envPrompt: "",
		keepPrompt: "BlueBubbles password already set. Keep it?",
		inputPrompt: "BlueBubbles password",
		inspect: ({ cfg, accountId }) => {
			const existingPassword = resolveBlueBubblesAccount({
				cfg,
				accountId
			}).config.password;
			return {
				accountConfigured: resolveBlueBubblesAccount({
					cfg,
					accountId
				}).configured,
				hasConfiguredValue: hasConfiguredSecretInput(existingPassword),
				resolvedValue: normalizeSecretInputString(existingPassword) ?? void 0
			};
		},
		applySet: async ({ cfg, accountId, value }) => applyBlueBubblesSetupPatch(cfg, accountId, { password: value })
	}],
	textInputs: [{
		inputKey: "httpUrl",
		message: "BlueBubbles server URL",
		placeholder: "http://192.168.1.100:1234",
		helpTitle: "BlueBubbles server URL",
		helpLines: [
			"Enter the BlueBubbles server URL (e.g., http://192.168.1.100:1234).",
			"Find this in the BlueBubbles Server app under Connection.",
			`Docs: ${formatDocsLink("/channels/bluebubbles", "bluebubbles")}`
		],
		currentValue: ({ cfg, accountId }) => resolveBlueBubblesServerUrl(cfg, accountId),
		validate: ({ value }) => validateBlueBubblesServerUrlInput(value),
		normalizeValue: ({ value }) => String(value).trim(),
		applySet: async ({ cfg, accountId, value }) => applyBlueBubblesSetupPatch(cfg, accountId, { serverUrl: value })
	}, {
		inputKey: "webhookPath",
		message: "Webhook path",
		placeholder: DEFAULT_WEBHOOK_PATH,
		currentValue: ({ cfg, accountId }) => {
			const value = resolveBlueBubblesWebhookPath(cfg, accountId);
			return value && value !== "/bluebubbles-webhook" ? value : void 0;
		},
		shouldPrompt: ({ credentialValues }) => credentialValues[CONFIGURE_CUSTOM_WEBHOOK_FLAG] === "1",
		validate: ({ value }) => validateBlueBubblesWebhookPath(value),
		normalizeValue: ({ value }) => String(value).trim(),
		applySet: async ({ cfg, accountId, value }) => applyBlueBubblesSetupPatch(cfg, accountId, { webhookPath: value })
	}],
	completionNote: {
		title: "BlueBubbles next steps",
		lines: [
			"Configure the webhook URL in BlueBubbles Server:",
			"1. Open BlueBubbles Server -> Settings -> Webhooks",
			"2. Add your WormAgent gateway URL + webhook path",
			`   Example: https://your-gateway-host:3000${DEFAULT_WEBHOOK_PATH}`,
			"3. Enable the webhook and save",
			"",
			`Docs: ${formatDocsLink("/channels/bluebubbles", "bluebubbles")}`
		]
	},
	dmPolicy,
	allowFrom: createAllowFromSection({
		helpTitle: "BlueBubbles allowlist",
		helpLines: [
			"Allowlist BlueBubbles DMs by handle or chat target.",
			"Examples:",
			"- +15555550123",
			"- user@example.com",
			"- chat_id:123",
			"- chat_guid:iMessage;-;+15555550123",
			"Multiple entries: comma- or newline-separated.",
			`Docs: ${formatDocsLink("/channels/bluebubbles", "bluebubbles")}`
		],
		message: "BlueBubbles allowFrom (handle or chat_id)",
		placeholder: "+15555550123, user@example.com, chat_id:123",
		invalidWithoutCredentialNote: "Use a BlueBubbles handle or chat target like +15555550123 or chat_id:123.",
		parseInputs: parseBlueBubblesAllowFromInput,
		parseId: (raw) => validateBlueBubblesAllowFromEntry(raw),
		apply: async ({ cfg, accountId, allowFrom }) => setBlueBubblesAllowFrom(cfg, accountId, allowFrom)
	}),
	disable: (cfg) => ({
		...cfg,
		channels: {
			...cfg.channels,
			bluebubbles: {
				...cfg.channels?.bluebubbles,
				enabled: false
			}
		}
	})
};
//#endregion
//#region extensions/bluebubbles/src/channel.ts
const loadBlueBubblesChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-ulRYCQ_T.js"), "blueBubblesChannelRuntime");
const bluebubblesConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "bluebubbles",
	listAccountIds: listBlueBubblesAccountIds,
	resolveAccount: (cfg, accountId) => resolveBlueBubblesAccount({
		cfg,
		accountId
	}),
	defaultAccountId: resolveDefaultBlueBubblesAccountId,
	clearBaseFields: [
		"serverUrl",
		"password",
		"name",
		"webhookPath"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatNormalizedAllowFromEntries({
		allowFrom,
		normalizeEntry: (entry) => normalizeBlueBubblesHandle(entry.replace(/^bluebubbles:/i, ""))
	})
});
const resolveBlueBubblesDmPolicy = createScopedDmSecurityResolver({
	channelKey: "bluebubbles",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => normalizeBlueBubblesHandle(raw.replace(/^bluebubbles:/i, ""))
});
const collectBlueBubblesSecurityWarnings = createOpenGroupPolicyRestrictSendersWarningCollector({
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	defaultGroupPolicy: "allowlist",
	surface: "BlueBubbles groups",
	openScope: "any member",
	groupPolicyPath: "channels.bluebubbles.groupPolicy",
	groupAllowFromPath: "channels.bluebubbles.groupAllowFrom",
	mentionGated: false
});
const bluebubblesPlugin = {
	id: "bluebubbles",
	meta: {
		id: "bluebubbles",
		label: "BlueBubbles",
		selectionLabel: "BlueBubbles (macOS app)",
		detailLabel: "BlueBubbles",
		docsPath: "/channels/bluebubbles",
		docsLabel: "bluebubbles",
		blurb: "iMessage via the BlueBubbles mac app + REST API.",
		systemImage: "bubble.left.and.text.bubble.right",
		aliases: ["bb"],
		order: 75,
		preferOver: ["imessage"]
	},
	capabilities: {
		chatTypes: ["direct", "group"],
		media: true,
		reactions: true,
		edit: true,
		unsend: true,
		reply: true,
		effects: true,
		groupManagement: true
	},
	groups: {
		resolveRequireMention: resolveBlueBubblesGroupRequireMention,
		resolveToolPolicy: resolveBlueBubblesGroupToolPolicy
	},
	threading: { buildToolContext: ({ context, hasRepliedRef }) => ({
		currentChannelId: context.To?.trim() || void 0,
		currentThreadTs: context.ReplyToIdFull ?? context.ReplyToId,
		hasRepliedRef
	}) },
	reload: { configPrefixes: ["channels.bluebubbles"] },
	configSchema: buildChannelConfigSchema(BlueBubblesConfigSchema),
	setupWizard: blueBubblesSetupWizard,
	config: {
		...bluebubblesConfigAdapter,
		isConfigured: (account) => account.configured,
		describeAccount: (account) => ({
			accountId: account.accountId,
			name: account.name,
			enabled: account.enabled,
			configured: account.configured,
			baseUrl: account.baseUrl
		})
	},
	actions: bluebubblesMessageActions,
	security: {
		resolveDmPolicy: resolveBlueBubblesDmPolicy,
		collectWarnings: projectWarningCollector(({ account }) => account, collectBlueBubblesSecurityWarnings)
	},
	messaging: {
		normalizeTarget: normalizeBlueBubblesMessagingTarget,
		inferTargetChatType: ({ to }) => inferBlueBubblesTargetChatType(to),
		resolveOutboundSessionRoute: (params) => resolveBlueBubblesOutboundSessionRoute(params),
		targetResolver: {
			looksLikeId: looksLikeBlueBubblesExplicitTargetId,
			hint: "<handle|chat_guid:GUID|chat_id:ID|chat_identifier:ID>",
			resolveTarget: async ({ normalized }) => {
				const to = normalized?.trim();
				if (!to) return null;
				const chatType = inferBlueBubblesTargetChatType(to);
				if (!chatType) return null;
				return {
					to,
					kind: chatType === "direct" ? "user" : "group",
					source: "normalized"
				};
			}
		},
		formatTargetDisplay: ({ target, display }) => {
			const shouldParseDisplay = (value) => {
				if (looksLikeBlueBubblesTargetId(value)) return true;
				return /^(bluebubbles:|chat_guid:|chat_id:|chat_identifier:)/i.test(value);
			};
			const extractCleanDisplay = (value) => {
				const trimmed = value?.trim();
				if (!trimmed) return null;
				try {
					const parsed = parseBlueBubblesTarget(trimmed);
					if (parsed.kind === "chat_guid") {
						const handle = extractHandleFromChatGuid(parsed.chatGuid);
						if (handle) return handle;
					}
					if (parsed.kind === "handle") return normalizeBlueBubblesHandle(parsed.to);
				} catch {}
				const stripped = trimmed.replace(/^bluebubbles:/i, "").replace(/^chat_guid:/i, "").replace(/^chat_id:/i, "").replace(/^chat_identifier:/i, "");
				const handle = extractHandleFromChatGuid(stripped);
				if (handle) return handle;
				if (stripped.includes(";-;") || stripped.includes(";+;")) return null;
				return stripped;
			};
			const trimmedDisplay = display?.trim();
			if (trimmedDisplay) {
				if (!shouldParseDisplay(trimmedDisplay)) return trimmedDisplay;
				const cleanDisplay = extractCleanDisplay(trimmedDisplay);
				if (cleanDisplay) return cleanDisplay;
			}
			const cleanTarget = extractCleanDisplay(target);
			if (cleanTarget) return cleanTarget;
			return display?.trim() || target?.trim() || "";
		}
	},
	setup: blueBubblesSetupAdapter,
	pairing: createTextPairingAdapter({
		idLabel: "bluebubblesSenderId",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: createPairingPrefixStripper(/^bluebubbles:/i, normalizeBlueBubblesHandle),
		notify: async ({ cfg, id, message }) => {
			await (await loadBlueBubblesChannelRuntime()).sendMessageBlueBubbles(id, message, { cfg });
		}
	}),
	outbound: {
		deliveryMode: "direct",
		textChunkLimit: 4e3,
		resolveTarget: ({ to }) => {
			const trimmed = to?.trim();
			if (!trimmed) return {
				ok: false,
				error: /* @__PURE__ */ new Error("Delivering to BlueBubbles requires --to <handle|chat_guid:GUID>")
			};
			return {
				ok: true,
				to: trimmed
			};
		},
		...createAttachedChannelResultAdapter({
			channel: "bluebubbles",
			sendText: async ({ cfg, to, text, accountId, replyToId }) => {
				const runtime = await loadBlueBubblesChannelRuntime();
				const rawReplyToId = typeof replyToId === "string" ? replyToId.trim() : "";
				const replyToMessageGuid = rawReplyToId ? runtime.resolveBlueBubblesMessageId(rawReplyToId, { requireKnownShortId: true }) : "";
				return await runtime.sendMessageBlueBubbles(to, text, {
					cfg,
					accountId: accountId ?? void 0,
					replyToMessageGuid: replyToMessageGuid || void 0
				});
			},
			sendMedia: async (ctx) => {
				const runtime = await loadBlueBubblesChannelRuntime();
				const { cfg, to, text, mediaUrl, accountId, replyToId } = ctx;
				const { mediaPath, mediaBuffer, contentType, filename, caption } = ctx;
				return await runtime.sendBlueBubblesMedia({
					cfg,
					to,
					mediaUrl,
					mediaPath,
					mediaBuffer,
					contentType,
					filename,
					caption: caption ?? text ?? void 0,
					replyToId: replyToId ?? null,
					accountId: accountId ?? void 0
				});
			}
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
		collectStatusIssues: collectBlueBubblesStatusIssues,
		buildChannelSummary: ({ snapshot }) => buildProbeChannelStatusSummary(snapshot, { baseUrl: snapshot.baseUrl ?? null }),
		probeAccount: async ({ account, timeoutMs }) => (await loadBlueBubblesChannelRuntime()).probeBlueBubbles({
			baseUrl: account.baseUrl,
			password: account.config.password ?? null,
			timeoutMs
		}),
		buildAccountSnapshot: ({ account, runtime, probe }) => {
			const running = runtime?.running ?? false;
			const probeOk = probe?.ok;
			return {
				...buildComputedAccountStatusSnapshot({
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured: account.configured,
					runtime,
					probe
				}),
				baseUrl: account.baseUrl,
				connected: probeOk ?? running
			};
		}
	},
	gateway: { startAccount: async (ctx) => {
		const runtime = await loadBlueBubblesChannelRuntime();
		const account = ctx.account;
		const webhookPath = runtime.resolveWebhookPathFromConfig(account.config);
		const statusSink = createAccountStatusSink({
			accountId: ctx.accountId,
			setStatus: ctx.setStatus
		});
		statusSink({ baseUrl: account.baseUrl });
		ctx.log?.info(`[${account.accountId}] starting provider (webhook=${webhookPath})`);
		return runtime.monitorBlueBubblesProvider({
			account,
			config: ctx.cfg,
			runtime: ctx.runtime,
			abortSignal: ctx.abortSignal,
			statusSink,
			webhookPath
		});
	} }
};
//#endregion
export { bluebubblesPlugin as t };
