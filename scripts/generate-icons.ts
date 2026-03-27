import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SVG_CODE = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#faf9f6"/>
  <text x="50%" y="50%" font-family="'Source Serif 4', serif, Times" font-weight="bold" font-size="280" fill="#1a2332" text-anchor="middle" dominant-baseline="central">FM</text>
</svg>
`;

async function main() {
  const iconsDir = path.join(__dirname, '../public/icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const svgBuffer = Buffer.from(SVG_CODE);

  // 192x192 Standard
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'));

  // 512x512 Standard
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'));

  // 512x512 Maskable
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'));

  console.log('Icons generated successfully.');
}
main().catch(console.error);
