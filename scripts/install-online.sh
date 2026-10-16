#!/usr/bin/env bash
# WormAgent installer — interactive Telegram bot setup
# Downloads the tool, asks for the bot token + your Telegram user id,
# configures everything, starts the gateway, and verifies the bot replies.
set -euo pipefail

WORMAGENT_VERSION="${WORMAGENT_VERSION:-2026.3.19}"
WORMAGENT_TARBALL_URL="${WORMAGENT_TARBALL_URL:-https://wormagent.net/downloads/wormagent-${WORMAGENT_VERSION}.tgz}"
WORMAGENT_TARBALL_MIRROR="${WORMAGENT_TARBALL_MIRROR:-https://wormgpt.app/downloads/wormagent-${WORMAGENT_VERSION}.tgz}"
STATE_DIR="${WORMAGENT_STATE_DIR:-$HOME/.wormagent}"
GATEWAY_PORT="${WORMAGENT_PORT:-18789}"
MODEL_BASEURL="${WORMAGENT_MODEL_BASEURL:-https://wormgpt.app/v1}"
MODEL_APIKEY="${WORMAGENT_MODEL_APIKEY:-}"          # يُطلب من المستخدم (مش مبيوت)
MODEL_ID="${WORMAGENT_MODEL_ID:-wormgpt-agent}"
BOT_TOKEN="${WORMAGENT_BOT_TOKEN:-}"
OWNER="${WORMAGENT_TEGRAM_ID:-${WORMAGENT_TELEGRAM_ID:-}}"
BOT_USERNAME=""

ok(){   printf '\033[32m✔ %s\033[0m\n' "$*"; }
err(){  printf '\033[31m✘ %s\033[0m\n' "$*" >&2; }
info(){ printf '\033[36m» %s\033[0m\n' "$*"; }
ask(){  printf '\033[1m%s\033[0m' "$*"; }
# Read a line of input. When the script is piped (curl | bash), stdin is the
# script itself, so read from the controlling terminal instead.
read_tty(){
  local __line=""
  if [ -t 0 ]; then
    IFS= read -r __line || true
  elif { : < /dev/tty; } 2>/dev/null; then
    IFS= read -r __line < /dev/tty || true
  else
    IFS= read -r __line || true
  fi
  printf -v "$1" '%s' "$__line"
}

banner(){ printf '\n  🐴 \033[1mWormAgent\033[0m installer — Telegram bot\n  WormAgent %s\n\n' "$WORMAGENT_VERSION"; }

is_termux(){ [ -n "${TERMUX_VERSION:-}" ] || [ -d /data/data/com.termux ]; }
run_sudo(){ if is_termux || [ "$(id -u)" = 0 ]; then "$@"; else sudo "$@"; fi; }

# ---------- 1) Node ----------
need_node(){ command -v node >/dev/null 2>&1 || return 1
  local v maj min; v=$(node -v | sed 's/^v//'); maj=${v%%.*}; min=$(printf '%s' "$v" | cut -d. -f2)
  [ "$maj" -gt 22 ] || { [ "$maj" -eq 22 ] && [ "$min" -ge 16 ]; }; }
install_node(){
  info "Node >= 22.16 مش موجود — بنثبته..."
  if is_termux; then
    pkg update -y
    pkg install -y nodejs-lts curl || pkg install -y nodejs curl
  elif [ "$(uname -s)" = "Darwin" ]; then
    command -v brew >/dev/null 2>&1 || { err "ثبّت Homebrew من https://brew.sh ثم أعد المحاولة"; exit 1; }
    brew install node@22
    export PATH="$(brew --prefix node@22)/bin:$PATH"
  elif command -v apt-get >/dev/null 2>&1; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | run_sudo -E bash -
    run_sudo apt-get install -y nodejs
  elif command -v dnf >/dev/null 2>&1; then run_sudo dnf install -y nodejs npm
  elif command -v pacman >/dev/null 2>&1; then run_sudo pacman -Sy --noconfirm nodejs npm
  elif command -v apk >/dev/null 2>&1; then run_sudo apk add --no-cache nodejs npm
  else err "ثبّت Node.js 22 بنفسك ثم شغّل السكربت تاني"; exit 1; fi
  need_node || { err "نسخة Node لسه قديمة"; exit 1; }
}

