import { auditDiscordChannelPermissions as auditDiscordChannelPermissionsImpl } from "wormagent/plugin-sdk/discord";
import { listDiscordDirectoryGroupsLive as listDiscordDirectoryGroupsLiveImpl, listDiscordDirectoryPeersLive as listDiscordDirectoryPeersLiveImpl } from "wormagent/plugin-sdk/discord";
import { monitorDiscordProvider as monitorDiscordProviderImpl } from "wormagent/plugin-sdk/discord";
import { probeDiscord as probeDiscordImpl } from "wormagent/plugin-sdk/discord";
import { resolveDiscordChannelAllowlist as resolveDiscordChannelAllowlistImpl } from "wormagent/plugin-sdk/discord";
import { resolveDiscordUserAllowlist as resolveDiscordUserAllowlistImpl } from "wormagent/plugin-sdk/discord";
import { createThreadDiscord as createThreadDiscordImpl, deleteMessageDiscord as deleteMessageDiscordImpl, editChannelDiscord as editChannelDiscordImpl, editMessageDiscord as editMessageDiscordImpl, pinMessageDiscord as pinMessageDiscordImpl, sendDiscordComponentMessage as sendDiscordComponentMessageImpl, sendMessageDiscord as sendMessageDiscordImpl, sendPollDiscord as sendPollDiscordImpl, sendTypingDiscord as sendTypingDiscordImpl, unpinMessageDiscord as unpinMessageDiscordImpl } from "wormagent/plugin-sdk/discord";
export declare const runtimeDiscordOps: {
    auditChannelPermissions: typeof auditDiscordChannelPermissionsImpl;
    listDirectoryGroupsLive: typeof listDiscordDirectoryGroupsLiveImpl;
    listDirectoryPeersLive: typeof listDiscordDirectoryPeersLiveImpl;
    probeDiscord: typeof probeDiscordImpl;
    resolveChannelAllowlist: typeof resolveDiscordChannelAllowlistImpl;
    resolveUserAllowlist: typeof resolveDiscordUserAllowlistImpl;
    sendComponentMessage: typeof sendDiscordComponentMessageImpl;
    sendMessageDiscord: typeof sendMessageDiscordImpl;
    sendPollDiscord: typeof sendPollDiscordImpl;
    monitorDiscordProvider: typeof monitorDiscordProviderImpl;
    typing: {
        pulse: typeof sendTypingDiscordImpl;
    };
    conversationActions: {
        editMessage: typeof editMessageDiscordImpl;
        deleteMessage: typeof deleteMessageDiscordImpl;
        pinMessage: typeof pinMessageDiscordImpl;
        unpinMessage: typeof unpinMessageDiscordImpl;
        createThread: typeof createThreadDiscordImpl;
        editChannel: typeof editChannelDiscordImpl;
    };
};
