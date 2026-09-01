module.exports = {
  language: {
    changed: '✅ ตั้งค่าภาษาเป็นไทยแล้ว',
  },
  forum: {
    templateNotFound:
      'ไม่พบเทมเพลต "{id}" ในเซิร์ฟเวอร์นี้ — สร้างก่อนด้วย `/template new`',
    alreadyAdded:
      'ฟอรั่มนี้ถูกเพิ่มไว้แล้ว (ใช้เทมเพลต "{id}") ใช้ `/forum set` เพื่อเปลี่ยนแทน',
    added:
      '✅ เพิ่มฟอรั่ม **{name}** แล้ว\n- ฟอรั่ม: <#{forumId}>\n- ประกาศที่: <#{announceId}>\n- เทมเพลต: **{template}**',
    notInList: 'ไม่พบฟอรั่มนี้ในรายการ',
    removed: '🗑️ ลบฟอรั่ม <#{forumId}> ออกจากรายการแล้ว',
    setDone: '✅ เปลี่ยนให้ <#{forumId}> ใช้เทมเพลต **{template}** แล้ว',
    notAddedYet: 'ฟอรั่มนี้ยังไม่ได้ถูกเพิ่ม ใช้ `/forum add` ก่อน',
    listEmpty: 'ยังไม่มีฟอรั่มในระบบเลย ลองเพิ่มด้วย `/forum add`',
    listTitle: 'รายการฟอรั่มของเซิร์ฟเวอร์นี้',
    listLine:
      '• <#{forumId}> → ประกาศที่ <#{announceId}> (เทมเพลต: **{template}**)',
  },
  template: {
    invalidId: 'ชื่อรหัสเทมเพลตใช้ได้แค่ตัวอักษร a-z, ตัวเลข, - และ _ เท่านั้น',
    alreadyExists: 'มีเทมเพลตชื่อ "{id}" อยู่แล้วในเซิร์ฟเวอร์นี้',
    created: '✅ สร้างเทมเพลต **{id}** แล้ว (ค่าเริ่มต้น) ใช้ `/edit` เพื่อปรับแต่งต่อได้เลย',
    notFound: 'ไม่พบเทมเพลต "{id}" ในเซิร์ฟเวอร์นี้',
    inUse:
      '❌ ลบไม่ได้ เพราะเทมเพลต **{id}** ยังถูกใช้อยู่กับฟอรั่ม: {forums}\nกรุณาเปลี่ยนเทมเพลตของฟอรั่มเหล่านั้นก่อนด้วย `/forum set` (หรือ `/forum remove`) แล้วค่อยลบอีกครั้ง',
    deleted: '🗑️ ลบเทมเพลต **{id}** แล้ว',
    defaultTitle: '📢 มีภาพใหม่ในฟอรั่ม!',
    defaultDescription: 'มีคนโพสต์ภาพใหม่ในกระทู้ **{threadName}**\nโดย {author}',
  },
  edit: {
    selectPlaceholder: 'เลือกเทมเพลตที่ต้องการแก้ไข',
    noTemplates: 'เซิร์ฟเวอร์นี้ยังไม่มีเทมเพลตเลย สร้างก่อนด้วย `/template new`',
    selectPrompt: 'เลือกเทมเพลตที่ต้องการแก้ไข:',
    editingHeader: 'กำลังแก้ไขเทมเพลต: **{id}**\nเลือกสิ่งที่ต้องการแก้ไข:',
    buttonBasic: 'ข้อมูลพื้นฐาน',
    buttonAuthor: 'ผู้เขียน',
    buttonFooter: 'Footer',
    buttonImage: 'รูปภาพ',
    modalBasicTitle: 'แก้ไขข้อมูลพื้นฐาน',
    fieldTitle: 'หัวข้อประกาศ',
    fieldDescription: 'คำอธิบาย (ใช้ {threadName} {author} ได้)',
    fieldColor: 'สี (hex เช่น #00B0F4)',
    modalAuthorTitle: 'แก้ไขผู้เขียน',
    fieldAuthorName: 'ชื่อผู้เขียน',
    fieldIconUrl: 'ลิงก์ไอคอน',
    fieldLinkUrl: 'ลิงก์เมื่อกดชื่อ',
    modalFooterTitle: 'แก้ไข Footer',
    fieldFooterText: 'ข้อความ Footer',
    modalImageTitle: 'แก้ไขการตกแต่งรูปภาพ',
    fieldCropSquare: 'ครอปเป็น 1:1 หรือไม่? (yes/no)',
    fieldBlur: 'ระดับความเบลอ (0 = ไม่เบลอ, แนะนำ 0-20)',
    notFound: 'ไม่พบเทมเพลตนี้แล้ว',
    saved: '✅ บันทึกเทมเพลต **{id}** เรียบร้อยแล้ว',
  },
};
