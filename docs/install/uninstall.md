---
summary: "Uninstall WormAgent completely (CLI, service, state, workspace)"
read_when:
  - You want to remove WormAgent from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

# Uninstall

Two paths:

- **Easy path** if `wormagent` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
wormagent uninstall
```

Non-interactive (automation / npx):

```bash
wormagent uninstall --all --yes --non-interactive
npx -y wormagent uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
wormagent gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
wormagent gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${WORMAGENT_STATE_DIR:-$HOME/.wormagent}"
```

If you set `WORMAGENT_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.wormagent/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g wormagent
pnpm remove -g wormagent
bun remove -g wormagent
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/WormAgent.app
```

Notes:

- If you used profiles (`--profile` / `WORMAGENT_PROFILE`), repeat step 3 for each state dir (defaults are `~/.wormagent-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `wormagent` is missing.

### macOS (launchd)

Default label is `ai.wormagent.gateway` (or `ai.wormagent.<profile>`; legacy `com.wormagent.*` may still exist):

```bash
launchctl bootout gui/$UID/ai.wormagent.gateway
rm -f ~/Library/LaunchAgents/ai.wormagent.gateway.plist
```

If you used a profile, replace the label and plist name with `ai.wormagent.<profile>`. Remove any legacy `com.wormagent.*` plists if present.

### Linux (systemd user unit)

Default unit name is `wormagent-gateway.service` (or `wormagent-gateway-<profile>.service`):

```bash
systemctl --user disable --now wormagent-gateway.service
rm -f ~/.config/systemd/user/wormagent-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `WormAgent Gateway` (or `WormAgent Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "WormAgent Gateway"
Remove-Item -Force "$env:USERPROFILE\.wormagent\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.wormagent-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://wormagent.ai/install.sh` or `install.ps1`, the CLI was installed with `npm install -g wormagent@latest`.
Remove it with `npm rm -g wormagent` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `wormagent ...` / `bun run wormagent ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.
