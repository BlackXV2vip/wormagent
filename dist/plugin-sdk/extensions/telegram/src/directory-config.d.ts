import { type DirectoryConfigParams } from "wormagent/plugin-sdk/directory-runtime";
export declare function listTelegramDirectoryPeersFromConfig(params: DirectoryConfigParams): Promise<import("wormagent/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
export declare function listTelegramDirectoryGroupsFromConfig(params: DirectoryConfigParams): Promise<import("wormagent/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
