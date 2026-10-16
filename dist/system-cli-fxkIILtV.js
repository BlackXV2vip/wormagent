import "./logger-XBPi1AwR.js";
import "./paths-C7DNYmnN.js";
import "./tmp-wormagent-dir-DiDbPUEX.js";
import { r as theme } from "./theme-CLg7QWJt.js";
import { t as danger } from "./globals-B9nPdA7s.js";
import { n as defaultRuntime } from "./runtime-BNNetENg.js";
import "./ansi-cwY8Vrne.js";
import "./subsystem-DFHXIqzU.js";
import "./boolean-BgLJTske.js";
import "./env-Be02FVK-.js";
import "./utils-1TVTmhOV.js";
import { t as formatDocsLink } from "./links-B85QumIb.js";
import "./model-selection-xHrosMFp.js";
import "./agent-scope-CHWijfCI.js";
import "./boundary-path-BVHzCDEE.js";
import "./boundary-file-read-1knRHcS0.js";
import "./logger-BiD_FF0f.js";
import "./exec-CxOzjJqc.js";
import "./workspace-Myqh-waV.js";
import "./io-YZE2RiMe.js";
import "./host-env-security-CCNk6EJM.js";
import "./safe-text-Dxbm1Igw.js";
import "./version-_SOgQUeP.js";
import "./env-substitution-BZkRzVGn.js";
import "./config-state-DKm2UeRW.js";
import "./includes-teQjnFwJ.js";
import "./zod-schema.providers-core-Doq9WIkR.js";
import "./registry-bBUk5Kld.js";
import "./manifest-registry-y-alnJW5.js";
import "./ip-COVlKUC6.js";
import "./zod-schema.core-CsOaEAxi.js";
import "./config-7FuWRYMm.js";
import "./audit-fs-Buf1uArq.js";
import "./resolve-Dg7zR13M.js";
import "./tailnet-CWBZAA8A.js";
import "./net-BuZcN9Km.js";
import "./credentials-B7J9NCZ_.js";
import "./message-channel-Bm_qBhbO.js";
import "./method-scopes-lG3AZXbp.js";
import "./call-C2xL1JvZ.js";
import "./progress-BK11iG4t.js";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-DEa0dHbi.js";
//#region src/cli/system-cli.ts
const normalizeWakeMode = (raw) => {
	const mode = typeof raw === "string" ? raw.trim() : "";
	if (!mode) return "next-heartbeat";
	if (mode === "now" || mode === "next-heartbeat") return mode;
	throw new Error("--mode must be now or next-heartbeat");
};
async function runSystemGatewayCommand(opts, action, successText) {
	try {
		const result = await action();
		if (opts.json || successText === void 0) defaultRuntime.log(JSON.stringify(result, null, 2));
		else defaultRuntime.log(successText);
	} catch (err) {
		defaultRuntime.error(danger(String(err)));
		defaultRuntime.exit(1);
	}
}
function registerSystemCli(program) {
	const system = program.command("system").description("System tools (events, heartbeat, presence)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/system", "docs.wormagent.ai/cli/system")}\n`);
	addGatewayClientOptions(system.command("event").description("Enqueue a system event and optionally trigger a heartbeat").requiredOption("--text <text>", "System event text").option("--mode <mode>", "Wake mode (now|next-heartbeat)", "next-heartbeat").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			const text = typeof opts.text === "string" ? opts.text.trim() : "";
			if (!text) throw new Error("--text is required");
			return await callGatewayFromCli("wake", opts, {
				mode: normalizeWakeMode(opts.mode),
				text
			}, { expectFinal: false });
		}, "ok");
	});
	const heartbeat = system.command("heartbeat").description("Heartbeat controls");
	addGatewayClientOptions(heartbeat.command("last").description("Show the last heartbeat event").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("last-heartbeat", opts, void 0, { expectFinal: false });
		});
	});
	addGatewayClientOptions(heartbeat.command("enable").description("Enable heartbeats").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("set-heartbeats", opts, { enabled: true }, { expectFinal: false });
		});
	});
	addGatewayClientOptions(heartbeat.command("disable").description("Disable heartbeats").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("set-heartbeats", opts, { enabled: false }, { expectFinal: false });
		});
	});
	addGatewayClientOptions(system.command("presence").description("List system presence entries").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("system-presence", opts, void 0, { expectFinal: false });
		});
	});
}
//#endregion
export { registerSystemCli };
