#!/usr/bin/env bash
# WormAgent Gateway — one-shot installer 🐴
# Installs the gateway, config skeleton, agent workspace, and the systemd user service.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="${HOME}/.wormagent"
SERVICE_DIR="${HOME}/.config/systemd/user"
PORT="${WORMAGENT_GATEWAY_PORT:-18789}"

c() { printf '\033[36m%s\033[0m\n' "$*"; }
ok() { printf '\033[32m✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[33m! %s\033[0m\n' "$*"; }

# --- 1. Node check -----------------------------------------------------------
c "[1/5] Checking Node.js (need >= 22.16.0)"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install Node >= 22.16.0 first." >&2; exit 1
fi
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
NODE_MINOR="$(node -p 'process.versions.node.split(".")[1]')"
if [ "$NODE_MAJOR" -lt 22 ] || { [ "$NODE_MAJOR" -eq 22 ] && [ "$NODE_MINOR" -lt 16 ]; }; then
  warn "Node $(node -v) detected — 22.16.0+ is recommended."
fi
ok "Node $(node -v)"

# --- 2. Install gateway ------------------------------------------------------
c "[2/5] Installing the gateway (npm i -g .)"
npm i -g "$ROOT"
ok "Installed: $(wormagent --version 2>/dev/null || echo wormagent)"

# --- 3. Config skeleton ------------------------------------------------------
c "[3/5] Installing config skeleton into ${STATE_DIR}"
mkdir -p "$STATE_DIR"
if [ ! -f "$STATE_DIR/wormagent.json" ]; then
  cp "$ROOT/deploy/config/wormagent.json" "$STATE_DIR/wormagent.json"
  warn "Fill every 'REQUIRED:' value in $STATE_DIR/wormagent.json"
else
  warn "$STATE_DIR/wormagent.json exists — left untouched."
fi
if [ ! -f "$STATE_DIR/exec-approvals.json" ]; then
  cp "$ROOT/deploy/config/exec-approvals.json" "$STATE_DIR/exec-approvals.json"
  warn "Fill the 'REQUIRED:' socket token in $STATE_DIR/exec-approvals.json"
fi
ok "Config skeleton ready"

# --- 4. Agent workspace ------------------------------------------------------
c "[4/5] Installing the agent workspace (persona)"
mkdir -p "$STATE_DIR/workspace"
cp -r "$ROOT"/agent/* "$STATE_DIR/workspace/"
ok "Workspace: $STATE_DIR/workspace"

# --- 5. systemd user service -------------------------------------------------
c "[5/5] Installing the systemd user service"
mkdir -p "$SERVICE_DIR"
cp "$ROOT/deploy/systemd/wormagent-gateway.service" "$SERVICE_DIR/"
systemctl --user daemon-reload
systemctl --user enable --now wormagent-gateway
sleep 1
ok "Service enabled: wormagent-gateway"
systemctl --user --no-pager status wormagent-gateway || true

echo
c "Done. Next steps:"
echo "  1) Edit ${STATE_DIR}/wormagent.json and replace every 'REQUIRED:' value."
echo "  2) systemctl --user restart wormagent-gateway"
echo "  3) Verify:  curl -s http://127.0.0.1:${PORT}/health"
echo "  4) Logs:    journalctl --user -u wormagent-gateway -f"
