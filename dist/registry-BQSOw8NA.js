import { o as normalizeAnyChannelId, u as CHAT_CHANNEL_ORDER } from "./registry-bBUk5Kld.js";
//#region src/plugins/registry-empty.ts
function createEmptyPluginRegistry() {
	return {
		plugins: [],
		tools: [],
		hooks: [],
		typedHooks: [],
		channels: [],
		channelSetups: [],
		providers: [],
		speechProviders: [],
		mediaUnderstandingProviders: [],
		imageGenerationProviders: [],
		webSearchProviders: [],
		gatewayHandlers: {},
		httpRoutes: [],
		cliRegistrars: [],
		services: [],
		commands: [],
		conversationBindingResolvedHandlers: [],
		diagnostics: []
	};
}
//#endregion
//#region src/plugins/runtime.ts
const REGISTRY_STATE = Symbol.for("wormagent.pluginRegistryState");
const state = (() => {
	const globalState = globalThis;
	if (!globalState[REGISTRY_STATE]) globalState[REGISTRY_STATE] = {
		registry: createEmptyPluginRegistry(),
		httpRouteRegistry: null,
		httpRouteRegistryPinned: false,
		key: null,
		version: 0
	};
	return globalState[REGISTRY_STATE];
})();
function setActivePluginRegistry(registry, cacheKey) {
	state.registry = registry;
	if (!state.httpRouteRegistryPinned) state.httpRouteRegistry = registry;
	state.key = cacheKey ?? null;
	state.version += 1;
}
function getActivePluginRegistry() {
	return state.registry;
}
function requireActivePluginRegistry() {
	if (!state.registry) {
		state.registry = createEmptyPluginRegistry();
		if (!state.httpRouteRegistryPinned) state.httpRouteRegistry = state.registry;
		state.version += 1;
	}
	return state.registry;
}
function pinActivePluginHttpRouteRegistry(registry) {
	state.httpRouteRegistry = registry;
	state.httpRouteRegistryPinned = true;
}
function releasePinnedPluginHttpRouteRegistry(registry) {
	if (registry && state.httpRouteRegistry !== registry) return;
	state.httpRouteRegistryPinned = false;
	state.httpRouteRegistry = state.registry;
}
function getActivePluginHttpRouteRegistry() {
	return state.httpRouteRegistry ?? state.registry;
}
function requireActivePluginHttpRouteRegistry() {
	const existing = getActivePluginHttpRouteRegistry();
	if (existing) return existing;
	const created = requireActivePluginRegistry();
	state.httpRouteRegistry = created;
	return created;
}
function resolveActivePluginHttpRouteRegistry(fallback) {
	const routeRegistry = getActivePluginHttpRouteRegistry();
	if (!routeRegistry) return fallback;
	const routeCount = routeRegistry.httpRoutes?.length ?? 0;
	const fallbackRouteCount = fallback.httpRoutes?.length ?? 0;
	if (routeCount === 0 && fallbackRouteCount > 0) return fallback;
	return routeRegistry;
}
function getActivePluginRegistryKey() {
	return state.key;
}
function getActivePluginRegistryVersion() {
	return state.version;
}
//#endregion
//#region src/channels/plugins/registry.ts
function dedupeChannels(channels) {
	const seen = /* @__PURE__ */ new Set();
	const resolved = [];
	for (const plugin of channels) {
		const id = String(plugin.id).trim();
		if (!id || seen.has(id)) continue;
		seen.add(id);
		resolved.push(plugin);
	}
	return resolved;
}
let cachedChannelPlugins = {
	registryVersion: -1,
	sorted: [],
	byId: /* @__PURE__ */ new Map()
};
function resolveCachedChannelPlugins() {
	const registry = requireActivePluginRegistry();
	const registryVersion = getActivePluginRegistryVersion();
	const cached = cachedChannelPlugins;
	if (cached.registryVersion === registryVersion) return cached;
	const sorted = dedupeChannels(registry.channels.map((entry) => entry.plugin)).toSorted((a, b) => {
		const indexA = CHAT_CHANNEL_ORDER.indexOf(a.id);
		const indexB = CHAT_CHANNEL_ORDER.indexOf(b.id);
		const orderA = a.meta.order ?? (indexA === -1 ? 999 : indexA);
		const orderB = b.meta.order ?? (indexB === -1 ? 999 : indexB);
		if (orderA !== orderB) return orderA - orderB;
		return a.id.localeCompare(b.id);
	});
	const byId = /* @__PURE__ */ new Map();
	for (const plugin of sorted) byId.set(plugin.id, plugin);
	const next = {
		registryVersion,
		sorted,
		byId
	};
	cachedChannelPlugins = next;
	return next;
}
function listChannelPlugins() {
	return resolveCachedChannelPlugins().sorted.slice();
}
function getChannelPlugin(id) {
	const resolvedId = String(id).trim();
	if (!resolvedId) return;
	return resolveCachedChannelPlugins().byId.get(resolvedId);
}
function normalizeChannelId(raw) {
	return normalizeAnyChannelId(raw);
}
//#endregion
export { getActivePluginRegistryKey as a, releasePinnedPluginHttpRouteRegistry as c, resolveActivePluginHttpRouteRegistry as d, setActivePluginRegistry as f, getActivePluginRegistry as i, requireActivePluginHttpRouteRegistry as l, listChannelPlugins as n, getActivePluginRegistryVersion as o, createEmptyPluginRegistry as p, normalizeChannelId as r, pinActivePluginHttpRouteRegistry as s, getChannelPlugin as t, requireActivePluginRegistry as u };
