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
import { a as resolveWindowsSpawnProgramCandidate, n as materializeWindowsSpawnProgram, t as applyWindowsSpawnProgramPolicy } from "../../windows-spawn-xraiFOsC.js";
import "../../resolve-route-BZQmiwMs.js";
import "../../config-schema-DwLf-YhC.js";
import "../../secret-file-BMXXBYEf.js";
import { i as definePluginEntry } from "../../core-flS61KKf.js";
import "../../delegate-CUDQZhom.js";
import "../../mustang-CHGcbg5M.js";
import path from "node:path";
import { spawn } from "node:child_process";
import { Type } from "@sinclair/typebox";
//#region extensions/mustang/src/windows-spawn.ts
function resolveWindowsMustangSpawn(execPath, argv, env) {
	const resolved = materializeWindowsSpawnProgram(applyWindowsSpawnProgramPolicy({
		candidate: resolveWindowsSpawnProgramCandidate({
			command: execPath,
			env,
			packageName: "mustang"
		}),
		allowShellFallback: false
	}), argv);
	if (resolved.shell) throw new Error("mustang wrapper resolved to shell fallback unexpectedly");
	return {
		command: resolved.command,
		argv: resolved.argv,
		windowsHide: resolved.windowsHide
	};
}
//#endregion
//#region extensions/mustang/src/mustang-tool.ts
function normalizeForCwdSandbox(p) {
	const normalized = path.normalize(p);
	return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}
