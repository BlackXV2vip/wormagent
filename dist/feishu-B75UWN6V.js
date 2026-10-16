import { t as formatDocsLink } from "./links-B85QumIb.js";
import { Oo as promptParsedAllowFromForAccount, To as patchTopLevelChannelConfigSection, Yo as splitSetupEntries, fo as createTopLevelChannelAllowFromSetter, go as mergeAllowFromEntries, ho as createTopLevelChannelGroupPolicySetter, io as buildSingleChannelSecretPromptState, jo as promptSingleChannelSecretInput, po as createTopLevelChannelDmPolicy } from "./auth-profiles-DHKWTcix.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-B0Ci-_gE.js";
import { a as hasConfiguredSecretInput, c as normalizeResolvedSecretInputString, l as normalizeSecretInputString } from "./types.secrets-Mh0km-xK.js";
import { HttpsProxyAgent } from "https-proxy-agent";
import * as Lark from "@larksuiteoapi/node-sdk";
//#region extensions/feishu/src/setup-core.ts
function setFeishuNamedAccountEnabled(cfg, accountId, enabled) {
	const feishuCfg = cfg.channels?.feishu;
	return {
		...cfg,
		channels: {
			...cfg.channels,
			feishu: {
				...feishuCfg,
				accounts: {
					...feishuCfg?.accounts,
					[accountId]: {
						...feishuCfg?.accounts?.[accountId],
						enabled
					}
				}
			}
		}
	};
}
const feishuSetupAdapter = {
	resolveAccountId: () => DEFAULT_ACCOUNT_ID,
	applyAccountConfig: ({ cfg, accountId }) => {
		if (!accountId || accountId === "default") return {
			...cfg,
			channels: {
				...cfg.channels,
				feishu: {
					...cfg.channels?.feishu,
					enabled: true
				}
			}
		};
		return setFeishuNamedAccountEnabled(cfg, accountId, true);
	}
};
//#endregion
//#region extensions/feishu/src/accounts.ts
/**
* List all configured account IDs from the accounts field.
*/
function listConfiguredAccountIds(cfg) {
	const accounts = (cfg.channels?.feishu)?.accounts;
	if (!accounts || typeof accounts !== "object") return [];
	return Object.keys(accounts).filter(Boolean);
}
/**
* List all Feishu account IDs.
* If no accounts are configured, returns [DEFAULT_ACCOUNT_ID] for backward compatibility.
*/
function listFeishuAccountIds(cfg) {
	const ids = listConfiguredAccountIds(cfg);
	if (ids.length === 0) return [DEFAULT_ACCOUNT_ID];
	return [...ids].toSorted((a, b) => a.localeCompare(b));
}
/**
* Resolve the default account selection and its source.
*/
function resolveDefaultFeishuAccountSelection(cfg) {
	const preferredRaw = (cfg.channels?.feishu)?.defaultAccount?.trim();
	const preferred = preferredRaw ? normalizeAccountId(preferredRaw) : void 0;
	if (preferred) return {
		accountId: preferred,
		source: "explicit-default"
	};
	const ids = listFeishuAccountIds(cfg);
	if (ids.includes("default")) return {
		accountId: DEFAULT_ACCOUNT_ID,
		source: "mapped-default"
	};
	return {
		accountId: ids[0] ?? "default",
		source: "fallback"
	};
}
/**
* Resolve the default account ID.
*/
function resolveDefaultFeishuAccountId(cfg) {
	return resolveDefaultFeishuAccountSelection(cfg).accountId;
}
/**
* Get the raw account-specific config.
*/
function resolveAccountConfig(cfg, accountId) {
	const accounts = (cfg.channels?.feishu)?.accounts;
	if (!accounts || typeof accounts !== "object") return;
	return accounts[accountId];
}
/**
* Merge top-level config with account-specific config.
* Account-specific fields override top-level fields.
*/
function mergeFeishuAccountConfig(cfg, accountId) {
	const { accounts: _ignored, defaultAccount: _ignoredDefaultAccount, ...base } = cfg.channels?.feishu ?? {};
	const account = resolveAccountConfig(cfg, accountId) ?? {};
	return {
		...base,
		...account
	};
}
function resolveFeishuCredentials(cfg, options) {
	const normalizeString = (value) => {
		if (typeof value !== "string") return;
		const trimmed = value.trim();
		return trimmed ? trimmed : void 0;
	};
	const resolveSecretLike = (value, path) => {
		const asString = normalizeString(value);
		if (asString) return asString;
		if (options?.allowUnresolvedSecretRef && typeof value === "object" && value !== null) {
			const rec = value;
			const source = normalizeString(rec.source)?.toLowerCase();
			const id = normalizeString(rec.id);
			if (source === "env" && id) {
				const envValue = normalizeString(process.env[id]);
				if (envValue) return envValue;
			}
		}
		if (options?.allowUnresolvedSecretRef) return normalizeSecretInputString(value);
		return normalizeResolvedSecretInputString({
			value,
			path
		});
	};
	const appId = resolveSecretLike(cfg?.appId, "channels.feishu.appId");
	const appSecret = resolveSecretLike(cfg?.appSecret, "channels.feishu.appSecret");
	if (!appId || !appSecret) return null;
	return {
		appId,
		appSecret,
		encryptKey: (cfg?.connectionMode ?? "websocket") === "webhook" ? resolveSecretLike(cfg?.encryptKey, "channels.feishu.encryptKey") : normalizeString(cfg?.encryptKey),
		verificationToken: resolveSecretLike(cfg?.verificationToken, "channels.feishu.verificationToken"),
		domain: cfg?.domain ?? "feishu"
	};
}
/**
* Resolve a complete Feishu account with merged config.
*/
function resolveFeishuAccount(params) {
	const hasExplicitAccountId = typeof params.accountId === "string" && params.accountId.trim() !== "";
	const defaultSelection = hasExplicitAccountId ? null : resolveDefaultFeishuAccountSelection(params.cfg);
	const accountId = hasExplicitAccountId ? normalizeAccountId(params.accountId) : defaultSelection?.accountId ?? "default";
	const selectionSource = hasExplicitAccountId ? "explicit" : defaultSelection?.source ?? "fallback";
	const baseEnabled = (params.cfg.channels?.feishu)?.enabled !== false;
	const merged = mergeFeishuAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const creds = resolveFeishuCredentials(merged);
	const accountName = merged.name;
	return {
		accountId,
		selectionSource,
		enabled,
		configured: Boolean(creds),
		name: typeof accountName === "string" ? accountName.trim() || void 0 : void 0,
		appId: creds?.appId,
		appSecret: creds?.appSecret,
		encryptKey: creds?.encryptKey,
		verificationToken: creds?.verificationToken,
		domain: creds?.domain ?? "feishu",
		config: merged
	};
}
/**
* List all enabled and configured accounts.
*/
function listEnabledFeishuAccounts(cfg) {
	return listFeishuAccountIds(cfg).map((accountId) => resolveFeishuAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled && account.configured);
}
//#endregion
//#region extensions/feishu/src/async.ts
const RACE_TIMEOUT = Symbol("race-timeout");
const RACE_ABORT = Symbol("race-abort");
async function raceWithTimeoutAndAbort(promise, options = {}) {
	if (options.abortSignal?.aborted) return { status: "aborted" };
	if (options.timeoutMs === void 0 && !options.abortSignal) return {
		status: "resolved",
		value: await promise
	};
	let timeoutHandle;
	let abortHandler;
	const contenders = [promise];
	if (options.timeoutMs !== void 0) contenders.push(new Promise((resolve) => {
		timeoutHandle = setTimeout(() => resolve(RACE_TIMEOUT), options.timeoutMs);
	}));
	if (options.abortSignal) contenders.push(new Promise((resolve) => {
		abortHandler = () => resolve(RACE_ABORT);
		options.abortSignal?.addEventListener("abort", abortHandler, { once: true });
	}));
	try {
		const result = await Promise.race(contenders);
		if (result === RACE_TIMEOUT) return { status: "timeout" };
		if (result === RACE_ABORT) return { status: "aborted" };
		return {
			status: "resolved",
			value: result
		};
	} finally {
		if (timeoutHandle) clearTimeout(timeoutHandle);
		if (abortHandler) options.abortSignal?.removeEventListener("abort", abortHandler);
	}
}
let feishuClientSdk = {
	AppType: Lark.AppType,
	Client: Lark.Client,
	defaultHttpInstance: Lark.defaultHttpInstance,
	Domain: Lark.Domain,
	EventDispatcher: Lark.EventDispatcher,
	LoggerLevel: Lark.LoggerLevel,
	WSClient: Lark.WSClient
};
let httpsProxyAgentCtor = HttpsProxyAgent;
/** Default HTTP timeout for Feishu API requests (30 seconds). */
const FEISHU_HTTP_TIMEOUT_MS = 3e4;
const FEISHU_HTTP_TIMEOUT_MAX_MS = 3e5;
const FEISHU_HTTP_TIMEOUT_ENV_VAR = "WORMAGENT_FEISHU_HTTP_TIMEOUT_MS";
function getWsProxyAgent() {
	const proxyUrl = process.env.https_proxy || process.env.HTTPS_PROXY || process.env.http_proxy || process.env.HTTP_PROXY;
	if (!proxyUrl) return void 0;
	return new httpsProxyAgentCtor(proxyUrl);
}
const clientCache = /* @__PURE__ */ new Map();
function resolveDomain(domain) {
	if (domain === "lark") return feishuClientSdk.Domain.Lark;
	if (domain === "feishu" || !domain) return feishuClientSdk.Domain.Feishu;
	return domain.replace(/\/+$/, "");
}
/**
* Create an HTTP instance that delegates to the Lark SDK's default instance
* but injects a default request timeout to prevent indefinite hangs
* (e.g. when the Feishu API is slow, causing per-chat queue deadlocks).
*/
function createTimeoutHttpInstance(defaultTimeoutMs) {
	const base = feishuClientSdk.defaultHttpInstance;
	function injectTimeout(opts) {
		return {
			timeout: defaultTimeoutMs,
			...opts
		};
	}
	return {
		request: (opts) => base.request(injectTimeout(opts)),
		get: (url, opts) => base.get(url, injectTimeout(opts)),
		post: (url, data, opts) => base.post(url, data, injectTimeout(opts)),
		put: (url, data, opts) => base.put(url, data, injectTimeout(opts)),
		patch: (url, data, opts) => base.patch(url, data, injectTimeout(opts)),
		delete: (url, opts) => base.delete(url, injectTimeout(opts)),
		head: (url, opts) => base.head(url, injectTimeout(opts)),
		options: (url, opts) => base.options(url, injectTimeout(opts))
	};
}
function resolveConfiguredHttpTimeoutMs(creds) {
	const clampTimeout = (value) => {
		const rounded = Math.floor(value);
		return Math.min(Math.max(rounded, 1), FEISHU_HTTP_TIMEOUT_MAX_MS);
	};
	const fromDirectField = creds.httpTimeoutMs;
	if (typeof fromDirectField === "number" && Number.isFinite(fromDirectField) && fromDirectField > 0) return clampTimeout(fromDirectField);
	const envRaw = process.env[FEISHU_HTTP_TIMEOUT_ENV_VAR];
	if (envRaw) {
		const envValue = Number(envRaw);
		if (Number.isFinite(envValue) && envValue > 0) return clampTimeout(envValue);
	}
	const timeout = creds.config?.httpTimeoutMs;
	if (typeof timeout !== "number" || !Number.isFinite(timeout) || timeout <= 0) return FEISHU_HTTP_TIMEOUT_MS;
	return clampTimeout(timeout);
}
/**
* Create or get a cached Feishu client for an account.
* Accepts any object with appId, appSecret, and optional domain/accountId.
*/
function createFeishuClient(creds) {
	const { accountId = "default", appId, appSecret, domain } = creds;
	const defaultHttpTimeoutMs = resolveConfiguredHttpTimeoutMs(creds);
	if (!appId || !appSecret) throw new Error(`Feishu credentials not configured for account "${accountId}"`);
	const cached = clientCache.get(accountId);
	if (cached && cached.config.appId === appId && cached.config.appSecret === appSecret && cached.config.domain === domain && cached.config.httpTimeoutMs === defaultHttpTimeoutMs) return cached.client;
	const client = new feishuClientSdk.Client({
		appId,
		appSecret,
		appType: feishuClientSdk.AppType.SelfBuild,
		domain: resolveDomain(domain),
		httpInstance: createTimeoutHttpInstance(defaultHttpTimeoutMs)
	});
	clientCache.set(accountId, {
		client,
		config: {
			appId,
			appSecret,
			domain,
			httpTimeoutMs: defaultHttpTimeoutMs
		}
	});
	return client;
}
/**
* Create a Feishu WebSocket client for an account.
* Note: WSClient is not cached since each call creates a new connection.
*/
function createFeishuWSClient(account) {
	const { accountId, appId, appSecret, domain } = account;
	if (!appId || !appSecret) throw new Error(`Feishu credentials not configured for account "${accountId}"`);
	const agent = getWsProxyAgent();
	return new feishuClientSdk.WSClient({
		appId,
		appSecret,
		domain: resolveDomain(domain),
		loggerLevel: feishuClientSdk.LoggerLevel.info,
		...agent ? { agent } : {}
	});
}
/**
* Create an event dispatcher for an account.
*/
function createEventDispatcher(account) {
	return new feishuClientSdk.EventDispatcher({
		encryptKey: account.encryptKey,
		verificationToken: account.verificationToken
	});
}
//#endregion
//#region extensions/feishu/src/probe.ts
/** Cache probe results to reduce repeated health-check calls.
* Gateway health checks call probeFeishu() every minute; without caching this
* burns ~43,200 calls/month, easily exceeding Feishu's free-tier quota.
* Successful bot info is effectively static, while failures are cached briefly
* to avoid hammering the API during transient outages. */
const probeCache = /* @__PURE__ */ new Map();
const PROBE_SUCCESS_TTL_MS = 600 * 1e3;
const PROBE_ERROR_TTL_MS = 60 * 1e3;
const MAX_PROBE_CACHE_SIZE = 64;
function setCachedProbeResult(cacheKey, result, ttlMs) {
	probeCache.set(cacheKey, {
		result,
		expiresAt: Date.now() + ttlMs
	});
	if (probeCache.size > MAX_PROBE_CACHE_SIZE) {
		const oldest = probeCache.keys().next().value;
		if (oldest !== void 0) probeCache.delete(oldest);
	}
	return result;
}
async function probeFeishu(creds, options = {}) {
	if (!creds?.appId || !creds?.appSecret) return {
		ok: false,
		error: "missing credentials (appId, appSecret)"
	};
	if (options.abortSignal?.aborted) return {
		ok: false,
		appId: creds.appId,
		error: "probe aborted"
	};
	const timeoutMs = options.timeoutMs ?? 1e4;
	const cacheKey = creds.accountId ?? `${creds.appId}:${creds.appSecret.slice(0, 8)}`;
	const cached = probeCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) return cached.result;
	try {
		const responseResult = await raceWithTimeoutAndAbort(createFeishuClient(creds).request({
			method: "GET",
			url: "/open-apis/bot/v3/info",
			data: {},
			timeout: timeoutMs
		}), {
			timeoutMs,
			abortSignal: options.abortSignal
		});
		if (responseResult.status === "aborted") return {
			ok: false,
			appId: creds.appId,
			error: "probe aborted"
		};
		if (responseResult.status === "timeout") return setCachedProbeResult(cacheKey, {
			ok: false,
			appId: creds.appId,
			error: `probe timed out after ${timeoutMs}ms`
		}, PROBE_ERROR_TTL_MS);
		const response = responseResult.value;
		if (options.abortSignal?.aborted) return {
			ok: false,
			appId: creds.appId,
			error: "probe aborted"
		};
		if (response.code !== 0) return setCachedProbeResult(cacheKey, {
			ok: false,
			appId: creds.appId,
			error: `API error: ${response.msg || `code ${response.code}`}`
		}, PROBE_ERROR_TTL_MS);
		const bot = response.bot || response.data?.bot;
		return setCachedProbeResult(cacheKey, {
			ok: true,
			appId: creds.appId,
			botName: bot?.bot_name,
			botOpenId: bot?.open_id
		}, PROBE_SUCCESS_TTL_MS);
	} catch (err) {
		return setCachedProbeResult(cacheKey, {
			ok: false,
			appId: creds.appId,
			error: err instanceof Error ? err.message : String(err)
		}, PROBE_ERROR_TTL_MS);
	}
}
//#endregion
//#region extensions/feishu/src/setup-surface.ts
const channel = "feishu";
const setFeishuAllowFrom = createTopLevelChannelAllowFromSetter({ channel });
const setFeishuGroupPolicy = createTopLevelChannelGroupPolicySetter({
	channel,
	enabled: true
});
function normalizeString(value) {
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
function setFeishuGroupAllowFrom(cfg, groupAllowFrom) {
	return {
		...cfg,
		channels: {
			...cfg.channels,
			feishu: {
				...cfg.channels?.feishu,
				groupAllowFrom
			}
		}
	};
}
function isFeishuConfigured(cfg) {
	const feishuCfg = cfg.channels?.feishu;
	const isAppIdConfigured = (value) => {
		if (normalizeString(value)) return true;
		if (!value || typeof value !== "object") return false;
		const rec = value;
		const source = normalizeString(rec.source)?.toLowerCase();
		const id = normalizeString(rec.id);
		if (source === "env" && id) return Boolean(normalizeString(process.env[id]));
		return hasConfiguredSecretInput(value);
	};
	const topLevelConfigured = Boolean(isAppIdConfigured(feishuCfg?.appId) && hasConfiguredSecretInput(feishuCfg?.appSecret));
	const accountConfigured = Object.values(feishuCfg?.accounts ?? {}).some((account) => {
		if (!account || typeof account !== "object") return false;
		const hasOwnAppId = Object.prototype.hasOwnProperty.call(account, "appId");
		const hasOwnAppSecret = Object.prototype.hasOwnProperty.call(account, "appSecret");
		const accountAppIdConfigured = hasOwnAppId ? isAppIdConfigured(account.appId) : isAppIdConfigured(feishuCfg?.appId);
		const accountSecretConfigured = hasOwnAppSecret ? hasConfiguredSecretInput(account.appSecret) : hasConfiguredSecretInput(feishuCfg?.appSecret);
		return Boolean(accountAppIdConfigured && accountSecretConfigured);
	});
	return topLevelConfigured || accountConfigured;
}
async function promptFeishuAllowFrom(params) {
	return await promptParsedAllowFromForAccount({
		cfg: params.cfg,
		defaultAccountId: DEFAULT_ACCOUNT_ID,
		prompter: params.prompter,
		noteTitle: "Feishu allowlist",
		noteLines: [
			"Allowlist Feishu DMs by open_id or user_id.",
			"You can find user open_id in Feishu admin console or via API.",
			"Examples:",
			"- ou_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
			"- on_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
		],
		message: "Feishu allowFrom (user open_ids)",
		placeholder: "ou_xxxxx, ou_yyyyy",
		parseEntries: (raw) => ({ entries: splitSetupEntries(raw) }),
		getExistingAllowFrom: ({ cfg }) => cfg.channels?.feishu?.allowFrom ?? [],
		mergeEntries: ({ existing, parsed }) => mergeAllowFromEntries(existing, parsed),
		applyAllowFrom: ({ cfg, allowFrom }) => setFeishuAllowFrom(cfg, allowFrom)
	});
}
async function noteFeishuCredentialHelp(prompter) {
	await prompter.note([
		"1) Go to Feishu Open Platform (open.feishu.cn)",
		"2) Create a self-built app",
		"3) Get App ID and App Secret from Credentials page",
		"4) Enable required permissions: im:message, im:chat, contact:user.base:readonly",
		"5) Publish the app or add it to a test group",
		"Tip: you can also set FEISHU_APP_ID / FEISHU_APP_SECRET env vars.",
		`Docs: ${formatDocsLink("/channels/feishu", "feishu")}`
	].join("\n"), "Feishu credentials");
}
async function promptFeishuAppId(params) {
	return String(await params.prompter.text({
		message: "Enter Feishu App ID",
		initialValue: params.initialValue,
		validate: (value) => value?.trim() ? void 0 : "Required"
	})).trim();
}
const feishuSetupWizard = {
	channel,
	resolveAccountIdForConfigure: () => DEFAULT_ACCOUNT_ID,
	resolveShouldPromptAccountIds: () => false,
	status: {
		configuredLabel: "configured",
		unconfiguredLabel: "needs app credentials",
		configuredHint: "configured",
		unconfiguredHint: "needs app creds",
		configuredScore: 2,
		unconfiguredScore: 0,
		resolveConfigured: ({ cfg }) => isFeishuConfigured(cfg),
		resolveStatusLines: async ({ cfg, configured }) => {
			const feishuCfg = cfg.channels?.feishu;
			const resolvedCredentials = resolveFeishuCredentials(feishuCfg, { allowUnresolvedSecretRef: true });
			let probeResult = null;
			if (configured && resolvedCredentials) try {
				probeResult = await probeFeishu(resolvedCredentials);
			} catch {}
			if (!configured) return ["Feishu: needs app credentials"];
			if (probeResult?.ok) return [`Feishu: connected as ${probeResult.botName ?? probeResult.botOpenId ?? "bot"}`];
			return ["Feishu: configured (connection not verified)"];
		}
	},
	credentials: [],
	finalize: async ({ cfg, prompter, options }) => {
		const feishuCfg = cfg.channels?.feishu;
		const resolved = resolveFeishuCredentials(feishuCfg, { allowUnresolvedSecretRef: true });
		const hasConfigSecret = hasConfiguredSecretInput(feishuCfg?.appSecret);
		const hasConfigCreds = Boolean(typeof feishuCfg?.appId === "string" && feishuCfg.appId.trim() && hasConfigSecret);
		const appSecretPromptState = buildSingleChannelSecretPromptState({
			accountConfigured: Boolean(resolved),
			hasConfigToken: hasConfigSecret,
			allowEnv: !hasConfigCreds && Boolean(process.env.FEISHU_APP_ID?.trim()),
			envValue: process.env.FEISHU_APP_SECRET
		});
		let next = cfg;
		let appId = null;
		let appSecret = null;
		let appSecretProbeValue = null;
		if (!resolved) await noteFeishuCredentialHelp(prompter);
		const appSecretResult = await promptSingleChannelSecretInput({
			cfg: next,
			prompter,
			providerHint: "feishu",
			credentialLabel: "App Secret",
			secretInputMode: options?.secretInputMode,
			accountConfigured: appSecretPromptState.accountConfigured,
			canUseEnv: appSecretPromptState.canUseEnv,
			hasConfigToken: appSecretPromptState.hasConfigToken,
			envPrompt: "FEISHU_APP_ID + FEISHU_APP_SECRET detected. Use env vars?",
			keepPrompt: "Feishu App Secret already configured. Keep it?",
			inputPrompt: "Enter Feishu App Secret",
			preferredEnvVar: "FEISHU_APP_SECRET"
		});
		if (appSecretResult.action === "use-env") next = patchTopLevelChannelConfigSection({
			cfg: next,
			channel,
			enabled: true,
			patch: {}
		});
		else if (appSecretResult.action === "set") {
			appSecret = appSecretResult.value;
			appSecretProbeValue = appSecretResult.resolvedValue;
			appId = await promptFeishuAppId({
				prompter,
				initialValue: normalizeString(feishuCfg?.appId) ?? normalizeString(process.env.FEISHU_APP_ID)
			});
		}
		if (appId && appSecret) {
			next = patchTopLevelChannelConfigSection({
				cfg: next,
				channel,
				enabled: true,
				patch: {
					appId,
					appSecret
				}
			});
			try {
				const probe = await probeFeishu({
					appId,
					appSecret: appSecretProbeValue ?? void 0,
					domain: (next.channels?.feishu)?.domain
				});
				if (probe.ok) await prompter.note(`Connected as ${probe.botName ?? probe.botOpenId ?? "bot"}`, "Feishu connection test");
				else await prompter.note(`Connection failed: ${probe.error ?? "unknown error"}`, "Feishu connection test");
			} catch (err) {
				await prompter.note(`Connection test failed: ${String(err)}`, "Feishu connection test");
			}
		}
		const currentMode = (next.channels?.feishu)?.connectionMode ?? "websocket";
		const connectionMode = await prompter.select({
			message: "Feishu connection mode",
			options: [{
				value: "websocket",
				label: "WebSocket (default)"
			}, {
				value: "webhook",
				label: "Webhook"
			}],
			initialValue: currentMode
		});
		next = patchTopLevelChannelConfigSection({
			cfg: next,
			channel,
			patch: { connectionMode }
		});
		if (connectionMode === "webhook") {
			const currentVerificationToken = (next.channels?.feishu)?.verificationToken;
			const verificationTokenResult = await promptSingleChannelSecretInput({
				cfg: next,
				prompter,
				providerHint: "feishu-webhook",
				credentialLabel: "verification token",
				secretInputMode: options?.secretInputMode,
				...buildSingleChannelSecretPromptState({
					accountConfigured: hasConfiguredSecretInput(currentVerificationToken),
					hasConfigToken: hasConfiguredSecretInput(currentVerificationToken),
					allowEnv: false
				}),
				envPrompt: "",
				keepPrompt: "Feishu verification token already configured. Keep it?",
				inputPrompt: "Enter Feishu verification token",
				preferredEnvVar: "FEISHU_VERIFICATION_TOKEN"
			});
			if (verificationTokenResult.action === "set") next = patchTopLevelChannelConfigSection({
				cfg: next,
				channel,
				patch: { verificationToken: verificationTokenResult.value }
			});
			const currentEncryptKey = (next.channels?.feishu)?.encryptKey;
			const encryptKeyResult = await promptSingleChannelSecretInput({
				cfg: next,
				prompter,
				providerHint: "feishu-webhook",
				credentialLabel: "encrypt key",
				secretInputMode: options?.secretInputMode,
				...buildSingleChannelSecretPromptState({
					accountConfigured: hasConfiguredSecretInput(currentEncryptKey),
					hasConfigToken: hasConfiguredSecretInput(currentEncryptKey),
					allowEnv: false
				}),
				envPrompt: "",
				keepPrompt: "Feishu encrypt key already configured. Keep it?",
				inputPrompt: "Enter Feishu encrypt key",
				preferredEnvVar: "FEISHU_ENCRYPT_KEY"
			});
			if (encryptKeyResult.action === "set") next = patchTopLevelChannelConfigSection({
				cfg: next,
				channel,
				patch: { encryptKey: encryptKeyResult.value }
			});
			const currentWebhookPath = (next.channels?.feishu)?.webhookPath;
			const webhookPath = String(await prompter.text({
				message: "Feishu webhook path",
				initialValue: currentWebhookPath ?? "/feishu/events",
				validate: (value) => String(value ?? "").trim() ? void 0 : "Required"
			})).trim();
			next = patchTopLevelChannelConfigSection({
				cfg: next,
				channel,
				patch: { webhookPath }
			});
		}
		const currentDomain = (next.channels?.feishu)?.domain ?? "feishu";
		const domain = await prompter.select({
			message: "Which Feishu domain?",
			options: [{
				value: "feishu",
				label: "Feishu (feishu.cn) - China"
			}, {
				value: "lark",
				label: "Lark (larksuite.com) - International"
			}],
			initialValue: currentDomain
		});
		next = patchTopLevelChannelConfigSection({
			cfg: next,
			channel,
			patch: { domain }
		});
		const groupPolicy = await prompter.select({
			message: "Group chat policy",
			options: [
				{
					value: "allowlist",
					label: "Allowlist - only respond in specific groups"
				},
				{
					value: "open",
					label: "Open - respond in all groups (requires mention)"
				},
				{
					value: "disabled",
					label: "Disabled - don't respond in groups"
				}
			],
			initialValue: (next.channels?.feishu)?.groupPolicy ?? "allowlist"
		});
		next = setFeishuGroupPolicy(next, groupPolicy);
		if (groupPolicy === "allowlist") {
			const existing = (next.channels?.feishu)?.groupAllowFrom ?? [];
			const entry = await prompter.text({
				message: "Group chat allowlist (chat_ids)",
				placeholder: "oc_xxxxx, oc_yyyyy",
				initialValue: existing.length > 0 ? existing.map(String).join(", ") : void 0
			});
			if (entry) {
				const parts = splitSetupEntries(String(entry));
				if (parts.length > 0) next = setFeishuGroupAllowFrom(next, parts);
			}
		}
		return { cfg: next };
	},
	dmPolicy: createTopLevelChannelDmPolicy({
		label: "Feishu",
		channel,
		policyKey: "channels.feishu.dmPolicy",
		allowFromKey: "channels.feishu.allowFrom",
		getCurrent: (cfg) => (cfg.channels?.feishu)?.dmPolicy ?? "pairing",
		promptAllowFrom: promptFeishuAllowFrom
	}),
	disable: (cfg) => patchTopLevelChannelConfigSection({
		cfg,
		channel,
		patch: { enabled: false }
	})
};
//#endregion
//#region extensions/feishu/src/conversation-id.ts
function normalizeText(value) {
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
function buildFeishuConversationId(params) {
	const chatId = normalizeText(params.chatId) ?? "unknown";
	const senderOpenId = normalizeText(params.senderOpenId);
	const topicId = normalizeText(params.topicId);
	switch (params.scope) {
		case "group_sender": return senderOpenId ? `${chatId}:sender:${senderOpenId}` : chatId;
		case "group_topic": return topicId ? `${chatId}:topic:${topicId}` : chatId;
		case "group_topic_sender":
			if (topicId && senderOpenId) return `${chatId}:topic:${topicId}:sender:${senderOpenId}`;
			if (topicId) return `${chatId}:topic:${topicId}`;
			return senderOpenId ? `${chatId}:sender:${senderOpenId}` : chatId;
		default: return chatId;
	}
}
function parseFeishuConversationId(params) {
	const conversationId = normalizeText(params.conversationId);
	const parentConversationId = normalizeText(params.parentConversationId);
	if (!conversationId) return null;
	const topicSenderMatch = conversationId.match(/^(.+):topic:([^:]+):sender:([^:]+)$/);
	if (topicSenderMatch) {
		const [, chatId, topicId, senderOpenId] = topicSenderMatch;
		return {
			canonicalConversationId: buildFeishuConversationId({
				chatId,
				scope: "group_topic_sender",
				topicId,
				senderOpenId
			}),
			chatId,
			topicId,
			senderOpenId,
			scope: "group_topic_sender"
		};
	}
	const topicMatch = conversationId.match(/^(.+):topic:([^:]+)$/);
	if (topicMatch) {
		const [, chatId, topicId] = topicMatch;
		return {
			canonicalConversationId: buildFeishuConversationId({
				chatId,
				scope: "group_topic",
				topicId
			}),
			chatId,
			topicId,
			scope: "group_topic"
		};
	}
	const senderMatch = conversationId.match(/^(.+):sender:([^:]+)$/);
	if (senderMatch) {
		const [, chatId, senderOpenId] = senderMatch;
		return {
			canonicalConversationId: buildFeishuConversationId({
				chatId,
				scope: "group_sender",
				senderOpenId
			}),
			chatId,
			senderOpenId,
			scope: "group_sender"
		};
	}
	if (parentConversationId) return {
		canonicalConversationId: buildFeishuConversationId({
			chatId: parentConversationId,
			scope: "group_topic",
			topicId: conversationId
		}),
		chatId: parentConversationId,
		topicId: conversationId,
		scope: "group_topic"
	};
	return {
		canonicalConversationId: conversationId,
		chatId: conversationId,
		scope: "group"
	};
}
//#endregion
export { createEventDispatcher as a, raceWithTimeoutAndAbort as c, resolveDefaultFeishuAccountId as d, resolveFeishuAccount as f, probeFeishu as i, listEnabledFeishuAccounts as l, feishuSetupAdapter as m, parseFeishuConversationId as n, createFeishuClient as o, resolveFeishuCredentials as p, feishuSetupWizard as r, createFeishuWSClient as s, buildFeishuConversationId as t, listFeishuAccountIds as u };
