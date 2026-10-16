import { r as runPassiveAccountLifecycle } from "./channel-lifecycle-BMj33IhG.js";
import { t as createLoggerBackedRuntime } from "./runtime-tiDlnvmJ.js";
//#region extensions/shared/passive-monitor.ts
async function runStoppablePassiveMonitor(params) {
	await runPassiveAccountLifecycle({
		abortSignal: params.abortSignal,
		start: params.start,
		stop: async (monitor) => {
			monitor.stop();
		}
	});
}
//#endregion
//#region extensions/shared/runtime.ts
function resolveLoggerBackedRuntime(runtime, logger) {
	return runtime ?? createLoggerBackedRuntime({
		logger,
		exitError: () => /* @__PURE__ */ new Error("Runtime exit not available")
	});
}
//#endregion
export { runStoppablePassiveMonitor as n, resolveLoggerBackedRuntime as t };
