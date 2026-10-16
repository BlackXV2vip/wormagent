import { i as createScopedChannelConfigAdapter } from "./channel-config-helpers-Cw--QYL9.js";
import { i as resolveLineAccount, r as resolveDefaultLineAccountId, t as listLineAccountIds } from "./accounts-Bkx5CLDH.js";
//#region extensions/line/src/config-adapter.ts
function normalizeLineAllowFrom(entry) {
	return entry.replace(/^line:(?:user:)?/i, "");
}
const lineConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "line",
	listAccountIds: listLineAccountIds,
	resolveAccount: (cfg, accountId) => resolveLineAccount({
		cfg,
		accountId: accountId ?? void 0
	}),
	defaultAccountId: resolveDefaultLineAccountId,
	clearBaseFields: [
		"channelSecret",
		"tokenFile",
		"secretFile"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => allowFrom.map((entry) => String(entry).trim()).filter(Boolean).map(normalizeLineAllowFrom)
});
//#endregion
export { lineConfigAdapter as t };
