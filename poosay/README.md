# Discord Forum Announce Bot / บอทประกาศรูปภาพจากฟอรั่ม (v3)

**Language / ภาษา:** English default, `/language` to switch to Thai anytime.
ค่าเริ่มต้นเป็นภาษาอังกฤษ ใช้คำสั่ง `/language` เปลี่ยนเป็นไทยได้ทุกเมื่อ (แยกตามเซิร์ฟเวอร์)

## Features / ฟีเจอร์
- Watches forum threads, announces only messages with image attachments (multiple images = multiple separate announcements)
  ฟังกระทู้ในฟอรั่ม ประกาศเฉพาะข้อความที่แนบรูป (แนบหลายรูป = แยกประกาศทีละรูป)
- Auto-crops images to 1:1 with optional blur, configurable per template
  ครอปรูปเป็น 1:1 อัตโนมัติ + เบลอได้ ตั้งค่าต่อเทมเพลต
- Multiple templates per server (Forum A → template 1, Forum B → template 2, ...)
  หลายเทมเพลตต่อเซิร์ฟเวอร์ (ฟอรั่ม A ใช้แบบ 1, ฟอรั่ม B ใช้แบบ 2 ฯลฯ)
- `/edit` opens a button + form panel to change color/title/description/author/footer/image settings — no code or file editing
  `/edit` เปิดแผงปุ่ม+ฟอร์มแก้ สี/หัวข้อ/คำอธิบาย/ผู้เขียน/footer/รูปภาพ ไม่ต้องแก้โค้ด
- Short memorable commands: `/edit`, `/forum`, `/template`, `/language`
  คำสั่งสั้น จำง่าย: `/edit`, `/forum`, `/template`, `/language`
- @everyone / @here / role mentions supported per template
  แท็ก @everyone / @here / role ได้ (ตั้งต่อเทมเพลต)
- Works on any server, multiple servers at once — each server's forums/templates are fully separate
  ใช้ได้ทุกเซิร์ฟเวอร์ พร้อมกันหลายเซิร์ฟเวอร์ — ข้อมูลแยกกันคนละชุดต่อเซิร์ฟเวอร์
- Works normally on Age-Restricted (NSFW) forum channels
  รองรับฟอรั่มที่เป็น Age-Restricted (NSFW) ปกติ

## Project structure / โครงสร้างไฟล์
```
config.json                     ← all servers' forums/templates/language (auto-managed)
index.js                        ← main bot file
deploy-commands.js              ← registers slash commands (run once, or again when commands change)
keepAlive.js                    ← optional web server to prevent sleep on Replit/Glitch
locales/en.js, locales/th.js    ← UI text in English / Thai
utils/i18n.js                   ← translation helper
utils/configStore.js            ← read/write config.json, per-guild helpers
utils/imageProcessor.js         ← 1:1 crop + blur
utils/templateAutocomplete.js   ← template name autocomplete for /forum and /template
interactions/editPanel.js       ← buttons/forms behind /edit
interactions/forumManager.js    ← /forum command logic
interactions/templateManager.js ← /template command logic
interactions/language.js        ← /language command logic
```

## Setup / ขั้นตอนติดตั้ง

### 1. Create the bot / สร้างบอทใน Discord Developer Portal
1. https://discord.com/developers/applications → New Application
2. Tab **Bot** → Reset Token → copy it (`DISCORD_TOKEN`)
3. Turn on **MESSAGE CONTENT INTENT**
4. Tab **General Information** → copy **Application ID** (`CLIENT_ID`)

### 2. Invite the bot / เชิญบอทเข้าเซิร์ฟเวอร์
Tab **OAuth2 → URL Generator**
- Scopes: `bot`, `applications.commands`
- Bot Permissions: View Channels, Send Messages, Embed Links, Attach Files, Read Message History, Mention Everyone
- Open the generated link, pick a server. Repeat this link anytime to invite the bot to more servers — no extra setup needed per server.

> NSFW/Age-Restricted forums: just make sure the bot's role can see/read that channel. No extra config needed.

### 3. Install / ติดตั้งโปรแกรม (Node.js 18+)
```bash
npm install
```

