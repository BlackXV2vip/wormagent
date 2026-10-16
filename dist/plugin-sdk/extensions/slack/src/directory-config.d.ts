import { type DirectoryConfigParams } from "wormagent/plugin-sdk/directory-runtime";
export declare function listSlackDirectoryPeersFromConfig(params: DirectoryConfigParams): Promise<import("wormagent/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
export declare function listSlackDirectoryGroupsFromConfig(params: DirectoryConfigParams): Promise<import("wormagent/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
