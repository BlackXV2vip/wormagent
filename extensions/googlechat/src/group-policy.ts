import { resolveChannelGroupRequireMention } from "wormagent/plugin-sdk/channel-policy";
import type { WormAgentConfig } from "wormagent/plugin-sdk/core";

type GoogleChatGroupContext = {
  cfg: WormAgentConfig;
  accountId?: string | null;
  groupId?: string | null;
};

export function resolveGoogleChatGroupRequireMention(params: GoogleChatGroupContext): boolean {
  return resolveChannelGroupRequireMention({
    cfg: params.cfg,
    channel: "googlechat",
    groupId: params.groupId,
    accountId: params.accountId,
  });
}
