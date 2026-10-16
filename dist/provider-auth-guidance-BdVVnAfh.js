import { an as resolvePluginProviders } from "./auth-profiles-DHKWTcix.js";
import { w as normalizeProviderId } from "./model-selection-xHrosMFp.js";
import { t as formatCliCommand } from "./command-format-RWUdRF1N.js";
//#region src/commands/provider-auth-guidance.ts
function matchesProviderId(candidate, providerId) {
	const normalized = normalizeProviderId(providerId);
	if (!normalized) return false;
	if (normalizeProviderId(candidate.id) === normalized) return true;
	return (candidate.aliases ?? []).some((alias) => normalizeProviderId(alias) === normalized);
}
function resolveProviderAuthLoginCommand(params) {
	const provider = resolvePluginProviders({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		bundledProviderAllowlistCompat: true,
		bundledProviderVitestCompat: true
	}).find((candidate) => matchesProviderId(candidate, params.provider));
	if (!provider || provider.auth.length === 0) return;
	return formatCliCommand(`wormagent models auth login --provider ${provider.id}`);
}
function buildProviderAuthRecoveryHint(params) {
	const loginCommand = resolveProviderAuthLoginCommand(params);
	const parts = [];
	if (loginCommand) parts.push(`Run \`${loginCommand}\``);
	if (params.includeConfigure !== false) parts.push(`\`${formatCliCommand("wormagent configure")}\``);
	if (params.includeEnvVar) parts.push("set an API key env var");
	if (parts.length === 0) return `Run \`${formatCliCommand("wormagent configure")}\`.`;
	if (parts.length === 1) return `${parts[0]}.`;
	if (parts.length === 2) return `${parts[0]} or ${parts[1]}.`;
	return `${parts[0]}, ${parts[1]}, or ${parts[2]}.`;
}
//#endregion
export { resolveProviderAuthLoginCommand as n, buildProviderAuthRecoveryHint as t };
