//#region src/plugins/provider-catalog.ts
function findCatalogTemplate(params) {
	return params.templateIds.map((templateId) => params.entries.find((entry) => entry.provider.toLowerCase() === params.providerId.toLowerCase() && entry.id.toLowerCase() === templateId.toLowerCase())).find((entry) => entry !== void 0);
}
async function buildSingleProviderApiKeyCatalog(params) {
	const apiKey = params.ctx.resolveProviderApiKey(params.providerId).apiKey;
	if (!apiKey) return null;
	const explicitProvider = params.allowExplicitBaseUrl ? params.ctx.config.models?.providers?.[params.providerId] : void 0;
	const explicitBaseUrl = typeof explicitProvider?.baseUrl === "string" ? explicitProvider.baseUrl.trim() : "";
	return { provider: {
		...await params.buildProvider(),
		...explicitBaseUrl ? { baseUrl: explicitBaseUrl } : {},
		apiKey
	} };
}
async function buildPairedProviderApiKeyCatalog(params) {
	const apiKey = params.ctx.resolveProviderApiKey(params.providerId).apiKey;
	if (!apiKey) return null;
	const providers = await params.buildProviders();
	return { providers: Object.fromEntries(Object.entries(providers).map(([id, provider]) => [id, {
		...provider,
		apiKey
	}])) };
}
//#endregion
export { buildSingleProviderApiKeyCatalog as n, findCatalogTemplate as r, buildPairedProviderApiKeyCatalog as t };
