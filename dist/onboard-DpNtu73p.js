import { it as resolveCloudflareAiGatewayBaseUrl, nt as CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF, rt as buildCloudflareAiGatewayModelDefinition } from "./provider-models-B4BOY8WM.js";
import { r as applyProviderConfigWithDefaultModel, t as applyAgentDefaultModelPrimary } from "./provider-onboard-BjiAI9qS.js";
//#region extensions/cloudflare-ai-gateway/onboard.ts
function buildCloudflareAiGatewayConfigPatch(params) {
	const baseUrl = resolveCloudflareAiGatewayBaseUrl(params);
	return {
		models: { providers: { "cloudflare-ai-gateway": {
			baseUrl,
			api: "anthropic-messages",
			models: [buildCloudflareAiGatewayModelDefinition()]
		} } },
		agents: { defaults: { models: { [CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF]: { alias: "Cloudflare AI Gateway" } } } }
	};
}
function applyCloudflareAiGatewayProviderConfig(cfg, params) {
	const models = { ...cfg.agents?.defaults?.models };
	models[CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF] = {
		...models[CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF],
		alias: models[CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF]?.alias ?? "Cloudflare AI Gateway"
	};
	const existingProvider = cfg.models?.providers?.["cloudflare-ai-gateway"];
	const baseUrl = params?.accountId && params?.gatewayId ? resolveCloudflareAiGatewayBaseUrl({
		accountId: params.accountId,
		gatewayId: params.gatewayId
	}) : typeof existingProvider?.baseUrl === "string" ? existingProvider.baseUrl : void 0;
	if (!baseUrl) return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				models
			}
		}
	};
	return applyProviderConfigWithDefaultModel(cfg, {
		agentModels: models,
		providerId: "cloudflare-ai-gateway",
		api: "anthropic-messages",
		baseUrl,
		defaultModel: buildCloudflareAiGatewayModelDefinition()
	});
}
function applyCloudflareAiGatewayConfig(cfg, params) {
	return applyAgentDefaultModelPrimary(applyCloudflareAiGatewayProviderConfig(cfg, params), CLOUDFLARE_AI_GATEWAY_DEFAULT_MODEL_REF);
}
//#endregion
export { buildCloudflareAiGatewayConfigPatch as n, applyCloudflareAiGatewayConfig as t };
