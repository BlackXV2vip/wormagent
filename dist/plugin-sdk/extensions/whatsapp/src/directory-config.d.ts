import { type DirectoryConfigParams } from "wormagent/plugin-sdk/directory-runtime";
export declare function listWhatsAppDirectoryPeersFromConfig(params: DirectoryConfigParams): Promise<import("wormagent/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
export declare function listWhatsAppDirectoryGroupsFromConfig(params: DirectoryConfigParams): Promise<import("wormagent/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
