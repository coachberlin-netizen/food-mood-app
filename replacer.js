const fs = require('fs');
const path = require('path');

const srcDir = path.join('C:\\Users\\coach\\.gemini\\antigravity\\scratch\\food-mood', 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Backgrounds
    content = content.replace(/bg-\[#FDFBF7\]/g, 'bg-aubergine');
    content = content.replace(/bg-white/g, 'bg-cream');
    
    // Navy specifically
    content = content.replace(/bg-navy/g, 'bg-aubergine-dark');
    content = content.replace(/text-navy/g, 'text-aubergine-dark');
    content = content.replace(/border-navy/g, 'border-aubergine-dark');
    
    // Hardcoded Navy hex
    content = content.replace(/text-\[#1B2A49\]/g, 'text-aubergine-dark');
    content = content.replace(/bg-\[#1B2A49\]/g, 'bg-aubergine-dark');
    content = content.replace(/border-\[#1B2A49\]/g, 'border-aubergine-dark');
    
    // Hardcoded gray borders
    content = content.replace(/border-\[#edeae3\]/g, 'border-aubergine-dark/20');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
    }
});
console.log('Mass replacement complete!');
