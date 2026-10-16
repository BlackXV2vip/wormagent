import { n as markWormAgentExecEnv } from "./wormagent-exec-env-Ch1f5pml.js";
//#region src/infra/host-env-security-policy.json
var host_env_security_policy_default = {
	blockedKeys: [
		"NODE_OPTIONS",
		"NODE_PATH",
		"PYTHONHOME",
		"PYTHONPATH",
		"PERL5LIB",
		"PERL5OPT",
		"RUBYLIB",
		"RUBYOPT",
		"BASH_ENV",
		"ENV",
		"GIT_EXTERNAL_DIFF",
		"GIT_EXEC_PATH",
		"SHELL",
		"SHELLOPTS",
		"PS4",
		"GCONV_PATH",
		"IFS",
		"SSLKEYLOGFILE",
		"JAVA_TOOL_OPTIONS",
		"_JAVA_OPTIONS",
		"JDK_JAVA_OPTIONS",
		"PYTHONBREAKPOINT",
		"DOTNET_STARTUP_HOOKS",
		"DOTNET_ADDITIONAL_DEPS",
		"GLIBC_TUNABLES",
		"MAVEN_OPTS",
		"SBT_OPTS",
		"GRADLE_OPTS",
		"ANT_OPTS"
	],
	blockedOverrideKeys: [
		"HOME",
		"GRADLE_USER_HOME",
		"ZDOTDIR",
		"GIT_SSH_COMMAND",
		"GIT_SSH",
		"GIT_PROXY_COMMAND",
		"GIT_ASKPASS",
		"SSH_ASKPASS",
		"LESSOPEN",
		"LESSCLOSE",
		"PAGER",
		"MANPAGER",
		"GIT_PAGER",
		"EDITOR",
		"VISUAL",
		"FCEDIT",
		"SUDO_EDITOR",
		"PROMPT_COMMAND",
		"HISTFILE",
		"PERL5DB",
		"PERL5DBCMD",
		"OPENSSL_CONF",
		"OPENSSL_ENGINES",
		"PYTHONSTARTUP",
		"WGETRC",
		"CURL_HOME"
	],
	blockedOverridePrefixes: ["GIT_CONFIG_", "NPM_CONFIG_"],
	blockedPrefixes: [
		"DYLD_",
		"LD_",
		"BASH_FUNC_"
	]
};
//#endregion
//#region src/infra/host-env-security.ts
const PORTABLE_ENV_VAR_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;
const HOST_ENV_SECURITY_POLICY = host_env_security_policy_default;
const HOST_DANGEROUS_ENV_KEY_VALUES = Object.freeze(HOST_ENV_SECURITY_POLICY.blockedKeys.map((key) => key.toUpperCase()));
const HOST_DANGEROUS_ENV_PREFIXES = Object.freeze(HOST_ENV_SECURITY_POLICY.blockedPrefixes.map((prefix) => prefix.toUpperCase()));
const HOST_DANGEROUS_OVERRIDE_ENV_KEY_VALUES = Object.freeze((HOST_ENV_SECURITY_POLICY.blockedOverrideKeys ?? []).map((key) => key.toUpperCase()));
const HOST_DANGEROUS_OVERRIDE_ENV_PREFIXES = Object.freeze((HOST_ENV_SECURITY_POLICY.blockedOverridePrefixes ?? []).map((prefix) => prefix.toUpperCase()));
const HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEY_VALUES = Object.freeze([
	"TERM",
	"LANG",
	"LC_ALL",
	"LC_CTYPE",
	"LC_MESSAGES",
	"COLORTERM",
	"NO_COLOR",
	"FORCE_COLOR"
]);
const HOST_DANGEROUS_ENV_KEYS = new Set(HOST_DANGEROUS_ENV_KEY_VALUES);
const HOST_DANGEROUS_OVERRIDE_ENV_KEYS = new Set(HOST_DANGEROUS_OVERRIDE_ENV_KEY_VALUES);
const HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEYS = new Set(HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEY_VALUES);
function normalizeEnvVarKey(rawKey, options) {
	const key = rawKey.trim();
	if (!key) return null;
	if (options?.portable && !PORTABLE_ENV_VAR_KEY.test(key)) return null;
	return key;
}
function isDangerousHostEnvVarName(rawKey) {
	const key = normalizeEnvVarKey(rawKey);
	if (!key) return false;
	const upper = key.toUpperCase();
	if (HOST_DANGEROUS_ENV_KEYS.has(upper)) return true;
	return HOST_DANGEROUS_ENV_PREFIXES.some((prefix) => upper.startsWith(prefix));
}
function isDangerousHostEnvOverrideVarName(rawKey) {
	const key = normalizeEnvVarKey(rawKey);
	if (!key) return false;
	const upper = key.toUpperCase();
	if (HOST_DANGEROUS_OVERRIDE_ENV_KEYS.has(upper)) return true;
	return HOST_DANGEROUS_OVERRIDE_ENV_PREFIXES.some((prefix) => upper.startsWith(prefix));
}
function listNormalizedPortableEnvEntries(source) {
	const entries = [];
	for (const [rawKey, value] of Object.entries(source)) {
		if (typeof value !== "string") continue;
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key) continue;
		entries.push([key, value]);
	}
	return entries;
}
function sanitizeHostExecEnv(params) {
	const baseEnv = params?.baseEnv ?? process.env;
	const overrides = params?.overrides ?? void 0;
	const blockPathOverrides = params?.blockPathOverrides ?? true;
	const merged = {};
	for (const [key, value] of listNormalizedPortableEnvEntries(baseEnv)) {
		if (isDangerousHostEnvVarName(key)) continue;
		merged[key] = value;
	}
	if (!overrides) return markWormAgentExecEnv(merged);
	for (const [key, value] of listNormalizedPortableEnvEntries(overrides)) {
		const upper = key.toUpperCase();
		if (blockPathOverrides && upper === "PATH") continue;
		if (isDangerousHostEnvVarName(upper) || isDangerousHostEnvOverrideVarName(upper)) continue;
		merged[key] = value;
	}
	return markWormAgentExecEnv(merged);
}
function sanitizeSystemRunEnvOverrides(params) {
	const overrides = params?.overrides ?? void 0;
	if (!overrides) return;
	if (!params?.shellWrapper) return overrides;
	const filtered = {};
	for (const [key, value] of listNormalizedPortableEnvEntries(overrides)) {
		if (!HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEYS.has(key.toUpperCase())) continue;
		filtered[key] = value;
	}
	return Object.keys(filtered).length > 0 ? filtered : void 0;
}
//#endregion
export { sanitizeSystemRunEnvOverrides as a, sanitizeHostExecEnv as i, isDangerousHostEnvVarName as n, normalizeEnvVarKey as r, isDangerousHostEnvOverrideVarName as t };
