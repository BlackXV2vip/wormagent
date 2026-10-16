import "../../logger-XBPi1AwR.js";
import "../../paths-C7DNYmnN.js";
import "../../tmp-wormagent-dir-DiDbPUEX.js";
import "../../theme-CLg7QWJt.js";
import "../../globals-B9nPdA7s.js";
import "../../runtime-BNNetENg.js";
import "../../ansi-cwY8Vrne.js";
import { t as createSubsystemLogger } from "../../subsystem-DFHXIqzU.js";
import "../../boolean-BgLJTske.js";
import "../../utils-1TVTmhOV.js";
import "../../boundary-path-BVHzCDEE.js";
import "../../boundary-file-read-1knRHcS0.js";
import "../../logger-BiD_FF0f.js";
import "../../exec-CxOzjJqc.js";
import { f as filterBootstrapFilesForSession, m as loadExtraBootstrapFilesWithDiagnostics } from "../../workspace-Myqh-waV.js";
import "../../frontmatter-UZWcmlyv.js";
import { i as isAgentBootstrapEvent } from "../../internal-hooks-CL7jOg01.js";
import { n as resolveHookConfig } from "../../config-Dd2FpBQI.js";
//#region src/hooks/bundled/bootstrap-extra-files/handler.ts
const HOOK_KEY = "bootstrap-extra-files";
const log = createSubsystemLogger("bootstrap-extra-files");
function normalizeStringArray(value) {
	if (!Array.isArray(value)) return [];
	return value.map((v) => typeof v === "string" ? v.trim() : "").filter(Boolean);
}
function resolveExtraBootstrapPatterns(hookConfig) {
	const fromPaths = normalizeStringArray(hookConfig.paths);
	if (fromPaths.length > 0) return fromPaths;
	const fromPatterns = normalizeStringArray(hookConfig.patterns);
	if (fromPatterns.length > 0) return fromPatterns;
	return normalizeStringArray(hookConfig.files);
}
const bootstrapExtraFilesHook = async (event) => {
	if (!isAgentBootstrapEvent(event)) return;
	const context = event.context;
	const hookConfig = resolveHookConfig(context.cfg, HOOK_KEY);
	if (!hookConfig || hookConfig.enabled === false) return;
	const patterns = resolveExtraBootstrapPatterns(hookConfig);
	if (patterns.length === 0) return;
	try {
		const { files: extras, diagnostics } = await loadExtraBootstrapFilesWithDiagnostics(context.workspaceDir, patterns);
		if (diagnostics.length > 0) log.debug("skipped extra bootstrap candidates", {
			skipped: diagnostics.length,
			reasons: diagnostics.reduce((counts, item) => {
				counts[item.reason] = (counts[item.reason] ?? 0) + 1;
				return counts;
			}, {})
		});
		if (extras.length === 0) return;
		context.bootstrapFiles = filterBootstrapFilesForSession([...context.bootstrapFiles, ...extras], context.sessionKey);
	} catch (err) {
		log.warn(`failed: ${String(err)}`);
	}
};
//#endregion
export { bootstrapExtraFilesHook as default };
