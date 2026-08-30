const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config.json');

function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const config = JSON.parse(raw);
  if (!config.guilds) config.guilds = {};
  return config;
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}

/**
 * ดึงข้อมูล (ฟอรั่ม/เทมเพลต) เฉพาะของเซิร์ฟเวอร์นั้นๆ ออกมา
 * ถ้าเซิร์ฟเวอร์นี้ยังไม่เคยตั้งค่าอะไรเลย จะสร้างโครงสร้างว่างให้อัตโนมัติ
 * (ยังไม่บันทึกลงไฟล์จนกว่าจะมีการ saveConfig ตามหลัง)
 */
function getGuildConfig(config, guildId) {
  if (!config.guilds) config.guilds = {};
  if (!config.guilds[guildId]) {
    config.guilds[guildId] = {
      forums: [],
      templates: {},
      onlyImages: true,
      lang: 'en', // ค่าเริ่มต้นเป็นภาษาอังกฤษ เปลี่ยนได้ด้วย /language
    };
  }
  if (!config.guilds[guildId].lang) {
    config.guilds[guildId].lang = 'en';
  }
  return config.guilds[guildId];
}

module.exports = { loadConfig, saveConfig, getGuildConfig };
