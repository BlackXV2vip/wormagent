//#region src/config/legacy-web-search.ts
const GENERIC_WEB_SEARCH_KEYS = new Set([
	"enabled",
	"provider",
	"maxResults",
	"timeoutSeconds",
	"cacheTtlMinutes"
]);
const LEGACY_PROVIDER_MAP = {
	brave: "brave",
	firecrawl: "firecrawl",
	gemini: "google",
	grok: "xai",
	kimi: "moonshot",
	perplexity: "perplexity"
};
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function cloneRecord(value) {
	return { ...value };
}
function ensureRecord(target, key) {
	const current = target[key];
	if (isRecord(current)) return current;
	const next = {};
	target[key] = next;
	return next;
}
function resolveLegacySearchConfig(raw) {
	if (!isRecord(raw)) return;
	const tools = isRecord(raw.tools) ? raw.tools : void 0;
	const web = isRecord(tools?.web) ? tools.web : void 0;
	return isRecord(web?.search) ? web.search : void 0;
}
function copyLegacyProviderConfig(search, providerKey) {
	const current = search[providerKey];
	return isRecord(current) ? cloneRecord(current) : void 0;
}
function setPluginWebSearchConfig(target, pluginId, webSearchConfig) {
	const entry = ensureRecord(ensureRecord(ensureRecord(target, "plugins"), "entries"), pluginId);
	if (entry.enabled === void 0) entry.enabled = true;
	const config = ensureRecord(entry, "config");
	config.webSearch = webSearchConfig;
}
function listLegacyWebSearchConfigPaths(raw) {
	const search = resolveLegacySearchConfig(raw);
	if (!search) return [];
	const paths = [];
	if ("apiKey" in search) paths.push("tools.web.search.apiKey");
	for (const providerId of Object.keys(LEGACY_PROVIDER_MAP)) {
		const scoped = search[providerId];
		if (isRecord(scoped)) for (const key of Object.keys(scoped)) paths.push(`tools.web.search.${providerId}.${key}`);
	}
	return paths;
}
function normalizeLegacyWebSearchConfig(raw) {
	if (!isRecord(raw)) return raw;
	const search = resolveLegacySearchConfig(raw);
	if (!search) return raw;
	const nextRoot = cloneRecord(raw);
	const web = ensureRecord(ensureRecord(nextRoot, "tools"), "web");
	const nextSearch = {};
	for (const [key, value] of Object.entries(search)) if (GENERIC_WEB_SEARCH_KEYS.has(key)) nextSearch[key] = value;
	web.search = nextSearch;
	const braveConfig = copyLegacyProviderConfig(search, "brave") ?? {};
	if ("apiKey" in search) braveConfig.apiKey = search.apiKey;
	if (Object.keys(braveConfig).length > 0) setPluginWebSearchConfig(nextRoot, LEGACY_PROVIDER_MAP.brave, braveConfig);
	for (const providerId of [
		"firecrawl",
		"gemini",
		"grok",
		"kimi",
		"perplexity"
	]) {
		const scoped = copyLegacyProviderConfig(search, providerId);
		if (!scoped || Object.keys(scoped).length === 0) continue;
		setPluginWebSearchConfig(nextRoot, LEGACY_PROVIDER_MAP[providerId], scoped);
	}
	return nextRoot;
}
function resolvePluginWebSearchConfig(config, pluginId) {
	const pluginConfig = config?.plugins?.entries?.[pluginId]?.config;
	if (!isRecord(pluginConfig)) return;
	const webSearch = pluginConfig.webSearch;
	return isRecord(webSearch) ? webSearch : void 0;
}
//#endregion
export { normalizeLegacyWebSearchConfig as n, resolvePluginWebSearchConfig as r, listLegacyWebSearchConfigPaths as t };