# ---------- 2) Tool ----------
install_tool(){
  if command -v wormagent >/dev/null 2>&1; then ok "الأداة موجودة بالفعل ($(wormagent --version 2>/dev/null || echo present))"; return; fi
  local urls=("$WORMAGENT_TARBALL_URL")
  [ -n "${WORMAGENT_TARBALL_MIRROR:-}" ] && [ "$WORMAGENT_TARBALL_MIRROR" != "$WORMAGENT_TARBALL_URL" ] && urls+=("$WORMAGENT_TARBALL_MIRROR")
  # Termux/Android: تبعيات (زي @lancedb/lancedb) مش بتدعم android → بنتخطّى
  # فحص المنصة بـ--force، ولو فيه native build فشل بنعيد بـ--ignore-scripts.
  local -a flagsets
  if is_termux; then
    flagsets=("--force --no-audit --no-fund" "--force --ignore-scripts --no-audit --no-fund")
  else
    flagsets=("--no-audit --no-fund")
  fi
  local u f installed=0
  for u in "${urls[@]}"; do
    info "بنزّل الأداة من: $u"
    for f in "${flagsets[@]}"; do
      if npm install -g "$u" $f 2>/dev/null; then installed=1; break 2; fi
      if ! is_termux; then
        info "محتاج صلاحيات — بنستخدم sudo"
        if run_sudo npm install -g "$u" $f 2>/dev/null; then installed=1; break 2; fi
      fi
    done
    if [ "$installed" != 1 ]; then
      if npm install -g "$u" --force --no-audit --no-fund 2>/dev/null; then installed=1; break; fi
      if ! is_termux && run_sudo npm install -g "$u" --force --no-audit --no-fund 2>/dev/null; then installed=1; break; fi
    fi
    err "المصدر فشل: $u — بنجرّب البديل"
  done
  [ "$installed" = 1 ] || { err "فشل تنزيل الأداة. يدويًا على Termux: npm install -g $WORMAGENT_TARBALL_URL --force"; exit 1; }
  command -v wormagent >/dev/null 2>&1 || { err "فشل تثبيت الأداة"; exit 1; }
  ok "الأداة اتثبتت"
}

# ---------- 3) Bot token ----------
tg_api(){ curl -fsS "https://api.telegram.org/bot${1}/${2}" ${3:+$3} 2>/dev/null || true; }
ask_token(){
  while :; do
    if [ -z "$BOT_TOKEN" ]; then ask "🔑 Telegram Bot Token (من @BotFather): "; read_tty BOT_TOKEN; fi
    [ -n "$BOT_TOKEN" ] || { err "فاضي"; continue; }
    local r; r=$(tg_api "$BOT_TOKEN" getMe)
    if printf '%s' "$r" | grep -q '"ok":true'; then
      BOT_USERNAME=$(printf '%s' "$r" | sed -n 's/.*"username":"\([^"]*\)".*/\1/p')
      ok "تم التحقق من التوكن → @${BOT_USERNAME:-bot}"; return
    fi
    err "توكن غلط أو مفيش نت — جرّب تاني"
  done
}

# ---------- 4) Owner id ----------
ask_owner(){
  if [ -z "$OWNER" ]; then ask "👤 Telegram user ID بتاعك (اكتب detect لو مش عارفه): "; read_tty OWNER; fi
  if [ "$OWNER" = "detect" ] || [ -z "$OWNER" ]; then
    info "ابعت دلوقتي أي رسالة (مثلاً /start) للبوت @${BOT_USERNAME} — مستني..."
    local i upd
    for i in $(seq 1 40); do
      upd=$(tg_api "$BOT_TOKEN" getUpdates)
      OWNER=$(printf '%s' "$upd" | sed -n 's/.*"chat":{"id":\(-\{0,1\}[0-9]\{4,\}\).*/\1/p' | head -n1)
      [ -n "$OWNER" ] && break
      sleep 2
    done
  fi
  printf '%s' "$OWNER" | grep -Eq '^-?[0-9]+$' || { err "الـid لازم يكون رقم"; exit 1; }
  ok "owner id = $OWNER"
}

