const express = require('express');

/**
 * เปิดเว็บเซิร์ฟเวอร์เล็กๆ ไว้ให้ UptimeRobot (หรือบริการปลุกเว็บอื่นๆ)
 * เข้ามา "เคาะ" เป็นระยะ เพื่อไม่ให้ Replit/Glitch สั่งพักโปรเจกต์เพราะไม่มีการใช้งาน
 * ใช้เฉพาะตอน deploy บนแพลตฟอร์มที่มีระบบ sleep เท่านั้น (เช่น Replit, Glitch)
 * ถ้ารันบน VPS ของตัวเอง (เช่น Oracle Cloud) ไม่จำเป็นต้องใช้ไฟล์นี้
 */
function startKeepAliveServer() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('บอทกำลังทำงานอยู่ ✅');
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🌐 Keep-alive server ทำงานที่พอร์ต ${port}`);
  });
}

module.exports = { startKeepAliveServer };
