#!/usr/bin/env bash
# WormAgent Gateway — uninstall 🐴
# Removes the systemd user service and the global package. State data is kept.
set -euo pipefail

STATE_DIR="${HOME}/.wormagent"
SERVICE_DIR="${HOME}/.config/systemd/user"
PURGE="${1:-}"

printf '\033[36mRemoving WormAgent Gateway service\033[0m\n'

systemctl --user disable --now wormagent-gateway 2>/dev/null || true
rm -f "${SERVICE_DIR}/wormagent-gateway.service"
systemctl --user daemon-reload 2>/dev/null || true

npm rm -g wormagent 2>/dev/null || true

printf '\033[32m✓ Service + package removed.\033[0m\n'

if [ "$PURGE" = "--purge" ]; then
  printf '\033[31m!! Purging state data at %s\033[0m\n' "$STATE_DIR"
  rm -rf "$STATE_DIR"
  printf '\033[32m✓ State data purged.\033[0m\n'
else
  printf 'State data kept at %s (use --purge to delete it).\n' "$STATE_DIR"
fi
