import { n as defaultRuntime } from "./runtime-BNNetENg.js";
//#region src/utils/solana.ts
const LAMPORTS_PER_SOL = 1e9;
const MAINNET_RPC = "https://api.mainnet-beta.solana.com";
async function rpcCall(method, params) {
	const res = await fetch(MAINNET_RPC, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			method,
			params
		})
	});
	if (!res.ok) throw new Error(`Solana RPC error: ${res.status} ${res.statusText}`);
	const json = await res.json();
	if (json.error) throw new Error(`Solana RPC error: ${json.error.message}`);
	return json.result;
}
async function getSolBalance(address) {
	const result = await rpcCall("getBalance", [address]);
	return Math.round(result.value / LAMPORTS_PER_SOL * 1e6) / 1e6;
}
function shortenAddress(address) {
	if (address.length <= 12) return address;
	return `${address.slice(0, 8)}...${address.slice(-4)}`;
}
//#endregion
//#region src/commands/wallet/index.ts
async function walletCommand(opts, runtime = defaultRuntime) {
	const address = opts.address || process.env.WORMAGENT_SOLANA_WALLET;
	if (!address) {
		runtime.log("No wallet address provided.\nPass an address as an argument or set WORMAGENT_SOLANA_WALLET in your environment.\n  Example: wormagent wallet <address>");
		return;
	}
	const balance = await getSolBalance(address);
	const short = shortenAddress(address);
	const solscanUrl = `https://solscan.io/account/${address}`;
	runtime.log(`Wallet: ${short}`);
	runtime.log(`Balance: ${balance} SOL`);
	runtime.log(`Solscan: ${solscanUrl}`);
}
//#endregion
export { walletCommand };
