import "./redact-DJH_TKCK.js";
import "./errors-Cn8_L7ES.js";
import { n as defaultRuntime } from "./runtime-BNNetENg.js";
import { n as runCommandWithRuntime } from "./cli-utils-DUWx0Fkc.js";
//#region src/cli/program/register.wallet.ts
function registerWalletCommand(program) {
	program.command("wallet").description("Show Solana wallet balance and link to Solscan").argument("[address]", "Solana wallet address (defaults to WORMAGENT_SOLANA_WALLET)").action(async (address) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await (await import("./wallet-y29t9IF1.js")).walletCommand({ address }, defaultRuntime);
		});
	});
}
//#endregion
export { registerWalletCommand };
