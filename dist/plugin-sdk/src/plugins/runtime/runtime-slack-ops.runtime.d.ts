import { listSlackDirectoryGroupsLive as listSlackDirectoryGroupsLiveImpl, listSlackDirectoryPeersLive as listSlackDirectoryPeersLiveImpl } from "wormagent/plugin-sdk/slack";
import { monitorSlackProvider as monitorSlackProviderImpl } from "wormagent/plugin-sdk/slack";
import { probeSlack as probeSlackImpl } from "wormagent/plugin-sdk/slack";
import { resolveSlackChannelAllowlist as resolveSlackChannelAllowlistImpl } from "wormagent/plugin-sdk/slack";
import { resolveSlackUserAllowlist as resolveSlackUserAllowlistImpl } from "wormagent/plugin-sdk/slack";
import { sendMessageSlack as sendMessageSlackImpl } from "wormagent/plugin-sdk/slack";
import { handleSlackAction as handleSlackActionImpl } from "wormagent/plugin-sdk/slack";
export declare const runtimeSlackOps: {
    listDirectoryGroupsLive: typeof listSlackDirectoryGroupsLiveImpl;
    listDirectoryPeersLive: typeof listSlackDirectoryPeersLiveImpl;
    probeSlack: typeof probeSlackImpl;
    resolveChannelAllowlist: typeof resolveSlackChannelAllowlistImpl;
    resolveUserAllowlist: typeof resolveSlackUserAllowlistImpl;
    sendMessageSlack: typeof sendMessageSlackImpl;
    monitorSlackProvider: typeof monitorSlackProviderImpl;
    handleSlackAction: typeof handleSlackActionImpl;
};