### 4. Configure .env / ตั้งค่า .env
Copy `.env.example` to `.env` and fill in:
```
DISCORD_TOKEN=your bot token
CLIENT_ID=your application ID
```
`GUILD_ID` is now optional — leave it blank so commands register globally (work on every server). Only set it during development to make command updates apply instantly to one test server.

### 5. Register commands / ลงทะเบียนคำสั่ง (once)
```bash
npm run deploy-commands
```
Without `GUILD_ID`, this registers **global** commands — works everywhere the bot is invited (may take up to ~1 hour to fully propagate the first time, instant afterwards for newly-invited servers).

### 6. Run the bot / รันบอท
```bash
npm start
```

## First-time setup per server / ตั้งค่าครั้งแรกในแต่ละเซิร์ฟเวอร์
Run these in Discord (needs Manage Server permission):

1. `/language lang:ไทย (Thai)` — optional, switch this server's bot text to Thai
2. `/template new id:templateA` — create a template
3. `/edit` → pick `templateA` → customize color/title/etc.
4. `/forum add forum:<Forum A> announce:<announce channel> template:templateA`
5. Repeat 2-4 with `templateB` for Forum B, and so on

## Commands / คำสั่งทั้งหมด

| Command | What it does |
|---|---|
| `/edit` | Open the button+form panel to edit a template's color/title/description/author/footer/image settings |
| `/forum add` | Add a forum: source forum, announce channel, template |
| `/forum set` | Change an existing forum's template |
| `/forum remove` | Remove a forum |
| `/forum list` | List this server's forums |
| `/template new` | Create a new (blank) template |
| `/template del` | Delete a template (blocked if a forum still uses it) |
| `/language` | Switch this server's bot text between English / Thai |

Typing the `template` option shows autocomplete suggestions from existing template names.

All commands require the **Manage Server** permission.

## Deploy on Render / วิธี Deploy บน Render (ฟรี)

1. Push this folder to a GitHub repo (`.env` won't be uploaded — it's in `.gitignore`)
   อัปโฟลเดอร์นี้ขึ้น GitHub repo (`.env` จะไม่ถูกอัปเพราะอยู่ใน `.gitignore` แล้ว)
2. On [render.com](https://render.com) → **New +** → **Web Service** → connect this repo
   บน render.com → New + → Web Service → เชื่อมกับ repo นี้
3. Render auto-detects `render.yaml` (Build: `npm install`, Start: `npm start`, plan: Free)
   Render จะอ่านค่าจาก `render.yaml` ให้อัตโนมัติ
4. In the **Environment** tab, fill in the two required secrets:
   ในแท็บ Environment ใส่ค่า secret 2 ตัว:
   - `DISCORD_TOKEN` = your bot token
   - `CLIENT_ID` = your Application ID
   (`ENABLE_KEEPALIVE=true` is already set by render.yaml)
5. Deploy → copy the `https://xxxx.onrender.com` URL Render gives you
   Deploy เสร็จแล้ว copy URL ที่ได้มา
6. Register slash commands once from your own computer (Render only runs `npm start`):
   รันคำสั่งนี้จากเครื่องตัวเองครั้งเดียว (Render รันแค่ `npm start`):
   ```bash
   npm run deploy-commands
   ```
7. Free tier sleeps after 15 min with no traffic. To keep the bot online 24/7, add the Render URL as an **HTTP(s) monitor** on [uptimerobot.com](https://uptimerobot.com) pinging every 5–10 minutes.
   แผนฟรีจะหลับถ้าไม่มี traffic 15 นาที ให้เอา URL ของ Render ไปตั้งเป็น Monitor บน UptimeRobot ให้ ping ทุก 5-10 นาที เพื่อกันหลับ

## Common issues / แก้ปัญหาที่เจอบ่อย

| Symptom | Likely cause |
|---|---|
| `TOKEN_INVALID` on start | Wrong/missing token in `.env` |
| Bot online but no announcement posted | MESSAGE CONTENT INTENT off, or forum not added via `/forum add` |
| `/edit`, `/forum`, etc. not showing up | `npm run deploy-commands` not run yet, or still propagating (global commands can take up to ~1 hour first time) |
| `sharp` install error | Delete `node_modules`, update Node.js, `npm install` again |
| @everyone doesn't ping | Bot invited without "Mention Everyone" permission |
