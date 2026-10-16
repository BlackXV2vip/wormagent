import { type DirectoryConfigParams } from "wormagent/plugin-sdk/directory-runtime";
export declare function listDiscordDirectoryPeersFromConfig(params: DirectoryConfigParams): Promise<import("wormagent/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
export declare function listDiscordDirectoryGroupsFromConfig(params: DirectoryConfigParams): Promise<import("wormagent/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
