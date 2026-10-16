import "../logger-XBPi1AwR.js";
import "../paths-C7DNYmnN.js";
import "../tmp-wormagent-dir-DiDbPUEX.js";
import "../theme-CLg7QWJt.js";
import "../globals-B9nPdA7s.js";
import "../utils-1TVTmhOV.js";
import "../links-B85QumIb.js";
import { t as DEFAULT_ACCOUNT_ID } from "../account-id-B0Ci-_gE.js";
import "../registry-bBUk5Kld.js";
import "../ip-COVlKUC6.js";
import { m as MarkdownConfigSchema } from "../zod-schema.core-CsOaEAxi.js";
import { s as isBlockedHostnameOrIp } from "../ssrf-Vqx-4LMX.js";
import "../registry-BQSOw8NA.js";
import { n as formatPairingApproveHint } from "../helpers-B6WRZ2PN.js";
import { d as mapAllowFromEntries } from "../channel-config-helpers-Cw--QYL9.js";
import { t as emptyPluginConfigSchema } from "../config-schema-DIwfYn-6.js";
import { r as buildChannelConfigSchema } from "../config-schema-DwLf-YhC.js";
import { c as createDefaultChannelRuntimeState, s as collectStatusIssuesFromLastError } from "../status-helpers-IU0tygtP.js";
import { c as requestBodyErrorToText, o as readJsonBodyWithLimit } from "../http-body-DyHy2zKA.js";
import { n as createOptionalChannelSetupWizard, t as createOptionalChannelSetupAdapter } from "../optional-channel-setup-BByU9TX_.js";
import { r as createFixedWindowRateLimiter } from "../webhook-memory-guards-DExuBkvZ.js";
//#region src/plugin-sdk/nostr.ts
const nostrSetupAdapter = createOptionalChannelSetupAdapter({
	channel: "nostr",
	label: "Nostr",
	npmSpec: "@wormagent/nostr",
	docsPath: "/channels/nostr"
});
const nostrSetupWizard = createOptionalChannelSetupWizard({
	channel: "nostr",
	label: "Nostr",
	npmSpec: "@wormagent/nostr",
	docsPath: "/channels/nostr"
});
//#endregion
export { DEFAULT_ACCOUNT_ID, MarkdownConfigSchema, buildChannelConfigSchema, collectStatusIssuesFromLastError, createDefaultChannelRuntimeState, createFixedWindowRateLimiter, emptyPluginConfigSchema, formatPairingApproveHint, isBlockedHostnameOrIp, mapAllowFromEntries, nostrSetupAdapter, nostrSetupWizard, readJsonBodyWithLimit, requestBodyErrorToText };