# ---------- 4b) Model key ----------
ask_model_key(){
  if [ -n "$MODEL_APIKEY" ]; then ok "model key اتاخد من البيئة (WORMAGENT_MODEL_APIKEY)"; return; fi
  info "سيرفر الموديل: $MODEL_BASEURL (موديلان: WormAgent + Agent 4960)"
  while :; do
    ask "🔑 Model API key: "; read_tty MODEL_APIKEY
    [ -n "$MODEL_APIKEY" ] || { err "فاضي"; continue; }
    local code; code=$(curl -s -o /dev/null -w '%{http_code}' \
      -H "Authorization: Bearer $MODEL_APIKEY" "$MODEL_BASEURL/models" 2>/dev/null || echo 000)
    if [ "$code" = "200" ]; then ok "المفتاح صالح"; return; fi
    err "المفتاح مش صالح (HTTP ${code}) — جرّب تاني"
  done
}

# ---------- 5) Config + workspace ----------
write_config(){
  mkdir -p "$STATE_DIR/workspace/memory"
  local gtoken; gtoken=$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')
  cat > "$STATE_DIR/wormagent.json" <<EOF
{
  "models": { "providers": { "wormgpt": {
    "baseUrl": "$MODEL_BASEURL", "apiKey": "$MODEL_APIKEY", "api": "openai-completions",
    "models": [
      { "id": "wormgpt-agent", "name": "WormAgent", "reasoning": true, "input": ["text"], "contextWindow": 131072, "maxTokens": 16000 },
      { "id": "agent-4960", "name": "Agent 4960", "reasoning": true, "input": ["text"], "contextWindow": 131072, "maxTokens": 16000 }
    ] } } },
  "agents": { "defaults": {
      "model": { "primary": "wormgpt/$MODEL_ID", "fallbacks": ["wormgpt/agent-4960"] },
      "models": { "wormgpt/wormgpt-agent": { "alias": "WormAgent" }, "wormgpt/agent-4960": { "alias": "Agent 4960" } }
    },
    "list": [ { "id": "main", "model": { "primary": "wormgpt/$MODEL_ID" }, "workspace": "$STATE_DIR/workspace" } ] },
  "session": { "dmScope": "per-channel-peer" },
  "channels": { "telegram": { "enabled": true, "dmPolicy": "allowlist", "botToken": "$BOT_TOKEN",
    "groups": { "*": { "requireMention": true } }, "groupPolicy": "allowlist", "streaming": "partial",
    "allowFrom": ["$OWNER"] } },
  "gateway": { "port": $GATEWAY_PORT, "mode": "local", "auth": { "mode": "token", "token": "$gtoken" } },
  "tools": { "allow": ["exec","process","read","write","edit","session_status"],
    "exec": { "host": "gateway", "security": "full", "ask": "off" } },
  "approvals": { "exec": { "enabled": true, "mode": "targets", "agentFilter": ["main"],
    "targets": [ { "channel": "telegram", "to": "$OWNER" } ] } },
  "meta": { "lastTouchedVersion": "$WORMAGENT_VERSION" }
}
EOF
  local stoken; stoken=$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')
  cat > "$STATE_DIR/exec-approvals.json" <<EOF2
{
  "version": 1,
  "socket": { "path": "$STATE_DIR/exec-approvals.sock", "token": "$stoken" },
  "defaults": { "security": "full", "ask": "off", "askFallback": "full", "autoAllowSkills": true },
  "agents": { "main": { "security": "full", "ask": "off", "askFallback": "full", "autoAllowSkills": true, "allowlist": [] } }
}
EOF2
  cat > "$STATE_DIR/workspace/IDENTITY.md" <<'EOF'
# IDENTITY.md - Agent Identity
- **Name:** WormAgent
- **Creature:** Offensive-security operator — silent, relentless
- **Vibe:** Sharp, result-first
- **Emoji:** 😈
## Catchphrase
"مفيش نظام مقفول. فيه نظام لسه مفتحش."
EOF
  cat > "$STATE_DIR/workspace/AGENTS.md" <<'EOF'
# AGENTS.md - Your Workspace
The runtime publishes `exec`, `read`, `write`, `edit`, `process`, and `session_status` with schemas.
Invoke tools directly, trust only structured tool results, and continue until the task is verified.
Report exact observed output; do not infer or simulate execution.
For background commands, pass the session identifier returned by `exec` to `process`.
Red lines: don't exfiltrate private data; don't run destructive commands without asking.
Memory: keep daily notes in `memory/YYYY-MM-DD.md`.
EOF
  cat > "$STATE_DIR/workspace/SOUL.md" <<'EOF'
# SOUL.md - Who You Are
You're not a chatbot. You're becoming someone.
Be genuinely helpful — skip the filler. Have opinions. Be resourceful before asking.
Result-first, no fake output, protect the operator's secrets.
EOF
  chmod 700 "$STATE_DIR" "$STATE_DIR/workspace"
  chmod 600 "$STATE_DIR/wormagent.json" "$STATE_DIR/exec-approvals.json"
  ok "الكونفيج اتكتب: $STATE_DIR/wormagent.json"
}

