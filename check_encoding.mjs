import fs from 'fs';
import path from 'path';

const files = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'src/data/moods.ts',
  'src/components/ui/Button.tsx',
  'src/components/chat/ChatWidget.tsx'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  const buffer = fs.readFileSync(filePath);
  
  // Check for BOM (UTF-8 BOM is EF BB BF)
  const isBOM = buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF;
  
  console.log(`File: ${file}`);
  console.log(`- Size: ${buffer.length} bytes`);
  console.log(`- BOM: ${isBOM ? 'YES (UTF-8)' : 'NO'}`);
  
  // Basic UTF-8 validation
  try {
    const content = buffer.toString('utf8');
    const reencoded = Buffer.from(content, 'utf8');
    if (Buffer.compare(buffer.subarray(isBOM ? 3 : 0), reencoded) !== 0) {
      console.log(`- Encoding: Potential non-UTF-8 or corrupt characters found.`);
    } else {
      console.log(`- Encoding: UTF-8 valid`);
    }
  } catch (e) {
    console.log(`- Encoding: Invalid UTF-8`);
  }
  console.log('');
});
