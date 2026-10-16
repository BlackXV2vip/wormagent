# 🐴 RUNBOOK — WormAgent Gateway

> الدليل الكامل لتشغيل **WormAgent Gateway** — الوكيل اللي بيشغّل بوت تيليجرام (وأي قناة تانية)
> على سيرفر Linux. من الصفر لحد خدمة شغّالة ومتصلة.

<p align="center">
  <strong>النتيجة النهائية:</strong> خدمة <code>wormagent-gateway</code> شغّالة على بورت <code>18789</code>، متصلة بتيليجرام، وترد.
</p>

---

## 0) نظرة سريعة

| البند | القيمة |
|---|---|
| الحزمة | `wormagent` (Node/TS) |
| نقطة الدخول | `dist/index.js` (bin: `wormagent`) |
| بورت الـ Gateway | `18789` (WebSocket + HTTP على loopback) |
| الصحة | `GET http://127.0.0.1:18789/health` → `{"ok":true,"status":"live"}` |
| الإعداد | `~/.wormagent/wormagent.json` |
| حالة التشغيل | `~/.wormagent/` (agents · sessions · memory · telegram · …) |
| خدمة systemd | `wormagent-gateway.service` (user service) |

---

## 1) المتطلبات

| المتطلب | التفاصيل |
|---|---|
| Node.js | **>= 22.16.0** (`package.json` → `engines`) |
| نظام التشغيل | Linux مع **systemd** (user services) |
| بوت تيليجرام | (اختياري) توكن من [@BotFather](https://t.me/BotFather) |
| مفتاح المزوّد | مفتاح API (OpenAI-compatible) |

```bash
node -v        # لازم ≥ v22.16.0
systemctl --version | head -1
```

---

## 2) التثبيت

**من هذا المستودع:**
```bash
git clone https://github.com/BlackXV2vip/wormagent.git
cd wormagent
npm i -g .            # يثبّت الـ bin: wormagent
```

**أو من الحزمة مباشرة:**
```bash
npm i -g wormagent
```

تحقق:
```bash
wormagent --version
```

---

## 3) الإعداد — **3 مدخلات بس، والباقي تلقائي** ✅

المطلوب منك **3 حاجات** بس:

| # | الحقل | من فين |
|---|---|---|
| 1 | مفتاح المزوّد `apiKey` | لوحة المزوّد |
| 2 | توكن البوت `botToken` | [@BotFather](https://t.me/BotFather) → `/newbot` |
| 3 | آيديك الرقمي `allowFrom` | [@userinfobot](https://t.me/userinfobot) |

والسكربت **بيولّد تلقائيًا**: `gateway.auth.token` · توكن سوكت الموافقات · كل باقي القيم.

```bash
make setup
# أو مباشرة:
bash scripts/install.sh --api-key KEY --bot-token TOKEN --telegram-id 123456789
```
> **غير تفاعلي:** `WORMAGENT_API_KEY` · `WORMAGENT_BOT_TOKEN` · `WORMAGENT_TELEGRAM_ID`

**طريقة يدوية** (لو عايز تملأ بنفسك):
```bash
mkdir -p ~/.wormagent
cp deploy/config/wormagent.json      ~/.wormagent/wormagent.json
cp deploy/config/exec-approvals.json ~/.wormagent/exec-approvals.json
# استبدل كل قيمة مكتوب عليها REQUIRED
```
يدوي/تفاعلي: `wormagent configure` · تحقق: `wormagent config validate`

لتجربة معزولة بدون لمس الإنتاج:
```bash
wormagent --dev gateway     # حالة منفصلة تحت ~/.wormagent-dev على بورت 19001
```

---

## 4) تثبيت مساحة الوكيل (الشخصية)

```bash
mkdir -p ~/.wormagent/workspace
cp -r agent/* ~/.wormagent/workspace/
```
الوكيل بيقرا هويته من: `AGENTS.md` · `SOUL.md` · `IDENTITY.md` · `USER.md` · `TOOLS.md` · `HEARTBEAT.md`.

---

## 5) التشغيل

### أ) يدوي (للاختبار)
```bash
wormagent gateway --port 18789
# اختياري:
#   --force         اقتل أي حاجة على البورت الأول
#   --auth token    نمط المصادقة (none|token|password|trusted-proxy)
#   --verbose       لوج مفصّل
```

### ب) كخدمة systemd (الوضع الدائم ✅)
```bash
mkdir -p ~/.config/systemd/user
cp deploy/systemd/wormagent-gateway.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now wormagent-gateway
```

إدارة الخدمة:
```bash
systemctl --user status  wormagent-gateway
systemctl --user restart wormagent-gateway
systemctl --user stop    wormagent-gateway
journalctl --user -u wormagent-gateway -f     # متابعة اللوج
```

> الخدمة بتشتغل: `/usr/bin/node /usr/lib/node_modules/wormagent/dist/index.js gateway --port 18789`

---

## 6) التحقق

```bash
wormagent health                         # فحص صحة الـ Gateway
curl -s http://127.0.0.1:18789/health    # {"ok":true,"status":"live"}
wormagent doctor                         # فحوصات + إصلاحات سريعة
wormagent status                         # حالة القنوات وآخر المستلمين
```

---

## 7) ربط بوت تيليجرام

1. افتح [@BotFather](https://t.me/BotFather) → `/newbot` → خذ **التوكن**.
2. اكتبه في `channels.telegram.botToken`.
3. اعرف آيديك من [@userinfobot](https://t.me/userinfobot) وحطه في `allowFrom`.
4. أعد التشغيل:
   ```bash
   systemctl --user restart wormagent-gateway
   wormagent channels list          # تأكد إن telegram connected
   ```
5. ابعت للبوت — لازم يرد.

---

## 8) مرجع الأوامر الأساسية

| الأمر | الوظيفة |
|---|---|
| `wormagent setup` / `onboard` / `configure` | تهيئة الإعداد ومساحة الوكيل |
| `wormagent gateway [--port N]` | تشغيل/إدارة بوابة WebSocket |
| `wormagent health` | فحص صحة الـ Gateway |
| `wormagent doctor` | فحوصات + إصلاحات سريعة |
| `wormagent status` | حالة القنوات + آخر المستلمين |
| `wormagent channels *` | إدارة القنوات (Telegram/Discord/…) |
| `wormagent agents *` | إدارة الوكلاء المعزولين (workspaces/auth/routing) |
| `wormagent models *` | اكتشاف وضبط الموديلات |
| `wormagent message *` | إرسال/قراءة الرسائل |
| `wormagent sessions *` | جرد جلسات المحادثة |
| `wormagent memory *` | بحث وإعادة فهرسة الذاكرة |
| `wormagent cron *` | مهام مجدولة |
| `wormagent devices *` / `pairing *` | اقتران الأجهزة |
| `wormagent approvals *` | موافقات تنفيذ الأوامر (exec) |
| `wormagent backup *` | نسخ احتياطي محلي قابل للتحقق |
| `wormagent update *` | تحديث WormAgent + قناة التحديث |
| `wormagent logs` / `tui` / `dashboard` | اللوجات · واجهة طرفية · Control UI |
| `wormagent uninstall` | إزالة خدمة الـ Gateway + البيانات المحلية |

للتفاصيل: `wormagent <command> --help` · الوثائق: https://docs.wormagent.ai/cli

---

## 9) التحديث · النسخ الاحتياطي · الحذف

**تحديث:**
```bash
wormagent update                 # أو:
npm i -g wormagent@latest
systemctl --user restart wormagent-gateway
```

**نسخة احتياطية من الحالة:**
```bash
wormagent backup create
wormagent backup verify          # (راجع: wormagent backup --help)
```

**حذف الخدمة (مع إبقاء CLI):**
```bash
wormagent uninstall
# حذف كامل ليدويًا:
systemctl --user disable --now wormagent-gateway
rm -f ~/.config/systemd/user/wormagent-gateway.service
npm rm -g wormagent
# البيانات تحت ~/.wormagent (احتفظ بيها للنسخة الاحتياطية)
```

---

## 10) بنية المجلدات

```text
~/.wormagent/
├── wormagent.json          # الإعداد الرئيسي
├── exec-approvals.json     # إعداد موافقات التنفيذ
├── workspace/              # شخصية الوكيل + الذاكرة
├── agents/<id>/            # الوكلاء (main, dev): agent/ + sessions/
├── memory/                 # قواعد ذاكرة (sqlite)
├── telegram/               # حالة تيليجرام (offset …)
├── identity/               # هوية الجهاز
├── credentials/            # بيانات الاعتماد
├── devices/ · cron/ · canvas/ · logs/ · delivery-queue/
```

---

## 11) حل المشاكل

| المشكلة | الحل |
|---|---|
| البورت مشغول | `wormagent gateway --force` أو غيّر `--port` |
| الخدمة بتفشل | `journalctl --user -u wormagent-gateway -n 100` |
| البوت مش بيرد | تأكد من `channels.telegram` + `allowFrom` + `wormagent channels list` |
| خطأ 409 تيليجرام | نسخة تانية بتسحب التحديثات — اقفلها (`wormagent doctor`) |
| التوليد فشل | تأكد من `apiKey` و`baseUrl` — `wormagent models scan` |
| إعداد غلط | `wormagent config validate` · `wormagent reset` (يحذف الإعداد) |

---

## 12) الأمان

- اربط الـ Gateway على **loopback** (`gateway.bind: loopback`) ولا تعرّضه للإنترنت مباشرة.
- استخدم `gateway.auth.token` (عشوائي طويل) لأي وصول بعيد.
- راجع `tools.exec.security` وسياسة الموافقات قبل السماح بتنفيذ أوامر.
- الأسرار تفضل على المضيف فقط — لا تُرفع للمستودع (شوف `deploy/README.md`).

---

<p align="center"><em>Recon. Exploit. Bypass. Own.</em> 🐴😈</p>
