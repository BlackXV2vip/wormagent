# Deploy — WormAgent Gateway (the `@AGENTEXOS_BOT` runtime)

This folder captures how the **live** WormAgent agent runs on the server:
a systemd user service (`wormagent-gateway`) plus its `~/.wormagent` runtime.

## What's here

| Path | What it is |
|---|---|
| `systemd/wormagent-gateway.service` | systemd user unit that runs the gateway |
| `wormagent.example.json` | gateway config template — **all secrets redacted** |
| `exec-approvals.example.json` | exec-approval socket config template (token redacted) |
| `../agent/` | the live agent workspace (persona, tools, memory) |

## Requirements

- **Node.js >= 22.16.0** (see `package.json` `engines`)
- Linux with systemd (user services)
- A Telegram bot (BotFather) if you want the Telegram channel

## 1. Install the gateway

```bash
npm i -g wormagent        # installs the gateway (this repo's package)
```

The service runs:

```
/usr/bin/node /usr/lib/node_modules/wormagent/dist/index.js gateway --port 18789
```

## 2. Config

```bash
mkdir -p ~/.wormagent
cp deploy/wormagent.example.json ~/.wormagent/wormagent.json
```

Edit `~/.wormagent/wormagent.json` and fill the placeholders:

| Field | Placeholder | Meaning |
|---|---|---|
| `models.providers.wormgpt.apiKey` | `<YOUR_WORMGPT_API_KEY>` | provider API key |
| `channels.telegram.botToken` | `<YOUR_TELEGRAM_BOT_TOKEN>` | BotFather token |
| `channels.telegram.allowFrom[0]` | `<YOUR_TELEGRAM_USER_ID>` | your Telegram numeric id (DM allowlist) |
| `channels.telegram.execApprovals.approvers[0]` | `<YOUR_TELEGRAM_USER_ID>` | who can approve exec |
| `gateway.auth.token` | `<YOUR_GATEWAY_TOKEN>` | long random string |

## 3. Install the agent workspace (persona)

```bash
mkdir -p ~/.wormagent/workspace
cp -r agent/* ~/.wormagent/workspace/
```

The agent reads its identity from these files each session:
`AGENTS.md`, `SOUL.md`, `IDENTITY.md`, `USER.md`, `TOOLS.md`, `HEARTBEAT.md`.

## 4. Exec approvals (optional)

```bash
cp deploy/exec-approvals.example.json ~/.wormagent/exec-approvals.json
# replace <YOUR_EXEC_APPROVALS_TOKEN> with a long random string
```

## 5. Run as a systemd user service

```bash
mkdir -p ~/.config/systemd/user
cp deploy/systemd/wormagent-gateway.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now wormagent-gateway
systemctl --user status wormagent-gateway
```

Gateway listens on **port 18789** (`gateway.mode: local`).

## Notes

- Secrets are **never** committed: `wormagent.json`, `exec-approvals.json`,
  `credentials/`, `identity/`, sessions and memory DBs live only on the host.
- Runtime state under `~/.wormagent`: `agents/`, `sessions/`, `memory/`,
  `telegram/`, `identity/`, `devices/`, `logs/`, `cron/`, `delivery-queue/`.
