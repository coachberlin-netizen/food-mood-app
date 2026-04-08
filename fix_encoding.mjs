import fs from 'fs';
import path from 'path';

const filesToFix = [
  'src/app/page.tsx',
  'src/data/moods.ts',
  'src/app/layout.tsx',
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  const content = fs.readFileSync(filePath);
  
  // Remove BOM if it exists
  let cleanedContent = content;
  if (content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
    console.log(`- UTF-8 BOM removed from: ${file}`);
    cleanedContent = content.subarray(3);
  } else if (content[0] === 0xFF && content[1] === 0xFE) {
    console.log(`- UTF-16LE BOM found in: ${file}. Converting to UTF-8.`);
    cleanedContent = Buffer.from(content.toString('utf16le'), 'utf8');
  } else if (content[0] === 0xFE && content[1] === 0xFF) {
    console.log(`- UTF-16BE BOM found in: ${file}. Converting to UTF-8.`);
    cleanedContent = Buffer.from(content.swap16().toString('utf16le'), 'utf8');
  } else {
    // If no BOM, let's still ensure it's valid UTF-8. 
    // We'll just write it back as UTF-8 to be safe.
    cleanedContent = Buffer.from(content.toString('utf8'), 'utf8');
  }

  fs.writeFileSync(filePath, cleanedContent, { encoding: 'utf8' });
  console.log(`- Successfully re-saved: ${file} (size: ${cleanedContent.length} bytes)`);
});
