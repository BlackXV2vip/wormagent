import { describe, expect, it } from "vitest";
import { resolveIrcInboundTarget } from "./monitor.js";

describe("irc monitor inbound target", () => {
  it("keeps channel target for group messages", () => {
    expect(
      resolveIrcInboundTarget({
        target: "#wormagent",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: true,
      target: "#wormagent",
      rawTarget: "#wormagent",
    });
  });

  it("maps DM target to sender nick and preserves raw target", () => {
    expect(
      resolveIrcInboundTarget({
        target: "wormagent-bot",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: false,
      target: "alice",
      rawTarget: "wormagent-bot",
    });
  });

  it("falls back to raw target when sender nick is empty", () => {
    expect(
      resolveIrcInboundTarget({
        target: "wormagent-bot",
        senderNick: " ",
      }),
    ).toEqual({
      isGroup: false,
      target: "wormagent-bot",
      rawTarget: "wormagent-bot",
    });
  });
});
