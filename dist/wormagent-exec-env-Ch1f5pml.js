//#region src/infra/wormagent-exec-env.ts
const WORMAGENT_CLI_ENV_VAR = "WORMAGENT_CLI";
function markWormAgentExecEnv(env) {
	return {
		...env,
		[WORMAGENT_CLI_ENV_VAR]: "1"
	};
}
function ensureWormAgentExecMarkerOnProcess(env = process.env) {
	env[WORMAGENT_CLI_ENV_VAR] = "1";
	return env;
}
//#endregion
export { markWormAgentExecEnv as n, ensureWormAgentExecMarkerOnProcess as t };
