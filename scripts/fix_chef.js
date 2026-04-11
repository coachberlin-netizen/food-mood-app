const fs = require('fs');
let content = fs.readFileSync('scripts/insert_women_plus45_chef_recipes.cjs', 'utf8');
content = content.replace(/premium_level: 1/g, 'premium_level: 2');
content = content.replace(/sexo: "mujer"/g, 'sexo: "unisex"');
content = content.replace(/grupo_edad: "45-60"/g, 'grupo_edad: "31-50"');
fs.writeFileSync('scripts/insert_women_plus45_chef_recipes.cjs', content);
console.log('Fixed chef script to have premium_level 2 and unisex/31-50 fields.');
