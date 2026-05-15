const fs = require('fs');

const files = [
  'src/app/retos/recupera-tu-energia/page.tsx',
  'src/app/retos/equilibrio-hormonal-45/page.tsx',
  'src/app/retos/microhabitos/page.tsx',
  'src/app/retos/slow-food-mood/page.tsx',
  'src/app/retos/activa-tu-longevidad/page.tsx',
  'src/app/retos/reset-antiinflamatorio/page.tsx',
];

// Each entry: [garbled_string, correct_char]
// Garbled sequences are Windows-1252 misinterpretations of UTF-8 bytes
const pairs = [
  // Ã + Latin-1 char → Spanish accented lowercase
  ['Ã¡', 'á'],  // Ã¡ → á
  ['Ã©', 'é'],  // Ã© → é
  ['Ã­', 'í'],  // Ã­ → í
  ['Ã³', 'ó'],  // Ã³ → ó
  ['Ãº', 'ú'],  // Ãº → ú
  ['Ã±', 'ñ'],  // Ã± → ñ
  ['Ã¼', 'ü'],  // Ã¼ → ü
  ['Ã§', 'ç'],  // Ã§ → ç
  ['Ã¨', 'è'],  // Ã¨ → è
  // Â + Latin-1 char → special chars
  ['Â·', '·'],  // Â· → · (middle dot)
  ['Â¿', '¿'],  // Â¿ → ¿
  ['Â¡', '¡'],  // Â¡ → ¡
  ['Âº', 'º'],  // Âº → º
  ['Â°', '°'],  // Â° → °
  ['Â£', '£'],  // Â£ → £
  ['Â§', '§'],  // Â§ → §
  ['Â©', '©'],  // Â© → ©
  ['Â®', '®'],  // Â® → ®
  // â + € (Win1252 byte 0x80) + third char → dashes, quotes
  // em dash: E2 80 94 → â + € (0x80) + " (0x94=U+201D)
  ['â€”', '—'],  // â€" → —
  // en dash: E2 80 93 → â + € (0x80) + " (0x93=U+201C)
  ['â€“', '–'],  // â€" → –
  // em dash fallback with ASCII quote (after earlier curly-quote fix)
  ['â€"', '—'],       // â€" → —
  // right single curly: E2 80 99 → â + € + ™ (0x99=U+2122)
  ['â€™', '’'],  // â€™ → '
  // left single curly: E2 80 98 → â + € + ˜ (0x98=U+02DC)
  ['â€˜', '‘'],  // â€˜ → '
  // bullet: E2 80 A2 → â + € + ¢ (0xA2=U+00A2)
  ['â€¢', '•'],  // â€¢ → •
  // euro sign: E2 82 AC → â + ‚ (0x82=U+201A) + ¬ (U+00AC)
  ['â‚¬', '€'],  // â‚¬ → €
  // checkmark ✓ (U+2713): E2 9C 93 → â + œ (U+0153, byte 9C) + " (U+201C, byte 93)
  ['âœ"', '✓'],
  // heavy checkmark ✔ (U+2714): E2 9C 94 → â + œ (U+0153) + " (U+201D, byte 94)
  ['âœ"', '✔'],
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);

  for (const [from, to] of pairs) {
    content = content.split(from).join(to);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed:', file);
}
