import "../logger-XBPi1AwR.js";
import "../paths-C7DNYmnN.js";
import "../tmp-wormagent-dir-DiDbPUEX.js";
import "../theme-CLg7QWJt.js";
import "../globals-B9nPdA7s.js";
import "../runtime-BNNetENg.js";
import "../ansi-cwY8Vrne.js";
import "../subsystem-DFHXIqzU.js";
import "../utils-1TVTmhOV.js";
import { t as formatDocsLink } from "../links-B85QumIb.js";
import "../agent-scope-CHWijfCI.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-B0Ci-_gE.js";
import "../boundary-path-BVHzCDEE.js";
import "../boundary-file-read-1knRHcS0.js";
import "../logger-BiD_FF0f.js";
import "../exec-CxOzjJqc.js";
import "../workspace-Myqh-waV.js";
import "../registry-bBUk5Kld.js";
import { m as MarkdownConfigSchema } from "../zod-schema.core-CsOaEAxi.js";
import "../registry-BQSOw8NA.js";
import "../plugins-IaWBZ3jI.js";
import { t as emptyPluginConfigSchema } from "../config-schema-DIwfYn-6.js";
import { r as buildChannelConfigSchema } from "../config-schema-DwLf-YhC.js";
import { n as createReplyPrefixOptions } from "../reply-prefix-DdgB5T3_.js";
import { n as createOptionalChannelSetupWizard, t as createOptionalChannelSetupAdapter } from "../optional-channel-setup-BByU9TX_.js";
//#region src/plugin-sdk/twitch.ts
const twitchSetupAdapter = createOptionalChannelSetupAdapter({
	channel: "twitch",
	label: "Twitch",
	npmSpec: "@wormagent/twitch"
});
const twitchSetupWizard = createOptionalChannelSetupWizard({
	channel: "twitch",
	label: "Twitch",
	npmSpec: "@wormagent/twitch"
});
//#endregion
export { DEFAULT_ACCOUNT_ID, MarkdownConfigSchema, buildChannelConfigSchema, createReplyPrefixOptions, emptyPluginConfigSchema, formatDocsLink, normalizeAccountId, twitchSetupAdapter, twitchSetupWizard };
