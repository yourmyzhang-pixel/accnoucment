const sharp = require('sharp');

async function fetchImageBuffer(url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * ดาวน์โหลดรูปแล้วนำมาครอปเป็น 1:1 (ตรงกลาง) และเบลอตามค่าที่ตั้งไว้
 * @param {string} url ลิงก์รูปต้นฉบับ
 * @param {{cropSquare?: boolean, blur?: number}} options
 * @returns {Promise<Buffer>} buffer ของรูปที่แต่งเสร็จแล้ว (jpeg)
 */
async function processImage(url, options = {}) {
  const { cropSquare = true, blur = 0 } = options;

  const buffer = await fetchImageBuffer(url);
  let img = sharp(buffer).rotate(); // rotate() = auto-orient ตาม EXIF

  if (cropSquare) {
    const metadata = await img.metadata();
    if (metadata.width && metadata.height) {
      const size = Math.min(metadata.width, metadata.height);
      const left = Math.floor((metadata.width - size) / 2);
      const top = Math.floor((metadata.height - size) / 2);
      img = img.extract({ left, top, width: size, height: size });
    }
  }

  const blurAmount = Number(blur) || 0;
  // sharp ต้องการค่า sigma อย่างน้อย 0.3 ถึงจะเบลอได้จริง
  if (blurAmount >= 0.3) {
    img = img.blur(blurAmount);
  }

  return img.jpeg({ quality: 90 }).toBuffer();
}

module.exports = { processImage };
