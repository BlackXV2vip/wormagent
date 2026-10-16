#!/usr/bin/env bash
# WormAgent Gateway — one-shot installer 🐴
# Asks for ONLY 3 things (provider API key, Telegram bot token, Telegram user id).
# Everything else — gateway token, approval-socket token, workspace, service — is automatic.
#
# Usage:
#   bash scripts/install.sh
#   bash scripts/install.sh --api-key KEY --bot-token TOKEN --telegram-id 123456789
# Env vars (non-interactive): WORMAGENT_API_KEY, WORMAGENT_BOT_TOKEN, WORMAGENT_TELEGRAM_ID
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="${HOME}/.wormagent"
SERVICE_DIR="${HOME}/.config/systemd/user"
PORT="${WORMAGENT_GATEWAY_PORT:-18789}"
FORCE=0

API_KEY="${WORMAGENT_API_KEY:-}"
BOT_TOKEN="${WORMAGENT_BOT_TOKEN:-}"
TG_ID="${WORMAGENT_TELEGRAM_ID:-}"

while [ $# -gt 0 ]; do
  case "$1" in
    --api-key) API_KEY="${2:-}"; shift 2;;
    --api-key=*) API_KEY="${1#*=}"; shift;;
    --bot-token) BOT_TOKEN="${2:-}"; shift 2;;
    --bot-token=*) BOT_TOKEN="${1#*=}"; shift;;
    --telegram-id) TG_ID="${2:-}"; shift 2;;
    --telegram-id=*) TG_ID="${1#*=}"; shift;;
    --port) PORT="${2:-}"; shift 2;;
    --port=*) PORT="${1#*=}"; shift;;
    --force) FORCE=1; shift;;
    *) shift;;
  esac
done

c(){ printf '\033[36m%s\033[0m\n' "$*"; }
ok(){ printf '\033[32m✓ %s\033[0m\n' "$*"; }
warn(){ printf '\033[33m! %s\033[0m\n' "$*"; }
gen_token(){ node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))'; }

# --- 1. Node check -----------------------------------------------------------
c "[1/6] Checking Node.js (need >= 22.16.0)"
command -v node >/dev/null 2>&1 || { echo "Node.js missing — install Node >= 22.16.0 first." >&2; exit 1; }
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
NODE_MINOR="$(node -p 'process.versions.node.split(".")[1]')"
if [ "$NODE_MAJOR" -lt 22 ] || { [ "$NODE_MAJOR" -eq 22 ] && [ "$NODE_MINOR" -lt 16 ]; }; then
  warn "Node $(node -v) detected — 22.16.0+ recommended."
fi
ok "Node $(node -v)"

# --- 2. The 3 required inputs ------------------------------------------------
c "[2/6] Required inputs (3)"
if [ -z "$API_KEY" ]; then
  echo "  Provider API key — your LLM provider key."
  read -r -p "  API key: " API_KEY
fi
if [ -z "$BOT_TOKEN" ]; then
  echo "  Telegram bot token — from @BotFather (/newbot)."
  read -r -p "  Bot token: " BOT_TOKEN
fi
if [ -z "$TG_ID" ]; then
  echo "  Your Telegram numeric user id — get it from @userinfobot."
  read -r -p "  Telegram id: " TG_ID
fi
[ -n "$API_KEY" ]   || { echo "API key is required." >&2; exit 1; }
[ -n "$BOT_TOKEN" ] || { echo "Bot token is required." >&2; exit 1; }
[ -n "$TG_ID" ]     || { echo "Telegram id is required." >&2; exit 1; }
case "$TG_ID" in *[!0-9]*) echo "Telegram id must be numeric." >&2; exit 1;; esac
ok "Inputs captured"

# --- 3. Config (auto-generates the two tokens) -------------------------------
c "[3/6] Writing config (auto-generating gateway + approval tokens)"
mkdir -p "$STATE_DIR"
if [ -f "$STATE_DIR/wormagent.json" ] && [ "$FORCE" -ne 1 ]; then
  warn "$STATE_DIR/wormagent.json exists — kept (use --force to overwrite)."
