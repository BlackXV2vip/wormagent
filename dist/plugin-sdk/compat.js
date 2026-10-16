import "../logger-XBPi1AwR.js";
import "../paths-C7DNYmnN.js";
import "../tmp-wormagent-dir-DiDbPUEX.js";
import "../theme-CLg7QWJt.js";
import "../globals-B9nPdA7s.js";
import "../runtime-BNNetENg.js";
import "../ansi-cwY8Vrne.js";
import "../subsystem-DFHXIqzU.js";
import "../utils-1TVTmhOV.js";
import "../agent-scope-CHWijfCI.js";
import "../boundary-path-BVHzCDEE.js";
import "../boundary-file-read-1knRHcS0.js";
import "../logger-BiD_FF0f.js";
import "../exec-CxOzjJqc.js";
import "../workspace-Myqh-waV.js";
import "../registry-bBUk5Kld.js";
import { a as DmPolicySchema, c as GroupPolicySchema, m as MarkdownConfigSchema } from "../zod-schema.core-CsOaEAxi.js";
import "../file-lock-CHuPyOz3.js";
import "../registry-BQSOw8NA.js";
import "../plugins-IaWBZ3jI.js";
import { n as readStoreAllowFromForDmPolicy, o as resolveDmGroupAccessWithLists, s as resolveEffectiveAllowFromLists, t as DM_GROUP_ACCESS_REASON, u as resolveControlCommandGate } from "../dm-policy-shared-BXLQ8fpH.js";
import { _ as createOpenProviderConfiguredRouteWarningCollector, a as collectAllowlistProviderRestrictSendersWarnings, c as collectOpenGroupPolicyRouteAllowlistWarnings, d as createAllowlistProviderGroupPolicyWarningCollector, f as createAllowlistProviderOpenWarningCollector, g as createOpenGroupPolicyRestrictSendersWarningCollector, h as createConditionalWarningCollector, i as collectAllowlistProviderGroupPolicyWarnings, l as collectOpenProviderGroupPolicyWarnings, m as createAllowlistProviderRouteAllowlistWarningCollector, n as buildOpenGroupPolicyRestrictSendersWarning, p as createAllowlistProviderRestrictSendersWarningCollector, r as buildOpenGroupPolicyWarning, s as collectOpenGroupPolicyRestrictSendersWarnings, t as buildOpenGroupPolicyConfigureRouteAllowlistWarning, u as composeWarningCollectors, v as createOpenProviderGroupPolicyWarningCollector, y as projectWarningCollector } from "../group-policy-warnings-CrQ_hLRZ.js";
import { t as buildAccountScopedDmSecurityPolicy } from "../helpers-B6WRZ2PN.js";
import { a as createScopedChannelConfigBase, c as createTopLevelChannelConfigBase, d as mapAllowFromEntries, i as createScopedChannelConfigAdapter, n as createHybridChannelConfigBase, o as createScopedDmSecurityResolver, r as createScopedAccountConfigAccessors, s as createTopLevelChannelConfigAdapter, t as createHybridChannelConfigAdapter } from "../channel-config-helpers-Cw--QYL9.js";
import { t as emptyPluginConfigSchema } from "../config-schema-DIwfYn-6.js";
import { i as buildNestedDmConfigSchema, n as buildCatchallMultiAccountChannelSchema, r as buildChannelConfigSchema, t as AllowFromListSchema } from "../config-schema-DwLf-YhC.js";
import { a as listDirectoryGroupEntriesFromMapKeysAndAllowFrom, c as listInspectedDirectoryEntriesFromSources, d as listResolvedDirectoryUserEntriesFromAllowFrom, f as toDirectoryEntries, i as listDirectoryGroupEntriesFromMapKeys, l as listResolvedDirectoryEntriesFromSources, n as collectNormalizedDirectoryIds, o as listDirectoryUserEntriesFromAllowFrom, r as listDirectoryEntriesFromSources, s as listDirectoryUserEntriesFromAllowFromAndMapKeys, t as applyDirectoryQueryAndLimit, u as listResolvedDirectoryGroupEntriesFromMapKeys } from "../directory-runtime-CPrvW_du.js";
import { t as inspectReadOnlyChannelAccount } from "../read-only-account-inspect-lZhE3Jkw.js";
import { i as resolveToolsBySender, n as resolveChannelGroupRequireMention, r as resolveChannelGroupToolsPolicy } from "../channel-policy-noB9JWHw.js";
import "../pairing-store-uFEb9soq.js";
import "../json-store-CCZGbA9l.js";
import { t as KeyedAsyncQueue } from "../keyed-async-queue-CFTneVAI.js";
import { t as delegateCompactionToRuntime } from "../delegate-CUDQZhom.js";
import { a as buildHistoryContext, c as buildPendingHistoryContextFromMap, d as evictOldHistoryKeys, f as recordPendingHistoryEntry, l as clearHistoryEntries, o as buildHistoryContextFromEntries, p as recordPendingHistoryEntryIfEnabled, s as buildHistoryContextFromMap, t as DEFAULT_GROUP_HISTORY_LIMIT, u as clearHistoryEntriesIfEnabled } from "../history-DrihGQ55.js";
import { n as formatNormalizedAllowFromEntries, t as formatAllowFromLowercase } from "../allow-from-BxX5ZYW6.js";
import { t as createPluginRuntimeStore } from "../runtime-store-B4NdUZHn.js";
import "../shared-ChdN1p0c.js";
import { t as createAccountStatusSink } from "../channel-lifecycle-BMj33IhG.js";
import "../channel-config-schema-DrUMMdOu.js";
import "../reply-history-DjgbzRlJ.js";
import { t as mapAllowlistResolutionInputs } from "../allowlist-resolution-BAntcNP0.js";
import { n as resolveBlueBubblesGroupRequireMention, r as resolveBlueBubblesGroupToolPolicy, t as collectBlueBubblesStatusIssues } from "../bluebubbles-DldvbtDR.js";
//#region src/plugin-sdk/compat.ts
if (process.env.VITEST !== "true" && process.env.WORMAGENT_SUPPRESS_PLUGIN_SDK_COMPAT_WARNING !== "1") process.emitWarning("wormagent/plugin-sdk/compat is deprecated for new plugins. Migrate to focused wormagent/plugin-sdk/<subpath> imports.", {
	code: "WORMAGENT_PLUGIN_SDK_COMPAT_DEPRECATED",
	detail: "Bundled plugins must use scoped plugin-sdk subpaths. External plugins may keep compat temporarily while migrating."
});
//#endregion
export { AllowFromListSchema, DEFAULT_GROUP_HISTORY_LIMIT, DM_GROUP_ACCESS_REASON, DmPolicySchema, GroupPolicySchema, KeyedAsyncQueue, MarkdownConfigSchema, applyDirectoryQueryAndLimit, buildAccountScopedDmSecurityPolicy, buildCatchallMultiAccountChannelSchema, buildChannelConfigSchema, buildHistoryContext, buildHistoryContextFromEntries, buildHistoryContextFromMap, buildNestedDmConfigSchema, buildOpenGroupPolicyConfigureRouteAllowlistWarning, buildOpenGroupPolicyRestrictSendersWarning, buildOpenGroupPolicyWarning, buildPendingHistoryContextFromMap, clearHistoryEntries, clearHistoryEntriesIfEnabled, collectAllowlistProviderGroupPolicyWarnings, collectAllowlistProviderRestrictSendersWarnings, collectBlueBubblesStatusIssues, collectNormalizedDirectoryIds, collectOpenGroupPolicyRestrictSendersWarnings, collectOpenGroupPolicyRouteAllowlistWarnings, collectOpenProviderGroupPolicyWarnings, composeWarningCollectors, createAccountStatusSink, createAllowlistProviderGroupPolicyWarningCollector, createAllowlistProviderOpenWarningCollector, createAllowlistProviderRestrictSendersWarningCollector, createAllowlistProviderRouteAllowlistWarningCollector, createConditionalWarningCollector, createHybridChannelConfigAdapter, createHybridChannelConfigBase, createOpenGroupPolicyRestrictSendersWarningCollector, createOpenProviderConfiguredRouteWarningCollector, createOpenProviderGroupPolicyWarningCollector, createPluginRuntimeStore, createScopedAccountConfigAccessors, createScopedChannelConfigAdapter, createScopedChannelConfigBase, createScopedDmSecurityResolver, createTopLevelChannelConfigAdapter, createTopLevelChannelConfigBase, delegateCompactionToRuntime, emptyPluginConfigSchema, evictOldHistoryKeys, formatAllowFromLowercase, formatNormalizedAllowFromEntries, inspectReadOnlyChannelAccount, listDirectoryEntriesFromSources, listDirectoryGroupEntriesFromMapKeys, listDirectoryGroupEntriesFromMapKeysAndAllowFrom, listDirectoryUserEntriesFromAllowFrom, listDirectoryUserEntriesFromAllowFromAndMapKeys, listInspectedDirectoryEntriesFromSources, listResolvedDirectoryEntriesFromSources, listResolvedDirectoryGroupEntriesFromMapKeys, listResolvedDirectoryUserEntriesFromAllowFrom, mapAllowFromEntries, mapAllowlistResolutionInputs, projectWarningCollector, readStoreAllowFromForDmPolicy, recordPendingHistoryEntry, recordPendingHistoryEntryIfEnabled, resolveBlueBubblesGroupRequireMention, resolveBlueBubblesGroupToolPolicy, resolveChannelGroupRequireMention, resolveChannelGroupToolsPolicy, resolveControlCommandGate, resolveDmGroupAccessWithLists, resolveEffectiveAllowFromLists, resolveToolsBySender, toDirectoryEntries };
