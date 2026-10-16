import "../../logger-XBPi1AwR.js";
import "../../paths-C7DNYmnN.js";
import "../../tmp-wormagent-dir-DiDbPUEX.js";
import "../../theme-CLg7QWJt.js";
import "../../globals-B9nPdA7s.js";
import "../../runtime-BNNetENg.js";
import "../../ansi-cwY8Vrne.js";
import "../../subsystem-DFHXIqzU.js";
import "../../utils-1TVTmhOV.js";
import "../../model-selection-xHrosMFp.js";
import "../../agent-scope-CHWijfCI.js";
import "../../boundary-path-BVHzCDEE.js";
import "../../boundary-file-read-1knRHcS0.js";
import "../../logger-BiD_FF0f.js";
import "../../exec-CxOzjJqc.js";
import "../../workspace-Myqh-waV.js";
import "../../registry-bBUk5Kld.js";
import "../../zod-schema.core-CsOaEAxi.js";
import "../../resolve-route-BZQmiwMs.js";
import "../../config-schema-DwLf-YhC.js";
import { et as resolveOllamaApiBase, tt as OLLAMA_DEFAULT_BASE_URL } from "../../provider-models-B4BOY8WM.js";
import "../../provider-onboard-BjiAI9qS.js";
import "../../secret-file-BMXXBYEf.js";
import { i as definePluginEntry } from "../../core-flS61KKf.js";
import "../../delegate-CUDQZhom.js";
//#region extensions/ollama/index.ts
const PROVIDER_ID = "ollama";
const DEFAULT_API_KEY = "ollama-local";
async function loadProviderSetup() {
	return await import("../../plugin-sdk/ollama-setup.js");
}
var ollama_default = definePluginEntry({
	id: "ollama",
	name: "Ollama Provider",
	description: "Bundled Ollama provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "Ollama",
			docsPath: "/providers/ollama",
			envVars: ["OLLAMA_API_KEY"],
			auth: [{
				id: "local",
				label: "Ollama",
				hint: "Cloud and local open models",
				kind: "custom",
				run: async (ctx) => {
					const result = await (await loadProviderSetup()).promptAndConfigureOllama({
						cfg: ctx.config,
						prompter: ctx.prompter
					});
					return {
						profiles: [{
							profileId: "ollama:default",
							credential: {
								type: "api_key",
								provider: PROVIDER_ID,
								key: DEFAULT_API_KEY
							}
						}],
						configPatch: result.config,
						defaultModel: `ollama/${result.defaultModelId}`
					};
				},
				runNonInteractive: async (ctx) => {
					return await (await loadProviderSetup()).configureOllamaNonInteractive({
						nextConfig: ctx.config,
						opts: ctx.opts,
						runtime: ctx.runtime
					});
				}
			}],
			discovery: {
				order: "late",
				run: async (ctx) => {
					const explicit = ctx.config.models?.providers?.ollama;
					const hasExplicitModels = Array.isArray(explicit?.models) && explicit.models.length > 0;
					const ollamaKey = ctx.resolveProviderApiKey(PROVIDER_ID).apiKey;
					if (hasExplicitModels && explicit) return { provider: {
						...explicit,
						baseUrl: typeof explicit.baseUrl === "string" && explicit.baseUrl.trim() ? resolveOllamaApiBase(explicit.baseUrl) : OLLAMA_DEFAULT_BASE_URL,
						api: explicit.api ?? "ollama",
						apiKey: ollamaKey ?? explicit.apiKey ?? DEFAULT_API_KEY
					} };
					const provider = await (await loadProviderSetup()).buildOllamaProvider(explicit?.baseUrl, { quiet: !ollamaKey && !explicit });
					if (provider.models.length === 0 && !ollamaKey && !explicit?.apiKey) return null;
					return { provider: {
						...provider,
						apiKey: ollamaKey ?? explicit?.apiKey ?? DEFAULT_API_KEY
					} };
				}
			},
			wizard: {
				setup: {
					choiceId: "ollama",
					choiceLabel: "Ollama",
					choiceHint: "Cloud and local open models",
					groupId: "ollama",
					groupLabel: "Ollama",
					groupHint: "Cloud and local open models",
					methodId: "local"
				},
				modelPicker: {
					label: "Ollama (custom)",
					hint: "Detect models from a local or remote Ollama instance",
					methodId: "local"
				}
			},
			onModelSelected: async ({ config, model, prompter }) => {
				if (!model.startsWith("ollama/")) return;
				await (await loadProviderSetup()).ensureOllamaModelPulled({
					config,
					prompter
				});
			}
		});
	}
});
//#endregion
export { ollama_default as default };
