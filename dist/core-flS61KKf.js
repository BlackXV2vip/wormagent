import { r as getChatChannelMeta } from "./registry-bBUk5Kld.js";
import { t as buildAgentSessionKey } from "./resolve-route-BZQmiwMs.js";
import { t as emptyPluginConfigSchema } from "./config-schema-DIwfYn-6.js";
import { Type } from "@sinclair/typebox";
//#region src/plugin-sdk/provider-auth-result.ts
/** Build the standard auth result payload for OAuth-style provider login flows. */
function buildOauthProviderAuthResult(params) {
	const email = params.email ?? void 0;
	return {
		profiles: [{
			profileId: `${params.profilePrefix ?? params.providerId}:${email ?? "default"}`,
			credential: {
				type: "oauth",
				provider: params.providerId,
				access: params.access,
				...params.refresh ? { refresh: params.refresh } : {},
				...Number.isFinite(params.expires) ? { expires: params.expires } : {},
				...email ? { email } : {},
				...params.credentialExtra
			}
		}],
		configPatch: params.configPatch ?? { agents: { defaults: { models: { [params.defaultModel]: {} } } } },
		defaultModel: params.defaultModel,
		notes: params.notes
	};
}
//#endregion
//#region src/infra/outbound/message-action-spec.ts
const MESSAGE_ACTION_TARGET_MODE = {
	send: "to",
	broadcast: "none",
	poll: "to",
	"poll-vote": "to",
	react: "to",
	reactions: "to",
	read: "to",
	edit: "to",
	unsend: "to",
	reply: "to",
	sendWithEffect: "to",
	renameGroup: "to",
	setGroupIcon: "to",
	addParticipant: "to",
	removeParticipant: "to",
	leaveGroup: "to",
	sendAttachment: "to",
	delete: "to",
	pin: "to",
	unpin: "to",
	"list-pins": "to",
	permissions: "to",
	"thread-create": "to",
	"thread-list": "none",
	"thread-reply": "to",
	search: "none",
	sticker: "to",
	"sticker-search": "none",
	"member-info": "none",
	"role-info": "none",
	"emoji-list": "none",
	"emoji-upload": "none",
	"sticker-upload": "none",
	"role-add": "none",
	"role-remove": "none",
	"channel-info": "channelId",
	"channel-list": "none",
	"channel-create": "none",
	"channel-edit": "channelId",
	"channel-delete": "channelId",
	"channel-move": "channelId",
	"category-create": "none",
	"category-edit": "none",
	"category-delete": "none",
	"topic-create": "to",
	"topic-edit": "to",
	"voice-status": "none",
	"event-list": "none",
	"event-create": "none",
	timeout: "none",
	kick: "none",
	ban: "none",
	"set-presence": "none",
	"download-file": "none"
};
const ACTION_TARGET_ALIASES = {
	read: {
		aliases: ["messageId"],
		channels: ["feishu"]
	},
	unsend: { aliases: ["messageId"] },
	edit: { aliases: ["messageId"] },
	pin: {
		aliases: ["messageId"],
		channels: ["feishu"]
	},
	unpin: {
		aliases: ["messageId"],
		channels: ["feishu"]
	},
	"list-pins": {
		aliases: ["chatId"],
		channels: ["feishu"]
	},
	"channel-info": {
		aliases: ["chatId"],
		channels: ["feishu"]
	},
	react: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	renameGroup: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	setGroupIcon: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	addParticipant: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	removeParticipant: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] },
	leaveGroup: { aliases: [
		"chatGuid",
		"chatIdentifier",
		"chatId"
	] }
};
function actionRequiresTarget(action) {
	return MESSAGE_ACTION_TARGET_MODE[action] !== "none";
}
function actionHasTarget(action, params, options) {
	if (typeof params.to === "string" ? params.to.trim() : "") return true;
	if (typeof params.channelId === "string" ? params.channelId.trim() : "") return true;
	const spec = ACTION_TARGET_ALIASES[action];
	if (!spec) return false;
	if (spec.channels && (!options?.channel || !spec.channels.includes(options.channel.trim().toLowerCase()))) return false;
	return spec.aliases.some((alias) => {
		const value = params[alias];
		if (typeof value === "string") return value.trim().length > 0;
		if (typeof value === "number") return Number.isFinite(value);
		return false;
	});
}
//#endregion
//#region src/infra/outbound/channel-target.ts
const CHANNEL_TARGET_DESCRIPTION = "Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack channel/user, or iMessage handle/chat_id";
const CHANNEL_TARGETS_DESCRIPTION = "Recipient/channel targets (same format as --target); accepts ids or names when the directory is available.";
function hasNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function applyTargetToParams(params) {
	const target = typeof params.args.target === "string" ? params.args.target.trim() : "";
	const hasLegacyTo = hasNonEmptyString(params.args.to);
	const hasLegacyChannelId = hasNonEmptyString(params.args.channelId);
	const mode = MESSAGE_ACTION_TARGET_MODE[params.action] ?? "none";
	if (mode !== "none") {
		if (hasLegacyTo || hasLegacyChannelId) throw new Error("Use `target` instead of `to`/`channelId`.");
	} else if (hasLegacyTo) throw new Error("Use `target` for actions that accept a destination.");
	if (!target) return;
	if (mode === "channelId") {
		params.args.channelId = target;
		return;
	}
	if (mode === "to") {
		params.args.to = target;
		return;
	}
	throw new Error(`Action ${params.action} does not accept a target.`);
}
//#endregion
//#region src/agents/schema/typebox.ts
function stringEnum(values, options = {}) {
	return Type.Unsafe({
		type: "string",
		enum: [...values],
		...options
	});
}
function optionalStringEnum(values, options = {}) {
	return Type.Optional(stringEnum(values, options));
}
function channelTargetSchema(options) {
	return Type.String({ description: options?.description ?? "Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack channel/user, or iMessage handle/chat_id" });
}
function channelTargetsSchema(options) {
	return Type.Array(channelTargetSchema({ description: options?.description ?? "Recipient/channel targets (same format as --target); accepts ids or names when the directory is available." }));
}
//#endregion
//#region src/infra/outbound/base-session-key.ts
function buildOutboundBaseSessionKey(params) {
	return buildAgentSessionKey({
		agentId: params.agentId,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer,
		dmScope: params.cfg.session?.dmScope ?? "main",
		identityLinks: params.cfg.session?.identityLinks
	});
}
//#endregion
//#region src/shared/gateway-bind-url.ts
function resolveGatewayBindUrl(params) {
	const bind = params.bind ?? "loopback";
	if (bind === "custom") {
		const host = params.customBindHost?.trim();
		if (host) return {
			url: `${params.scheme}://${host}:${params.port}`,
			source: "gateway.bind=custom"
		};
		return { error: "gateway.bind=custom requires gateway.customBindHost." };
	}
	if (bind === "tailnet") {
		const host = params.pickTailnetHost();
		if (host) return {
			url: `${params.scheme}://${host}:${params.port}`,
			source: "gateway.bind=tailnet"
		};
		return { error: "gateway.bind=tailnet set, but no tailnet IP was found." };
	}
	if (bind === "lan") {
		const host = params.pickLanHost();
		if (host) return {
			url: `${params.scheme}://${host}:${params.port}`,
			source: "gateway.bind=lan"
		};
		return { error: "gateway.bind=lan set, but no private LAN IP was found." };
	}
	return null;
}
//#endregion
//#region src/shared/tailscale-status.ts
const TAILSCALE_STATUS_COMMAND_CANDIDATES = ["tailscale", "/Applications/Tailscale.app/Contents/MacOS/Tailscale"];
function parsePossiblyNoisyJsonObject(raw) {
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start === -1 || end <= start) return {};
	try {
		return JSON.parse(raw.slice(start, end + 1));
	} catch {
		return {};
	}
}
function extractTailnetHostFromStatusJson(raw) {
	const parsed = parsePossiblyNoisyJsonObject(raw);
	const self = typeof parsed.Self === "object" && parsed.Self !== null ? parsed.Self : void 0;
	const dns = typeof self?.DNSName === "string" ? self.DNSName : void 0;
	if (dns && dns.length > 0) return dns.replace(/\.$/, "");
	const ips = Array.isArray(self?.TailscaleIPs) ? self.TailscaleIPs : [];
	return ips.length > 0 ? ips[0] ?? null : null;
}
async function resolveTailnetHostWithRunner(runCommandWithTimeout) {
	if (!runCommandWithTimeout) return null;
	for (const candidate of TAILSCALE_STATUS_COMMAND_CANDIDATES) try {
		const result = await runCommandWithTimeout([
			candidate,
			"status",
			"--json"
		], { timeoutMs: 5e3 });
		if (result.code !== 0) continue;
		const raw = result.stdout.trim();
		if (!raw) continue;
		const host = extractTailnetHostFromStatusJson(raw);
		if (host) return host;
	} catch {
		continue;
	}
	return null;
}
//#endregion
//#region src/infra/outbound/thread-id.ts
function normalizeOutboundThreadId(value) {
	if (value == null) return;
	if (typeof value === "number") {
		if (!Number.isFinite(value)) return;
		return String(Math.trunc(value));
	}
	const trimmed = value.trim();
	return trimmed ? trimmed : void 0;
}
//#endregion
//#region src/plugin-sdk/core.ts
function stripChannelTargetPrefix(raw, ...providers) {
	const trimmed = raw.trim();
	for (const provider of providers) {
		const prefix = `${provider.toLowerCase()}:`;
		if (trimmed.toLowerCase().startsWith(prefix)) return trimmed.slice(prefix.length).trim();
	}
	return trimmed;
}
function stripTargetKindPrefix(raw) {
	return raw.replace(/^(user|channel|group|conversation|room|dm):/i, "").trim();
}
function buildChannelOutboundSessionRoute(params) {
	const baseSessionKey = buildOutboundBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: params.channel,
		accountId: params.accountId,
		peer: params.peer
	});
	return {
		sessionKey: baseSessionKey,
		baseSessionKey,
		peer: params.peer,
		chatType: params.chatType,
		from: params.from,
		to: params.to,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {}
	};
}
function resolvePluginConfigSchema(configSchema = emptyPluginConfigSchema) {
	return typeof configSchema === "function" ? configSchema() : configSchema;
}
function definePluginEntry({ id, name, description, kind, configSchema = emptyPluginConfigSchema, register }) {
	return {
		id,
		name,
		description,
		...kind ? { kind } : {},
		configSchema: resolvePluginConfigSchema(configSchema),
		register
	};
}
function defineChannelPluginEntry({ id, name, description, plugin, configSchema = emptyPluginConfigSchema, setRuntime, registerFull }) {
	return definePluginEntry({
		id,
		name,
		description,
		configSchema,
		register(api) {
			setRuntime?.(api.runtime);
			api.registerChannel({ plugin });
			if (api.registrationMode !== "full") return;
			registerFull?.(api);
		}
	});
}
function defineSetupPluginEntry(plugin) {
	return { plugin };
}
function createChannelPluginBase(params) {
	return {
		id: params.id,
		meta: {
			...getChatChannelMeta(params.id),
			...params.meta
		},
		...params.setupWizard ? { setupWizard: params.setupWizard } : {},
		...params.capabilities ? { capabilities: params.capabilities } : {},
		...params.agentPrompt ? { agentPrompt: params.agentPrompt } : {},
		...params.streaming ? { streaming: params.streaming } : {},
		...params.reload ? { reload: params.reload } : {},
		...params.gatewayMethods ? { gatewayMethods: params.gatewayMethods } : {},
		...params.configSchema ? { configSchema: params.configSchema } : {},
		...params.config ? { config: params.config } : {},
		...params.security ? { security: params.security } : {},
		...params.groups ? { groups: params.groups } : {},
		setup: params.setup
	};
}
//#endregion
export { CHANNEL_TARGET_DESCRIPTION as _, defineSetupPluginEntry as a, actionRequiresTarget as b, normalizeOutboundThreadId as c, buildOutboundBaseSessionKey as d, channelTargetSchema as f, CHANNEL_TARGETS_DESCRIPTION as g, stringEnum as h, definePluginEntry as i, resolveTailnetHostWithRunner as l, optionalStringEnum as m, createChannelPluginBase as n, stripChannelTargetPrefix as o, channelTargetsSchema as p, defineChannelPluginEntry as r, stripTargetKindPrefix as s, buildChannelOutboundSessionRoute as t, resolveGatewayBindUrl as u, applyTargetToParams as v, buildOauthProviderAuthResult as x, actionHasTarget as y };
