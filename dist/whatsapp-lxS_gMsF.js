import { d as isRecord } from "./utils-1TVTmhOV.js";
import { L_ as resolveWhatsAppGroupRequireMention, M_ as resolveWhatsAppGroupIntroHint, N_ as resolveWhatsAppMentionStripRegexes, P_ as resolveWhatsAppOutboundTarget, R_ as resolveWhatsAppGroupToolPolicy, Sn as resolveWhatsAppAccount, _n as listWhatsAppDirectoryPeersFromConfig, gn as listWhatsAppDirectoryGroupsFromConfig, hn as resolveWhatsAppHeartbeatRecipients, j_ as createWhatsAppOutboundBase } from "./auth-profiles-DHKWTcix.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-B0Ci-_gE.js";
import { t as formatCliCommand } from "./command-format-RWUdRF1N.js";
import { S as isWhatsAppGroupJid, _ as looksLikeWhatsAppTargetId, u as formatWhatsAppConfigAllowFromEntries, w as normalizeWhatsAppTarget, y as normalizeWhatsAppMessagingTarget } from "./channel-config-helpers-Cw--QYL9.js";
import { i as createActionGate, p as readStringParam } from "./common-CFQzxgdg.js";
import { r as defineChannelPluginEntry, t as buildChannelOutboundSessionRoute } from "./core-flS61KKf.js";
import { t as createPluginRuntimeStore } from "./runtime-store-B4NdUZHn.js";
import { n as asString, r as collectIssuesForEnabledAccounts } from "./shared-ChdN1p0c.js";
import { n as buildDmGroupAccountAllowlistAdapter } from "./allowlist-config-edit-BXJ_PmsX.js";
import { t as whatsappSetupAdapter } from "./setup-core-CWYv1S7U.js";
import { i as whatsappSetupWizardProxy, n as createWhatsAppPluginBase, r as loadWhatsAppChannelRuntime, t as WHATSAPP_CHANNEL } from "./shared-BB4b3PZD.js";
//#region extensions/whatsapp/src/runtime.ts
const { setRuntime: setWhatsAppRuntime, getRuntime: getWhatsAppRuntime } = createPluginRuntimeStore("WhatsApp runtime not initialized");
//#endregion
//#region extensions/whatsapp/src/session-route.ts
function resolveWhatsAppOutboundSessionRoute(params) {
	const normalized = normalizeWhatsAppTarget(params.target);
	if (!normalized) return null;
	const isGroup = isWhatsAppGroupJid(normalized);
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "whatsapp",
		accountId: params.accountId,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: normalized
		},
		chatType: isGroup ? "group" : "direct",
		from: normalized,
		to: normalized
	});
}
//#endregion
//#region extensions/whatsapp/src/status-issues.ts
function readWhatsAppAccountStatus(value) {
	if (!isRecord(value)) return null;
	return {
		accountId: value.accountId,
		enabled: value.enabled,
		linked: value.linked,
		connected: value.connected,
		running: value.running,
		reconnectAttempts: value.reconnectAttempts,
		lastError: value.lastError
	};
}
function collectWhatsAppStatusIssues(accounts) {
	return collectIssuesForEnabledAccounts({
		accounts,
		readAccount: readWhatsAppAccountStatus,
		collectIssues: ({ account, accountId, issues }) => {
			const linked = account.linked === true;
			const running = account.running === true;
			const connected = account.connected === true;
			const reconnectAttempts = typeof account.reconnectAttempts === "number" ? account.reconnectAttempts : null;
			const lastError = asString(account.lastError);
			if (!linked) {
				issues.push({
					channel: "whatsapp",
					accountId,
					kind: "auth",
					message: "Not linked (no WhatsApp Web session).",
					fix: `Run: ${formatCliCommand("wormagent channels login")} (scan QR on the gateway host).`
				});
				return;
			}
			if (running && !connected) issues.push({
				channel: "whatsapp",
				accountId,
				kind: "runtime",
				message: `Linked but disconnected${reconnectAttempts != null ? ` (reconnectAttempts=${reconnectAttempts})` : ""}${lastError ? `: ${lastError}` : "."}`,
				fix: `Run: ${formatCliCommand("wormagent doctor")} (or restart the gateway). If it persists, relink via channels login and check logs.`
			});
		}
	});
}
//#endregion
//#region extensions/whatsapp/src/channel.ts
function normalizeWhatsAppPayloadText(text) {
	return (text ?? "").replace(/^(?:[ \t]*\r?\n)+/, "");
}
function parseWhatsAppExplicitTarget(raw) {
	const normalized = normalizeWhatsAppTarget(raw);
	if (!normalized) return null;
	return {
		to: normalized,
		chatType: isWhatsAppGroupJid(normalized) ? "group" : "direct"
	};
}
const whatsappPlugin = {
	...createWhatsAppPluginBase({
		groups: {
			resolveRequireMention: resolveWhatsAppGroupRequireMention,
			resolveToolPolicy: resolveWhatsAppGroupToolPolicy,
			resolveGroupIntroHint: resolveWhatsAppGroupIntroHint
		},
		setupWizard: whatsappSetupWizardProxy,
		setup: whatsappSetupAdapter,
		isConfigured: async (account) => await getWhatsAppRuntime().channel.whatsapp.webAuthExists(account.authDir)
	}),
	agentTools: () => [getWhatsAppRuntime().channel.whatsapp.createLoginTool()],
	pairing: { idLabel: "whatsappSenderId" },
	allowlist: buildDmGroupAccountAllowlistAdapter({
		channelId: "whatsapp",
		resolveAccount: ({ cfg, accountId }) => resolveWhatsAppAccount({
			cfg,
			accountId
		}),
		normalize: ({ values }) => formatWhatsAppConfigAllowFromEntries(values),
		resolveDmAllowFrom: (account) => account.allowFrom,
		resolveGroupAllowFrom: (account) => account.groupAllowFrom,
		resolveDmPolicy: (account) => account.dmPolicy,
		resolveGroupPolicy: (account) => account.groupPolicy
	}),
	mentions: { stripRegexes: ({ ctx }) => resolveWhatsAppMentionStripRegexes(ctx) },
	commands: {
		enforceOwnerForCommands: true,
		skipWhenConfigEmpty: true
	},
	messaging: {
		normalizeTarget: normalizeWhatsAppMessagingTarget,
		resolveOutboundSessionRoute: (params) => resolveWhatsAppOutboundSessionRoute(params),
		parseExplicitTarget: ({ raw }) => parseWhatsAppExplicitTarget(raw),
		inferTargetChatType: ({ to }) => parseWhatsAppExplicitTarget(to)?.chatType,
		targetResolver: {
			looksLikeId: looksLikeWhatsAppTargetId,
			hint: "<E.164|group JID>"
		}
	},
	directory: {
		self: async ({ cfg, accountId }) => {
			const account = resolveWhatsAppAccount({
				cfg,
				accountId
			});
			const { e164, jid } = (await loadWhatsAppChannelRuntime()).readWebSelfId(account.authDir);
			const id = e164 ?? jid;
			if (!id) return null;
			return {
				kind: "user",
				id,
				name: account.name,
				raw: {
					e164,
					jid
				}
			};
		},
		listPeers: async (params) => listWhatsAppDirectoryPeersFromConfig(params),
		listGroups: async (params) => listWhatsAppDirectoryGroupsFromConfig(params)
	},
	actions: {
		describeMessageTool: ({ cfg }) => {
			if (!cfg.channels?.whatsapp) return null;
			const gate = createActionGate(cfg.channels.whatsapp.actions);
			const actions = /* @__PURE__ */ new Set();
			if (gate("reactions")) actions.add("react");
			if (gate("polls")) actions.add("poll");
			return { actions: Array.from(actions) };
		},
		supportsAction: ({ action }) => action === "react",
		handleAction: async ({ action, params, cfg, accountId }) => {
			if (action !== "react") throw new Error(`Action ${action} is not supported for provider ${WHATSAPP_CHANNEL}.`);
			const messageId = readStringParam(params, "messageId", { required: true });
			const emoji = readStringParam(params, "emoji", { allowEmpty: true });
			const remove = typeof params.remove === "boolean" ? params.remove : void 0;
			return await getWhatsAppRuntime().channel.whatsapp.handleWhatsAppAction({
				action: "react",
				chatJid: readStringParam(params, "chatJid") ?? readStringParam(params, "to", { required: true }),
				messageId,
				emoji,
				remove,
				participant: readStringParam(params, "participant"),
				accountId: accountId ?? void 0,
				fromMe: typeof params.fromMe === "boolean" ? params.fromMe : void 0
			}, cfg);
		}
	},
	outbound: {
		...createWhatsAppOutboundBase({
			chunker: (text, limit) => getWhatsAppRuntime().channel.text.chunkText(text, limit),
			sendMessageWhatsApp: async (...args) => await getWhatsAppRuntime().channel.whatsapp.sendMessageWhatsApp(...args),
			sendPollWhatsApp: async (...args) => await getWhatsAppRuntime().channel.whatsapp.sendPollWhatsApp(...args),
			shouldLogVerbose: () => getWhatsAppRuntime().logging.shouldLogVerbose(),
			resolveTarget: ({ to, allowFrom, mode }) => resolveWhatsAppOutboundTarget({
				to,
				allowFrom,
				mode
			})
		}),
		normalizePayload: ({ payload }) => ({
			...payload,
			text: normalizeWhatsAppPayloadText(payload.text)
		})
	},
	auth: { login: async ({ cfg, accountId, runtime, verbose }) => {
		const resolvedAccountId = accountId?.trim() || whatsappPlugin.config.defaultAccountId?.(cfg) || "default";
		await (await loadWhatsAppChannelRuntime()).loginWeb(Boolean(verbose), void 0, runtime, resolvedAccountId);
	} },
	heartbeat: {
		checkReady: async ({ cfg, accountId, deps }) => {
			if (cfg.web?.enabled === false) return {
				ok: false,
				reason: "whatsapp-disabled"
			};
			const account = resolveWhatsAppAccount({
				cfg,
				accountId
			});
			if (!await (deps?.webAuthExists ?? (await loadWhatsAppChannelRuntime()).webAuthExists)(account.authDir)) return {
				ok: false,
				reason: "whatsapp-not-linked"
			};
			if (!(deps?.hasActiveWebListener ? deps.hasActiveWebListener() : Boolean((await loadWhatsAppChannelRuntime()).getActiveWebListener()))) return {
				ok: false,
				reason: "whatsapp-not-running"
			};
			return {
				ok: true,
				reason: "ok"
			};
		},
		resolveRecipients: ({ cfg, opts }) => resolveWhatsAppHeartbeatRecipients(cfg, opts)
	},
	status: {
		defaultRuntime: {
			accountId: DEFAULT_ACCOUNT_ID,
			running: false,
			connected: false,
			reconnectAttempts: 0,
			lastConnectedAt: null,
			lastDisconnect: null,
			lastMessageAt: null,
			lastEventAt: null,
			lastError: null
		},
		collectStatusIssues: collectWhatsAppStatusIssues,
		buildChannelSummary: async ({ account, snapshot }) => {
			const authDir = account.authDir;
			const linked = typeof snapshot.linked === "boolean" ? snapshot.linked : authDir ? await (await loadWhatsAppChannelRuntime()).webAuthExists(authDir) : false;
			return {
				configured: linked,
				linked,
				authAgeMs: linked && authDir ? (await loadWhatsAppChannelRuntime()).getWebAuthAgeMs(authDir) : null,
				self: linked && authDir ? (await loadWhatsAppChannelRuntime()).readWebSelfId(authDir) : {
					e164: null,
					jid: null
				},
				running: snapshot.running ?? false,
				connected: snapshot.connected ?? false,
				lastConnectedAt: snapshot.lastConnectedAt ?? null,
				lastDisconnect: snapshot.lastDisconnect ?? null,
				reconnectAttempts: snapshot.reconnectAttempts,
				lastMessageAt: snapshot.lastMessageAt ?? null,
				lastEventAt: snapshot.lastEventAt ?? null,
				lastError: snapshot.lastError ?? null
			};
		},
		buildAccountSnapshot: async ({ account, runtime }) => {
			const linked = await (await loadWhatsAppChannelRuntime()).webAuthExists(account.authDir);
			return {
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: true,
				linked,
				running: runtime?.running ?? false,
				connected: runtime?.connected ?? false,
				reconnectAttempts: runtime?.reconnectAttempts,
				lastConnectedAt: runtime?.lastConnectedAt ?? null,
				lastDisconnect: runtime?.lastDisconnect ?? null,
				lastMessageAt: runtime?.lastMessageAt ?? null,
				lastEventAt: runtime?.lastEventAt ?? null,
				lastError: runtime?.lastError ?? null,
				dmPolicy: account.dmPolicy,
				allowFrom: account.allowFrom
			};
		},
		resolveAccountState: ({ configured }) => configured ? "linked" : "not linked",
		logSelfId: ({ account, runtime, includeChannelPrefix }) => {
			loadWhatsAppChannelRuntime().then((runtimeExports) => runtimeExports.logWebSelfId(account.authDir, runtime, includeChannelPrefix));
		}
	},
	gateway: {
		startAccount: async (ctx) => {
			const account = ctx.account;
			const { e164, jid } = (await loadWhatsAppChannelRuntime()).readWebSelfId(account.authDir);
			const identity = e164 ? e164 : jid ? `jid ${jid}` : "unknown";
			ctx.log?.info(`[${account.accountId}] starting provider (${identity})`);
			return (await loadWhatsAppChannelRuntime()).monitorWebChannel(getWhatsAppRuntime().logging.shouldLogVerbose(), void 0, true, void 0, ctx.runtime, ctx.abortSignal, {
				statusSink: (next) => ctx.setStatus({
					accountId: ctx.accountId,
					...next
				}),
				accountId: account.accountId
			});
		},
		loginWithQrStart: async ({ accountId, force, timeoutMs, verbose }) => await (await loadWhatsAppChannelRuntime()).startWebLoginWithQr({
			accountId,
			force,
			timeoutMs,
			verbose
		}),
		loginWithQrWait: async ({ accountId, timeoutMs }) => await (await loadWhatsAppChannelRuntime()).waitForWebLogin({
			accountId,
			timeoutMs
		}),
		logoutAccount: async ({ account, runtime }) => {
			const cleared = await (await loadWhatsAppChannelRuntime()).logoutWeb({
				authDir: account.authDir,
				isLegacyAuthDir: account.isLegacyAuthDir,
				runtime
			});
			return {
				cleared,
				loggedOut: cleared
			};
		}
	}
};
//#endregion
//#region extensions/whatsapp/index.ts
var whatsapp_default = defineChannelPluginEntry({
	id: "whatsapp",
	name: "WhatsApp",
	description: "WhatsApp channel plugin",
	plugin: whatsappPlugin,
	setRuntime: setWhatsAppRuntime
});
//#endregion
export { whatsappPlugin as n, setWhatsAppRuntime as r, whatsapp_default as t };
