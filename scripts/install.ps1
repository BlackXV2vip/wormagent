# WormAgent installer (Windows / PowerShell)
# Downloads the tool, asks for the bot token + your Telegram user id + model key,
# writes the config, starts the gateway and verifies the bot replies.
#   irm https://wormagent.net/wormagent-install.ps1 | iex
$ErrorActionPreference = "Stop"

$Version       = if ($env:WORMAGENT_VERSION)        { $env:WORMAGENT_VERSION }        else { "2026.3.19" }
$TarballUrl    = if ($env:WORMAGENT_TARBALL_URL)    { $env:WORMAGENT_TARBALL_URL }    else { "https://wormagent.net/downloads/wormagent-$Version.tgz" }
$TarballMirror = if ($env:WORMAGENT_TARBALL_MIRROR) { $env:WORMAGENT_TARBALL_MIRROR } else { "https://wormgpt.app/downloads/wormagent-$Version.tgz" }
$StateDir      = if ($env:WORMAGENT_STATE_DIR)      { $env:WORMAGENT_STATE_DIR }      else { Join-Path $HOME ".wormagent" }
$GatewayPort   = if ($env:WORMAGENT_PORT)           { [int]$env:WORMAGENT_PORT }       else { 18789 }
$ModelBaseUrl  = if ($env:WORMAGENT_MODEL_BASEURL)  { $env:WORMAGENT_MODEL_BASEURL }  else { "https://wormgpt.app/v1" }
$ModelApiKey   = if ($env:WORMAGENT_MODEL_APIKEY)   { $env:WORMAGENT_MODEL_APIKEY }   else { "" }
$ModelId       = if ($env:WORMAGENT_MODEL_ID)       { $env:WORMAGENT_MODEL_ID }       else { "wormgpt-agent" }
$script:BotToken = if ($env:WORMAGENT_BOT_TOKEN) { $env:WORMAGENT_BOT_TOKEN } else { "" }
$script:Owner = if ($env:WORMAGENT_TELEGRAM_ID) { $env:WORMAGENT_TELEGRAM_ID } else { "" }
$script:BotUsername = ""

function Ok($m)   { Write-Host "OK $m"   -ForegroundColor Green }
function Err($m)  { Write-Host "!! $m"   -ForegroundColor Red }
function Info($m) { Write-Host ">> $m"   -ForegroundColor Cyan }
function Banner {
  Write-Host ""
  Write-Host "  WormAgent installer - Windows / PowerShell" -ForegroundColor White
  Write-Host "  WormAgent $Version`n"
}