else
  GW_TOKEN="$(gen_token)"
  WORMAGENT_TMPL="$ROOT/deploy/config/wormagent.json" \
  WORMAGENT_OUT="$STATE_DIR/wormagent.json" \
  WG_API_KEY="$API_KEY" WG_BOT_TOKEN="$BOT_TOKEN" WG_TG_ID="$TG_ID" WG_GW_TOKEN="$GW_TOKEN" \
  node <<'JS'
const fs = require('fs');
const c = JSON.parse(fs.readFileSync(process.env.WORMAGENT_TMPL, 'utf8'));
for (const p of Object.values(c.models?.providers || {})) if ('apiKey' in p) p.apiKey = process.env.WG_API_KEY;
const t = c.channels?.telegram || {};
if ('botToken' in t) t.botToken = process.env.WG_BOT_TOKEN;
if (Array.isArray(t.allowFrom)) t.allowFrom = t.allowFrom.map(() => process.env.WG_TG_ID);
if (t.execApprovals?.approvers) t.execApprovals.approvers = t.execApprovals.approvers.map(() => process.env.WG_TG_ID);
if (c.gateway?.auth && 'token' in c.gateway.auth) c.gateway.auth.token = process.env.WG_GW_TOKEN;
for (const x of (c.approvals?.exec?.targets || [])) if ('to' in x) x.to = process.env.WG_TG_ID;
c.gateway = { ...(c.gateway || {}), port: Number(process.env.WG_PORT || 18789) };
fs.writeFileSync(process.env.WORMAGENT_OUT, JSON.stringify(c, null, 2) + '\n');
JS
  ok "wormagent.json written (tokens auto-generated)"
fi

if [ -f "$STATE_DIR/exec-approvals.json" ] && [ "$FORCE" -ne 1 ]; then
  warn "$STATE_DIR/exec-approvals.json exists — kept."
else
  SOCK_TOKEN="$(gen_token)"
  WORMAGENT_EA_TMPL="$ROOT/deploy/config/exec-approvals.json" \
  WORMAGENT_EA_OUT="$STATE_DIR/exec-approvals.json" \
  WG_SOCK="$SOCK_TOKEN" \
  node <<'JS'
const fs = require('fs');
const e = JSON.parse(fs.readFileSync(process.env.WORMAGENT_EA_TMPL, 'utf8'));
if (e.socket && 'token' in e.socket) e.socket.token = process.env.WG_SOCK;
fs.writeFileSync(process.env.WORMAGENT_EA_OUT, JSON.stringify(e, null, 2) + '\n');
JS
  ok "exec-approvals.json written (token auto-generated)"
fi

# --- 4. Install gateway + workspace ------------------------------------------
c "[4/6] Installing the gateway + agent workspace"
npm i -g "$ROOT" >/dev/null 2>&1 || npm i -g "$ROOT"
mkdir -p "$STATE_DIR/workspace"
cp -r "$ROOT"/agent/* "$STATE_DIR/workspace/"
ok "Gateway installed · workspace at $STATE_DIR/workspace"

# --- 5. systemd user service -------------------------------------------------
c "[5/6] Installing + starting the service"
mkdir -p "$SERVICE_DIR"
cp "$ROOT/deploy/systemd/wormagent-gateway.service" "$SERVICE_DIR/"
systemctl --user daemon-reload
systemctl --user enable --now wormagent-gateway
sleep 2
ok "Service started: wormagent-gateway"

# --- 6. Verify ---------------------------------------------------------------
c "[6/6] Verifying the gateway"
UP=0
for i in 1 2 3 4 5; do
  if curl -fsS "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then UP=1; break; fi
  sleep 1
done
if [ "$UP" -eq 1 ]; then
  ok "Health: $(curl -fsS "http://127.0.0.1:${PORT}/health")"
  # best-effort test message
  if command -v wormagent >/dev/null 2>&1; then
    wormagent message send --channel telegram --target "$TG_ID" --message "✅ WormAgent is live. Send me a message." >/dev/null 2>&1 \
      && ok "Test message sent — check Telegram" \
      || warn "Connected — open Telegram and message your bot."
  fi
else
  warn "Gateway not answering yet — check: journalctl --user -u wormagent-gateway -n 50"
fi

echo
c "Done. Your bot is running."
echo "  Message your Telegram bot to start."
echo "  Logs:    journalctl --user -u wormagent-gateway -f"
echo "  Health:  curl -s http://127.0.0.1:${PORT}/health"