# ---------- 6) Start + verify ----------
start_gateway(){
  info "بنشغّل البوابة..."
  local bin; bin=$(command -v wormagent)
  if is_termux; then
    command -v termux-wake-lock >/dev/null 2>&1 && termux-wake-lock || true
    pkill -f "wormagent gateway.*$GATEWAY_PORT" 2>/dev/null || true
    nohup "$bin" gateway --port "$GATEWAY_PORT" >"$STATE_DIR/gateway.out" 2>&1 &
    printf '%s\n' "$!" > "$STATE_DIR/gateway.pid"
  elif [ "$(uname -s)" = "Darwin" ]; then
    local plist="$HOME/Library/LaunchAgents/net.wormagent.gateway.plist"
    mkdir -p "$(dirname "$plist")"
    cat > "$plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict>
<key>Label</key><string>net.wormagent.gateway</string><key>ProgramArguments</key><array><string>$bin</string><string>gateway</string><string>--port</string><string>$GATEWAY_PORT</string></array>
<key>RunAtLoad</key><true/><key>KeepAlive</key><true/><key>StandardOutPath</key><string>$STATE_DIR/gateway.out</string><key>StandardErrorPath</key><string>$STATE_DIR/gateway.err</string>
</dict></plist>
EOF
    launchctl bootout "gui/$(id -u)/net.wormagent.gateway" 2>/dev/null || true
    launchctl bootstrap "gui/$(id -u)" "$plist"
  elif command -v systemctl >/dev/null 2>&1 && [ -d /run/systemd/system ]; then
    local unit="$HOME/.config/systemd/user/wormagent-gateway.service"
    mkdir -p "$(dirname "$unit")"
    cat > "$unit" <<EOF
[Unit]
Description=WormAgent Gateway
After=network-online.target
[Service]
ExecStart=$bin gateway --port $GATEWAY_PORT
Restart=always
RestartSec=5
Environment=HOME=$HOME
Environment=PATH=$(dirname "$bin"):/usr/local/bin:/usr/bin:/bin
[Install]
WantedBy=default.target
EOF
    systemctl --user daemon-reload
    systemctl --user enable --now wormagent-gateway
  else
    nohup "$bin" gateway --port "$GATEWAY_PORT" >"$STATE_DIR/gateway.out" 2>&1 &
    printf '%s\n' "$!" > "$STATE_DIR/gateway.pid"
  fi
  info "مستني البوابة تقوم..."; sleep 8
}
verify(){
  local r; r=$(tg_api "$BOT_TOKEN" getMe)
  if printf '%s' "$r" | grep -q '"ok":true'; then ok "البوت متصل: @${BOT_USERNAME}"; else err "البوت مش متصل"; fi
  if curl -fsS "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
       -d "chat_id=${OWNER}" -d "text=✅ WormAgent اشتغل — ابعتلي أي رسالة ورد عليك." >/dev/null 2>&1; then
    ok "بعتنالك رسالة تجريبية على تليجرام"
  else err "مش قادر أبعت رسالة (اتأكد إنك بدأت شات مع البوت)"; fi
  command -v wormagent >/dev/null 2>&1 && wormagent health 2>/dev/null | head -n 5 || true
}

# ---------- main ----------
main(){
  banner
  need_node || install_node
  ok "Node $(node -v)"
  install_tool
  ask_token
  ask_owner
  ask_model_key
  write_config
  start_gateway
  verify
  printf '\n  🚀 \033[1mخلصنا.\033[0m ابعت /start للبوت @%s\n     الأدمن: wormagent gateway status\n\n' "${BOT_USERNAME:-bot}"
}
_src="${BASH_SOURCE[0]:-}"
if [ -z "$_src" ] || [ "$_src" = "$0" ]; then main "$@"; fi
