import "./redact-DJH_TKCK.js";
import "./errors-Cn8_L7ES.js";
import "./logger-XBPi1AwR.js";
import "./paths-C7DNYmnN.js";
import "./tmp-wormagent-dir-DiDbPUEX.js";
import "./theme-CLg7QWJt.js";
import "./globals-B9nPdA7s.js";
import "./runtime-BNNetENg.js";
import "./ansi-cwY8Vrne.js";
import { t as createSubsystemLogger } from "./subsystem-DFHXIqzU.js";
import "./boolean-BgLJTske.js";
import "./env-Be02FVK-.js";
import "./utils-1TVTmhOV.js";
import "./model-selection-xHrosMFp.js";
import "./agent-scope-CHWijfCI.js";
import "./boundary-path-BVHzCDEE.js";
import "./boundary-file-read-1knRHcS0.js";
import "./logger-BiD_FF0f.js";
import "./exec-CxOzjJqc.js";
import "./workspace-Myqh-waV.js";
import { s as loadConfig } from "./io-YZE2RiMe.js";
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
import { n as resolveBrowserConfig } from "./config-C_3ailRp.js";
import "./tailnet-CWBZAA8A.js";
import "./net-BuZcN9Km.js";
import "./credentials-B7J9NCZ_.js";
import { $ as ensureBrowserControlAuth, b as createBrowserRouteContext, et as resolveBrowserControlAuth, t as registerBrowserRoutes, v as createBrowserRuntimeState, y as stopBrowserRuntime } from "./routes-CwV_Ns-U.js";
import "./path-alias-guards-DXmUfTMe.js";
import "./ports-BN4dH8YE.js";
import "./ports-lsof-JVxCQ4Nm.js";
import "./ssrf-Vqx-4LMX.js";
import "./fs-safe-DiYYv8GT.js";
import "./mime-BwxJ13J4.js";
import "./image-ops-C9c8fw9g.js";
import { n as installBrowserCommonMiddleware, t as installBrowserAuthMiddleware } from "./server-middleware-n5zO65Ls.js";
import express from "express";
//#region src/browser/server.ts
let state = null;
const logServer = createSubsystemLogger("browser").child("server");
async function startBrowserControlServerFromConfig() {
	if (state) return state;
	const cfg = loadConfig();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	if (!resolved.enabled) return null;
	let browserAuth = resolveBrowserControlAuth(cfg);
	let browserAuthBootstrapFailed = false;
	try {
		const ensured = await ensureBrowserControlAuth({ cfg });
		browserAuth = ensured.auth;
		if (ensured.generatedToken) logServer.info("No browser auth configured; generated gateway.auth.token automatically.");
	} catch (err) {
		logServer.warn(`failed to auto-configure browser auth: ${String(err)}`);
		browserAuthBootstrapFailed = true;
	}
	if (browserAuthBootstrapFailed && !browserAuth.token && !browserAuth.password) {
		logServer.error("browser control startup aborted: authentication bootstrap failed and no fallback auth is configured.");
		return null;
	}
	const app = express();
	installBrowserCommonMiddleware(app);
	installBrowserAuthMiddleware(app, browserAuth);
	registerBrowserRoutes(app, createBrowserRouteContext({
		getState: () => state,
		refreshConfigFromDisk: true
	}));
	const port = resolved.controlPort;
	const server = await new Promise((resolve, reject) => {
		const s = app.listen(port, "127.0.0.1", () => resolve(s));
		s.once("error", reject);
	}).catch((err) => {
		logServer.error(`wormagent browser server failed to bind 127.0.0.1:${port}: ${String(err)}`);
		return null;
	});
	if (!server) return null;
	state = await createBrowserRuntimeState({
		server,
		port,
		resolved,
		onWarn: (message) => logServer.warn(message)
	});
	const authMode = browserAuth.token ? "token" : browserAuth.password ? "password" : "off";
	logServer.info(`Browser control listening on http://127.0.0.1:${port}/ (auth=${authMode})`);
	return state;
}
async function stopBrowserControlServer() {
	await stopBrowserRuntime({
		current: state,
		getState: () => state,
		clearState: () => {
			state = null;
		},
		closeServer: true,
		onWarn: (message) => logServer.warn(message)
	});
}
//#endregion
export { startBrowserControlServerFromConfig, stopBrowserControlServer };
