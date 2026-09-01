const en = require('../locales/en');
const th = require('../locales/th');

const locales = { en, th };

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

/**
 * แปลข้อความตาม lang ที่ระบุ ('en' หรือ 'th')
 * ถ้าไม่พบ lang หรือ key นั้น จะ fallback กลับไปใช้ภาษาอังกฤษ
 * รองรับแทนค่าตัวแปรในข้อความด้วย {ชื่อตัวแปร}
 */
function t(lang, key, vars = {}) {
  const dict = locales[lang] || locales.en;
  let str = getPath(dict, key) ?? getPath(locales.en, key) ?? key;
  for (const [k, v] of Object.entries(vars)) {
    str = str.replaceAll(`{${k}}`, v);
  }
  return str;
}

module.exports = { t };