function resolveCwd(cwdRaw) {
	if (typeof cwdRaw !== "string" || !cwdRaw.trim()) return process.cwd();
	const cwd = cwdRaw.trim();
	if (path.isAbsolute(cwd)) throw new Error("cwd must be a relative path");
	const base = process.cwd();
	const resolved = path.resolve(base, cwd);
	const rel = path.relative(normalizeForCwdSandbox(base), normalizeForCwdSandbox(resolved));
	if (rel === "" || rel === ".") return resolved;
	if (rel.startsWith("..") || path.isAbsolute(rel)) throw new Error("cwd must stay within the gateway working directory");
	return resolved;
}
async function runMustangSubprocessOnce(params) {
	const { execPath, argv, cwd } = params;
	const timeoutMs = Math.max(200, params.timeoutMs);
	const maxStdoutBytes = Math.max(1024, params.maxStdoutBytes);
	const env = {
		...process.env,
		MUSTANG_MODE: "tool"
	};
	if ((env.NODE_OPTIONS ?? "").includes("--inspect")) delete env.NODE_OPTIONS;
	const spawnTarget = process.platform === "win32" ? resolveWindowsMustangSpawn(execPath, argv, env) : {
		command: execPath,
		argv
	};
	return await new Promise((resolve, reject) => {
		const child = spawn(spawnTarget.command, spawnTarget.argv, {
			cwd,
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			env,
			windowsHide: spawnTarget.windowsHide
		});
		let stdout = "";
		let stdoutBytes = 0;
		let stderr = "";
		let settled = false;
		const settle = (result) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			if (result.ok) resolve(result.value);
			else reject(result.error);
		};
		const failAndTerminate = (message) => {
			try {
				child.kill("SIGKILL");
			} finally {
				settle({
					ok: false,
					error: new Error(message)
				});
			}
		};
		child.stdout?.setEncoding("utf8");
		child.stderr?.setEncoding("utf8");
		child.stdout?.on("data", (chunk) => {
			const str = String(chunk);
			stdoutBytes += Buffer.byteLength(str, "utf8");
			if (stdoutBytes > maxStdoutBytes) {
				failAndTerminate("mustang output exceeded maxStdoutBytes");
				return;
			}
			stdout += str;
		});
		child.stderr?.on("data", (chunk) => {
			stderr += String(chunk);
		});
		const timer = setTimeout(() => {
			failAndTerminate("mustang subprocess timed out");
		}, timeoutMs);
		child.once("error", (err) => {
			settle({
				ok: false,
				error: err
			});
		});
		child.once("exit", (code) => {
			if (code !== 0) {
				settle({
					ok: false,
					error: /* @__PURE__ */ new Error(`mustang failed (${code ?? "?"}): ${stderr.trim() || stdout.trim()}`)
				});
				return;
			}
			settle({
				ok: true,
				value: { stdout }
			});
		});
	});
}
function parseEnvelope(stdout) {
	const trimmed = stdout.trim();
	const tryParse = (input) => {
		try {
			return JSON.parse(input);
		} catch {
			return;
		}
	};
	let parsed = tryParse(trimmed);
	if (parsed === void 0) {
		const suffixMatch = trimmed.match(/({[\s\S]*}|\[[\s\S]*])\s*$/);
		if (suffixMatch?.[1]) parsed = tryParse(suffixMatch[1]);
	}
	if (parsed === void 0) throw new Error("mustang returned invalid JSON");
	if (!parsed || typeof parsed !== "object") throw new Error("mustang returned invalid JSON envelope");
	const ok = parsed.ok;
	if (ok === true || ok === false) return parsed;
	throw new Error("mustang returned invalid JSON envelope");
}
function buildMustangArgv(action, params) {
	if (action === "run") {
		const pipeline = typeof params.pipeline === "string" ? params.pipeline : "";
		if (!pipeline.trim()) throw new Error("pipeline required");
		const argv = [
			"run",
			"--mode",
			"tool",
			pipeline
		];
		const argsJson = typeof params.argsJson === "string" ? params.argsJson : "";
		if (argsJson.trim()) argv.push("--args-json", argsJson);
		return argv;
	}
	if (action === "resume") {
		const token = typeof params.token === "string" ? params.token : "";
		if (!token.trim()) throw new Error("token required");
		const approve = params.approve;
		if (typeof approve !== "boolean") throw new Error("approve required");
		return [
			"resume",
			"--token",
			token,
			"--approve",
			approve ? "yes" : "no"
		];
	}
	throw new Error(`Unknown action: ${action}`);
}
function createMustangTool(api) {
	return {
		name: "mustang",
		label: "Mustang Workflow",
		description: "Run Mustang pipelines as a local-first workflow runtime (typed JSON envelope + resumable approvals).",
		parameters: Type.Object({
			action: Type.Unsafe({
				type: "string",
				enum: ["run", "resume"]
			}),
			pipeline: Type.Optional(Type.String()),
			argsJson: Type.Optional(Type.String()),
			token: Type.Optional(Type.String()),
			approve: Type.Optional(Type.Boolean()),
			cwd: Type.Optional(Type.String({ description: "Relative working directory (optional). Must stay within the gateway working directory." })),
			timeoutMs: Type.Optional(Type.Number()),
			maxStdoutBytes: Type.Optional(Type.Number())
		}),
		async execute(_id, params) {
			const action = typeof params.action === "string" ? params.action.trim() : "";
			if (!action) throw new Error("action required");
			const execPath = "mustang";
			const cwd = resolveCwd(params.cwd);
			const timeoutMs = typeof params.timeoutMs === "number" ? params.timeoutMs : 2e4;
			const maxStdoutBytes = typeof params.maxStdoutBytes === "number" ? params.maxStdoutBytes : 512e3;
			const argv = buildMustangArgv(action, params);
			if (api.runtime?.version && api.logger?.debug) api.logger.debug(`mustang plugin runtime=${api.runtime.version}`);
			const { stdout } = await runMustangSubprocessOnce({
				execPath,
				argv,
				cwd,
				timeoutMs,
				maxStdoutBytes
			});
			const envelope = parseEnvelope(stdout);
			return {
				content: [{
					type: "text",
					text: JSON.stringify(envelope, null, 2)
				}],
				details: envelope
			};
		}
	};
}
//#endregion
//#region extensions/mustang/index.ts
var mustang_default = definePluginEntry({
	id: "mustang",
	name: "Mustang",
	description: "Optional local shell helper tools",
	register(api) {
		api.registerTool(((ctx) => {
			if (ctx.sandboxed) return null;
			return createMustangTool(api);
		}), { optional: true });
	}
});
//#endregion
export { mustang_default as default };