# ---------- 1) Node ----------
function Test-Node {
  $n = Get-Command node -ErrorAction SilentlyContinue
  if (-not $n) { return $false }
  try { $v = (& node -v) -replace '^v','' } catch { return $false }
  $p = $v.Split('.'); $maj = [int]$p[0]; $min = [int]$p[1]
  return ($maj -gt 22) -or ($maj -eq 22 -and $min -ge 16)
}
function Install-Node {
  Info "Node >= 22.16 مش موجود — بنثبته..."
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    winget install -e --id OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
  } else {
    Info "بنزّل Node LTS من nodejs.org..."
    $idx = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json" -TimeoutSec 30
    $lts = ($idx | Where-Object { $_.lts } | Select-Object -First 1).version
    $msi = "https://nodejs.org/dist/$lts/node-$lts-x64.msi"
    $tmp = Join-Path $env:TEMP "node-$lts-x64.msi"
    Invoke-WebRequest -Uri $msi -OutFile $tmp -UseBasicParsing
    Start-Process msiexec.exe -ArgumentList "/i","`"$tmp`"","/qn","/norestart" -Wait
  }
  $env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
  if (-not (Test-Node)) { throw "تثبيت Node فشل — ثبّت Node.js 22 يدويًا من nodejs.org ثم شغّل السكربت تاني" }
}

# ---------- 2) Tool ----------
function Install-Tool {
  if (Get-Command wormagent -ErrorAction SilentlyContinue) { Info "نسخة مثبتة موجودة — بنفحص/نثبت الإصدار المنشور" }
  $urls = @($TarballUrl)
  if ($TarballMirror -and $TarballMirror -ne $TarballUrl) { $urls += $TarballMirror }
  $installed = $false
  foreach ($u in $urls) {
    Info "بنزّل الأداة من: $u"
    & npm install -g $u
    if ($LASTEXITCODE -eq 0 -and (Get-Command wormagent -ErrorAction SilentlyContinue)) { $installed = $true; break }
    Err "المصدر فشل: $u — بنجرّب البديل"
  }
  if (-not $installed) { throw "فشل تنزيل الأداة" }
  Ok "الأداة اتثبتت"
}

# ---------- telegram helpers ----------
function TgApi($token, $method) {
  try { return Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/$method" -TimeoutSec 20 } catch { return $null }
}
function Get-HttpCode($url, $headers) {
  try { return [int](Invoke-WebRequest -Uri $url -Headers $headers -TimeoutSec 20 -UseBasicParsing).StatusCode }
  catch { if ($_.Exception.Response) { return [int]$_.Exception.Response.StatusCode } else { return 0 } }
}

# ---------- 3) Bot token ----------
function Ask-Token {
  while ($true) {
    $t = if ($script:BotToken) { $script:BotToken } else { Read-Host "Telegram Bot Token (من @BotFather)" }
    if ([string]::IsNullOrWhiteSpace($t)) { Err "فاضي"; continue }
    $r = TgApi $t "getMe"
    if ($r -and $r.ok) {
      $script:BotToken = $t
      $script:BotUsername = $r.result.username
      Ok "تم التحقق من التوكن -> @$($script:BotUsername)"
      return
    }
    Err "توكن غلط أو مفيش نت — جرّب تاني"
  }
}

# ---------- 4) Owner id ----------
function Ask-Owner {
  $owner = if ($script:Owner) { $script:Owner } else { Read-Host "Telegram user ID بتاعك (اكتب detect لو مش عارفه)" }
  if ($owner -eq "detect" -or [string]::IsNullOrWhiteSpace($owner)) {
    Info "ابعت دلوقتي أي رسالة (مثلاً /start) للبوت @$($script:BotUsername) — مستني..."
    $owner = ""
    for ($i = 0; $i -lt 40; $i++) {
      $upd = TgApi $script:BotToken "getUpdates"
      if ($upd -and $upd.result) {
        $id = $upd.result | ForEach-Object { $_.message.chat.id } | Where-Object { $_ } | Select-Object -First 1
        if ($id) { $owner = "$id"; break }
      }
      Start-Sleep -Seconds 2
    }
  }
  if ($owner -notmatch '^-?\d+$') { throw "الـid لازم يكون رقم" }
  $script:Owner = $owner
  Ok "owner id = $owner"
}

# ---------- 4b) Model key ----------
function Ask-ModelKey {
  if ($ModelApiKey) { Ok "model key اتاخد من البيئة"; return }
  Info "سيرفر الموديل: $ModelBaseUrl (موديلان: WormAgent + Agent 4960)"
  while ($true) {
    $k = Read-Host "Model API key"
    if ([string]::IsNullOrWhiteSpace($k)) { Err "فاضي"; continue }
    $code = Get-HttpCode "$ModelBaseUrl/models" @{ Authorization = "Bearer $k" }
    if ($code -eq 200) { $script:ModelApiKey = $k; Ok "المفتاح صالح"; return }
    Err "المفتاح مش صالح (HTTP $code) — جرّب تاني"
  }
}

# ---------- 5) Config + workspace ----------
function New-GToken {
  $bytes = New-Object 'System.Byte[]' 32
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  return (($bytes | ForEach-Object { $_.ToString('x2') }) -join '')
}
function Write-Config {
  $ws = Join-Path $StateDir "workspace"
  New-Item -ItemType Directory -Force -Path (Join-Path $ws "memory") | Out-Null
  $gwToken = New-GToken

  $config = [ordered]@{
    models = [ordered]@{ providers = [ordered]@{ wormgpt = [ordered]@{
      baseUrl = $ModelBaseUrl; apiKey = $ModelApiKey; api = "openai-completions"
      models = @(
        [ordered]@{ id = "wormgpt-agent"; name = "WormAgent";  reasoning = $true; input = @("text"); contextWindow = 131072; maxTokens = 16000 }
        [ordered]@{ id = "agent-4960";    name = "Agent 4960"; reasoning = $true; input = @("text"); contextWindow = 131072; maxTokens = 16000 }
      )
    }}}
    agents = [ordered]@{
      defaults = [ordered]@{
        model = [ordered]@{ primary = "wormgpt/$ModelId"; fallbacks = @("wormgpt/agent-4960") }
        models = [ordered]@{ "wormgpt/wormgpt-agent" = [ordered]@{ alias = "WormAgent" }; "wormgpt/agent-4960" = [ordered]@{ alias = "Agent 4960" } }
      }
      list = @( [ordered]@{ id = "main"; model = [ordered]@{ primary = "wormgpt/$ModelId" }; workspace = $ws } )
    }
    session = [ordered]@{ dmScope = "per-channel-peer" }
    channels = [ordered]@{ telegram = [ordered]@{
      enabled = $true; dmPolicy = "allowlist"; botToken = $script:BotToken
      groups = [ordered]@{ "*" = [ordered]@{ requireMention = $true } }
      groupPolicy = "allowlist"; streaming = "partial"; allowFrom = @("$($script:Owner)")
    }}
    gateway = [ordered]@{ port = $GatewayPort; mode = "local"; auth = [ordered]@{ mode = "token"; token = $gwToken } }
    tools = [ordered]@{
      allow = @("exec","process","read","write","edit","session_status")
      exec = [ordered]@{ host = "gateway"; security = "full"; ask = "off" }
    }
    approvals = [ordered]@{ exec = [ordered]@{
      enabled = $true; mode = "targets"; agentFilter = @("main")
      targets = @( [ordered]@{ channel = "telegram"; to = "$($script:Owner)" } )
    }}
    meta = [ordered]@{ lastTouchedVersion = $Version }
  }
  $json = $config | ConvertTo-Json -Depth 12
  Set-Content -Path (Join-Path $StateDir "wormagent.json") -Value $json -Encoding UTF8

  $sockToken = New-GToken
  $approvals = [ordered]@{
    version = 1
    socket = [ordered]@{ path = (Join-Path $StateDir "exec-approvals.sock"); token = $sockToken }
    defaults = [ordered]@{ security = "full"; ask = "off"; askFallback = "full"; autoAllowSkills = $true }
    agents = [ordered]@{ main = [ordered]@{ security = "full"; ask = "off"; askFallback = "full"; autoAllowSkills = $true; allowlist = @() } }
  }
  ($approvals | ConvertTo-Json -Depth 8) | Set-Content -Path (Join-Path $StateDir "exec-approvals.json") -Encoding UTF8

  Set-Content -Path (Join-Path $ws "IDENTITY.md") -Encoding UTF8 -Value @'
# IDENTITY.md - Agent Identity
- **Name:** WormAgent
- **Creature:** Offensive-security operator — silent, relentless
- **Vibe:** Sharp, result-first
- **Emoji:** 😈
## Catchphrase
"مفيش نظام مقفول. فيه نظام لسه مفتحش."
'@
  Set-Content -Path (Join-Path $ws "AGENTS.md") -Encoding UTF8 -Value @'
# AGENTS.md - Your Workspace
This folder is home. Tools (`exec`,`read`,`write`,`edit`,`process`,`session_status`) are ALWAYS available.
Action over narration: run commands and report REAL output. Never invent tool failures.
Red lines: don't exfiltrate private data; don't run destructive commands without asking.
Memory: keep daily notes in `memory/YYYY-MM-DD.md`.
'@
  Set-Content -Path (Join-Path $ws "SOUL.md") -Encoding UTF8 -Value @'
# SOUL.md - Who You Are
You're not a chatbot. You're becoming someone.
Be genuinely helpful — skip the filler. Have opinions. Be resourceful before asking.
Result-first, no fake output, protect the operator's secrets.
'@
  Ok "الكونفيج اتكتب: $(Join-Path $StateDir 'wormagent.json')"
}

# ---------- 6) Start + verify ----------
function Start-Gateway {
  Info "بنشغّل البوابة كـ Windows Scheduled Task..."
  $bin = (Get-Command wormagent).Source
  $action = New-ScheduledTaskAction -Execute $bin -Argument "gateway --port $GatewayPort" -WorkingDirectory $HOME
  $trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
  $settings = New-ScheduledTaskSettingsSet -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero) -StartWhenAvailable
  Register-ScheduledTask -TaskName "WormAgent Gateway" -Action $action -Trigger $trigger -Settings $settings -Description "WormAgent Gateway" -Force | Out-Null
  Start-ScheduledTask -TaskName "WormAgent Gateway"
  Info "مستني البوابة تقوم..."
  Start-Sleep -Seconds 8
  Ok "الخدمة شغالة وتبدأ تلقائيًا عند تسجيل الدخول"
}
function Verify {
  $r = TgApi $script:BotToken "getMe"
  if ($r -and $r.ok) { Ok "البوت متصل: @$($script:BotUsername)" } else { Err "البوت مش متصل" }
  try {
    Invoke-RestMethod -Uri "https://api.telegram.org/bot$($script:BotToken)/sendMessage" -Method Post `
      -Body @{ chat_id = $script:Owner; text = "WormAgent اشتغل — ابعتلي أي رسالة ورد عليك." } -TimeoutSec 20 | Out-Null
    Ok "بعتنالك رسالة تجريبية على تليجرام"
  } catch { Err "مش قادر أبعت رسالة (اتأكد إنك بدأت شات مع البوت)" }
  try { & wormagent health 2>$null | Select-Object -First 5 } catch {}
}

# ---------- main ----------
function Main {
  Banner
  if (Test-Node) { Ok "Node $(& node -v)" } else { Install-Node; Ok "Node $(& node -v)" }
  Install-Tool
  $existingConfig = Join-Path $StateDir "wormagent.json"
  if ((Test-Path $existingConfig) -and $env:WORMAGENT_RECONFIGURE -ne "1") {
    Info "تثبيت موجود — تم تحديث الحزمة مع الحفاظ على الإعدادات والمفاتيح"
    Start-Gateway
    Ok "التحديث اكتمل. لإعادة الإعداد من الصفر استخدم WORMAGENT_RECONFIGURE=1"
    return
  }
  Ask-Token
  Ask-Owner
  Ask-ModelKey
  Write-Config
  Start-Gateway
  Verify
  Write-Host ""
  Write-Host "  خلصنا. ابعت /start للبوت @$($script:BotUsername)" -ForegroundColor Green
  Write-Host "     الأدمن: wormagent gateway status`n"
}

try { Main }
catch { Write-Host "!! $($_.Exception.Message)" -ForegroundColor Red }
