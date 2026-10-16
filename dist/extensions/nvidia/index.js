import "../../logger-XBPi1AwR.js";
import "../../paths-C7DNYmnN.js";
import "../../tmp-wormagent-dir-DiDbPUEX.js";
import "../../theme-CLg7QWJt.js";
import "../../globals-B9nPdA7s.js";
import "../../runtime-BNNetENg.js";
import "../../ansi-cwY8Vrne.js";
import "../../subsystem-DFHXIqzU.js";
import "../../utils-1TVTmhOV.js";
import "../../agent-scope-CHWijfCI.js";
import "../../boundary-path-BVHzCDEE.js";
import "../../boundary-file-read-1knRHcS0.js";
import "../../logger-BiD_FF0f.js";
import "../../exec-CxOzjJqc.js";
import "../../workspace-Myqh-waV.js";
import "../../registry-bBUk5Kld.js";
import "../../zod-schema.core-CsOaEAxi.js";
import "../../resolve-route-BZQmiwMs.js";
import { n as buildSingleProviderApiKeyCatalog } from "../../provider-catalog-DNfn99P6.js";
import "../../config-schema-DwLf-YhC.js";
import { t as buildNvidiaProvider } from "../../provider-catalog-4FXZefu9.js";
import "../../secret-file-BMXXBYEf.js";
import { i as definePluginEntry } from "../../core-flS61KKf.js";
import "../../delegate-CUDQZhom.js";
//#region extensions/nvidia/index.ts
const PROVIDER_ID = "nvidia";
var nvidia_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "NVIDIA Provider",
	description: "Bundled NVIDIA provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "NVIDIA",
			docsPath: "/providers/nvidia",
			envVars: ["NVIDIA_API_KEY"],
			auth: [],
			catalog: {
				order: "simple",
				run: (ctx) => buildSingleProviderApiKeyCatalog({
					ctx,
					providerId: PROVIDER_ID,
					buildProvider: buildNvidiaProvider
				})
			}
		});
	}
});
//#endregion
export { nvidia_default as default };
