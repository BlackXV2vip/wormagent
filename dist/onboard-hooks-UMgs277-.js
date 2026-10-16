import "./logger-XBPi1AwR.js";
import "./paths-C7DNYmnN.js";
import "./tmp-wormagent-dir-DiDbPUEX.js";
import "./theme-CLg7QWJt.js";
import "./globals-B9nPdA7s.js";
import "./runtime-BNNetENg.js";
import "./ansi-cwY8Vrne.js";
import "./subsystem-DFHXIqzU.js";
import "./boolean-BgLJTske.js";
import "./utils-1TVTmhOV.js";
import { m as resolveDefaultAgentId, p as resolveAgentWorkspaceDir } from "./agent-scope-CHWijfCI.js";
import "./boundary-path-BVHzCDEE.js";
import "./boundary-file-read-1knRHcS0.js";
import "./logger-BiD_FF0f.js";
import "./exec-CxOzjJqc.js";
import "./workspace-Myqh-waV.js";
import "./config-state-DKm2UeRW.js";
import "./registry-bBUk5Kld.js";
import "./manifest-registry-y-alnJW5.js";
import { t as formatCliCommand } from "./command-format-RWUdRF1N.js";
import "./frontmatter-UZWcmlyv.js";
import "./config-Dd2FpBQI.js";
import "./workspace-DA3oxE7a.js";
import { t as buildWorkspaceHookStatus } from "./hooks-status--Bds5jN8.js";
//#region src/commands/onboard-hooks.ts
async function setupInternalHooks(cfg, runtime, prompter) {
	await prompter.note([
		"Hooks let you automate actions when agent commands are issued.",
		"Example: Save session context to memory when you issue /new or /reset.",
		"",
		"Learn more: https://docs.wormagent.ai/automation/hooks"
	].join("\n"), "Hooks");
	const eligibleHooks = buildWorkspaceHookStatus(resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)), { config: cfg }).hooks.filter((h) => h.eligible);
	if (eligibleHooks.length === 0) {
		await prompter.note("No eligible hooks found. You can configure hooks later in your config.", "No Hooks Available");
		return cfg;
	}
	const selected = (await prompter.multiselect({
		message: "Enable hooks?",
		options: [{
			value: "__skip__",
			label: "Skip for now"
		}, ...eligibleHooks.map((hook) => ({
			value: hook.name,
			label: `${hook.emoji ?? "🔗"} ${hook.name}`,
			hint: hook.description
		}))]
	})).filter((name) => name !== "__skip__");
	if (selected.length === 0) return cfg;
	const entries = { ...cfg.hooks?.internal?.entries };
	for (const name of selected) entries[name] = { enabled: true };
	const next = {
		...cfg,
		hooks: {
			...cfg.hooks,
			internal: {
				enabled: true,
				entries
			}
		}
	};
	await prompter.note([
		`Enabled ${selected.length} hook${selected.length > 1 ? "s" : ""}: ${selected.join(", ")}`,
		"",
		"You can manage hooks later with:",
		`  ${formatCliCommand("wormagent hooks list")}`,
		`  ${formatCliCommand("wormagent hooks enable <name>")}`,
		`  ${formatCliCommand("wormagent hooks disable <name>")}`
	].join("\n"), "Hooks Configured");
	return next;
}
//#endregion
export { setupInternalHooks };
