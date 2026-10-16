import type { DirectoryConfigParams } from "wormagent/plugin-sdk/channel-runtime";
import type { ChannelDirectoryEntry } from "wormagent/plugin-sdk/channel-runtime";
export declare function listSlackDirectoryPeersLive(params: DirectoryConfigParams): Promise<ChannelDirectoryEntry[]>;
export declare function listSlackDirectoryGroupsLive(params: DirectoryConfigParams): Promise<ChannelDirectoryEntry[]>;
