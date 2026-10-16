//#region src/plugins/bundled-provider-auth-env-vars.generated.ts
const BUNDLED_PROVIDER_AUTH_ENV_VAR_CANDIDATES = {
	anthropic: ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"],
	byteplus: ["BYTEPLUS_API_KEY"],
	chutes: ["CHUTES_API_KEY", "CHUTES_OAUTH_TOKEN"],
	"cloudflare-ai-gateway": ["CLOUDFLARE_AI_GATEWAY_API_KEY"],
	fal: ["FAL_KEY"],
	"github-copilot": [
		"COPILOT_GITHUB_TOKEN",
		"GH_TOKEN",
		"GITHUB_TOKEN"
	],
	google: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
	huggingface: ["HUGGINGFACE_HUB_TOKEN", "HF_TOKEN"],
	kilocode: ["KILOCODE_API_KEY"],
	kimi: ["KIMI_API_KEY", "KIMICODE_API_KEY"],
	"kimi-coding": ["KIMI_API_KEY", "KIMICODE_API_KEY"],
	minimax: ["MINIMAX_API_KEY"],
	"minimax-portal": ["MINIMAX_OAUTH_TOKEN", "MINIMAX_API_KEY"],
	mistral: ["MISTRAL_API_KEY"],
	modelstudio: ["MODELSTUDIO_API_KEY"],
	moonshot: ["MOONSHOT_API_KEY"],
	nvidia: ["NVIDIA_API_KEY"],
	ollama: ["OLLAMA_API_KEY"],
	openai: ["OPENAI_API_KEY"],
	opencode: ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
	"opencode-go": ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
	openrouter: ["OPENROUTER_API_KEY"],
	qianfan: ["QIANFAN_API_KEY"],
	"qwen-portal": ["QWEN_OAUTH_TOKEN", "QWEN_PORTAL_API_KEY"],
	sglang: ["SGLANG_API_KEY"],
	synthetic: ["SYNTHETIC_API_KEY"],
	together: ["TOGETHER_API_KEY"],
	venice: ["VENICE_API_KEY"],
	"vercel-ai-gateway": ["AI_GATEWAY_API_KEY"],
	vllm: ["VLLM_API_KEY"],
	volcengine: ["VOLCANO_ENGINE_API_KEY"],
	xai: ["XAI_API_KEY"],
	xiaomi: ["XIAOMI_API_KEY"],
	zai: ["ZAI_API_KEY", "Z_AI_API_KEY"]
};
//#endregion
//#region src/secrets/provider-env-vars.ts
const CORE_PROVIDER_AUTH_ENV_VAR_CANDIDATES = {
	chutes: ["CHUTES_OAUTH_TOKEN", "CHUTES_API_KEY"],
	voyage: ["VOYAGE_API_KEY"],
	groq: ["GROQ_API_KEY"],
	deepgram: ["DEEPGRAM_API_KEY"],
	cerebras: ["CEREBRAS_API_KEY"],
	litellm: ["LITELLM_API_KEY"]
};
const CORE_PROVIDER_SETUP_ENV_VAR_OVERRIDES = {
	anthropic: ["ANTHROPIC_API_KEY", "ANTHROPIC_OAUTH_TOKEN"],
	chutes: ["CHUTES_API_KEY", "CHUTES_OAUTH_TOKEN"],
	"minimax-cn": ["MINIMAX_API_KEY"]
};
/**
* Provider auth env candidates used by generic auth resolution.
*
* Order matters: the first non-empty value wins for helpers such as
* `resolveEnvApiKey()`. Bundled providers source this from plugin manifest
* metadata so auth probes do not need to load plugin runtime.
*/
const PROVIDER_AUTH_ENV_VAR_CANDIDATES = {
	...BUNDLED_PROVIDER_AUTH_ENV_VAR_CANDIDATES,
	...CORE_PROVIDER_AUTH_ENV_VAR_CANDIDATES
};
/**
* Provider env vars used for setup/default secret refs and broad secret
* scrubbing. This can include non-model providers and may intentionally choose
* a different preferred first env var than auth resolution.
*
* Bundled provider auth envs come from plugin manifests. The override map here
* is only for true core/non-plugin providers and a few setup-specific ordering
* overrides where generic onboarding wants a different preferred env var.
*/
const PROVIDER_ENV_VARS = {
	...PROVIDER_AUTH_ENV_VAR_CANDIDATES,
	...CORE_PROVIDER_SETUP_ENV_VAR_OVERRIDES
};
const EXTRA_PROVIDER_AUTH_ENV_VARS = ["MINIMAX_CODE_PLAN_KEY"];
const KNOWN_SECRET_ENV_VARS = [...new Set(Object.values(PROVIDER_ENV_VARS).flatMap((keys) => keys))];
const KNOWN_PROVIDER_AUTH_ENV_VARS = [...new Set([
	...Object.values(PROVIDER_AUTH_ENV_VAR_CANDIDATES).flatMap((keys) => keys),
	...KNOWN_SECRET_ENV_VARS,
	...EXTRA_PROVIDER_AUTH_ENV_VARS
])];
function listKnownProviderAuthEnvVarNames() {
	return [...KNOWN_PROVIDER_AUTH_ENV_VARS];
}
function listKnownSecretEnvVarNames() {
	return [...KNOWN_SECRET_ENV_VARS];
}
function omitEnvKeysCaseInsensitive(baseEnv, keys) {
	const env = { ...baseEnv };
	const denied = /* @__PURE__ */ new Set();
	for (const key of keys) {
		const normalizedKey = key.trim();
		if (normalizedKey) denied.add(normalizedKey.toUpperCase());
	}
	if (denied.size === 0) return env;
	for (const actualKey of Object.keys(env)) if (denied.has(actualKey.toUpperCase())) delete env[actualKey];
	return env;
}
//#endregion
//#region src/acp/runtime/errors.ts
const ACP_ERROR_CODES = [
	"ACP_BACKEND_MISSING",
	"ACP_BACKEND_UNAVAILABLE",
	"ACP_BACKEND_UNSUPPORTED_CONTROL",
	"ACP_DISPATCH_DISABLED",
	"ACP_INVALID_RUNTIME_OPTION",
	"ACP_SESSION_INIT_FAILED",
	"ACP_TURN_FAILED"
];
var AcpRuntimeError = class extends Error {
	constructor(code, message, options) {
		super(message);
		this.name = "AcpRuntimeError";
		this.code = code;
		this.cause = options?.cause;
	}
};
function isAcpRuntimeError(value) {
	return value instanceof AcpRuntimeError;
}
function toAcpRuntimeError(params) {
	if (params.error instanceof AcpRuntimeError) return params.error;
	if (params.error instanceof Error) return new AcpRuntimeError(params.fallbackCode, params.error.message, { cause: params.error });
	return new AcpRuntimeError(params.fallbackCode, params.fallbackMessage, { cause: params.error });
}
async function withAcpRuntimeErrorBoundary(params) {
	try {
		return await params.run();
	} catch (error) {
		throw toAcpRuntimeError({
			error,
			fallbackCode: params.fallbackCode,
			fallbackMessage: params.fallbackMessage
		});
	}
}
//#endregion
//#region src/acp/runtime/registry.ts
const ACP_RUNTIME_REGISTRY_STATE_KEY = Symbol.for("wormagent.acpRuntimeRegistryState");
function createAcpRuntimeRegistryGlobalState() {
	return { backendsById: /* @__PURE__ */ new Map() };
}
function resolveAcpRuntimeRegistryGlobalState() {
	const runtimeGlobal = globalThis;
	if (!runtimeGlobal[ACP_RUNTIME_REGISTRY_STATE_KEY]) runtimeGlobal[ACP_RUNTIME_REGISTRY_STATE_KEY] = createAcpRuntimeRegistryGlobalState();
	return runtimeGlobal[ACP_RUNTIME_REGISTRY_STATE_KEY];
}
const ACP_BACKENDS_BY_ID = resolveAcpRuntimeRegistryGlobalState().backendsById;
function normalizeBackendId(id) {
	return id?.trim().toLowerCase() || "";
}
function isBackendHealthy(backend) {
	if (!backend.healthy) return true;
	try {
		return backend.healthy();
	} catch {
		return false;
	}
}
function registerAcpRuntimeBackend(backend) {
	const id = normalizeBackendId(backend.id);
	if (!id) throw new Error("ACP runtime backend id is required");
	if (!backend.runtime) throw new Error(`ACP runtime backend "${id}" is missing runtime implementation`);
	ACP_BACKENDS_BY_ID.set(id, {
		...backend,
		id
	});
}
function unregisterAcpRuntimeBackend(id) {
	const normalized = normalizeBackendId(id);
	if (!normalized) return;
	ACP_BACKENDS_BY_ID.delete(normalized);
}
function getAcpRuntimeBackend(id) {
	const normalized = normalizeBackendId(id);
	if (normalized) return ACP_BACKENDS_BY_ID.get(normalized) ?? null;
	if (ACP_BACKENDS_BY_ID.size === 0) return null;
	for (const backend of ACP_BACKENDS_BY_ID.values()) if (isBackendHealthy(backend)) return backend;
	return ACP_BACKENDS_BY_ID.values().next().value ?? null;
}
function requireAcpRuntimeBackend(id) {
	const normalized = normalizeBackendId(id);
	const backend = getAcpRuntimeBackend(normalized || void 0);
	if (!backend) throw new AcpRuntimeError("ACP_BACKEND_MISSING", "ACP runtime backend is not configured. Install and enable the acpx runtime plugin.");
	if (!isBackendHealthy(backend)) throw new AcpRuntimeError("ACP_BACKEND_UNAVAILABLE", "ACP runtime backend is currently unavailable. Try again in a moment.");
	if (normalized && backend.id !== normalized) throw new AcpRuntimeError("ACP_BACKEND_MISSING", `ACP runtime backend "${normalized}" is not registered.`);
	return backend;
}
//#endregion
export { ACP_ERROR_CODES as a, toAcpRuntimeError as c, PROVIDER_ENV_VARS as d, listKnownProviderAuthEnvVarNames as f, unregisterAcpRuntimeBackend as i, withAcpRuntimeErrorBoundary as l, omitEnvKeysCaseInsensitive as m, registerAcpRuntimeBackend as n, AcpRuntimeError as o, listKnownSecretEnvVarNames as p, requireAcpRuntimeBackend as r, isAcpRuntimeError as s, getAcpRuntimeBackend as t, PROVIDER_AUTH_ENV_VAR_CANDIDATES as u };
