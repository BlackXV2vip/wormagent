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
import "../../config-schema-DwLf-YhC.js";
import "../../secret-file-BMXXBYEf.js";
import { i as definePluginEntry } from "../../core-flS61KKf.js";
import "../../delegate-CUDQZhom.js";
//#region extensions/memory-core/index.ts
var memory_core_default = definePluginEntry({
	id: "memory-core",
	name: "Memory (Core)",
	description: "File-backed memory search tools and CLI",
	kind: "memory",
	register(api) {
		api.registerTool((ctx) => {
			const memorySearchTool = api.runtime.tools.createMemorySearchTool({
				config: ctx.config,
				agentSessionKey: ctx.sessionKey
			});
			const memoryGetTool = api.runtime.tools.createMemoryGetTool({
				config: ctx.config,
				agentSessionKey: ctx.sessionKey
			});
			if (!memorySearchTool || !memoryGetTool) return null;
			return [memorySearchTool, memoryGetTool];
		}, { names: ["memory_search", "memory_get"] });
		api.registerCli(({ program }) => {
			api.runtime.tools.registerMemoryCli(program);
		}, { commands: ["memory"] });
	}
});
//#endregion
export { memory_core_default as default };
