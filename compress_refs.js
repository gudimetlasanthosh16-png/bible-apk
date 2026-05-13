const fs = require('fs');
const path = require('path');

console.log("Loading original file...");
const raw = fs.readFileSync('c:/Users/mamat/bible/assets/data/cross_references_full.bin', 'utf8');

console.log("Parsing...");
const data = JSON.parse(raw);
const refs = data.cross_references;

console.log("Compressing...");
const compressed = {};
let count = 0;

for (const key in refs) {
    const list = refs[key];
    // Sort by votes descending and take top 15 to save space
    const sorted = list.sort((a, b) => b.votes - a.votes).slice(0, 15);
    
    // Convert to string: "John 1:1|128,Psalm 33:6|71"
    const str = sorted.map(ref => `${ref.to}|${ref.votes || 0}`).join(';');
    
    compressed[key] = str;
    count++;
}

console.log(`Processed ${count} verses.`);
fs.writeFileSync('c:/Users/mamat/bible/assets/data/cross_references_compressed.bin', JSON.stringify({ cross_references: compressed }));
console.log("Done! Compressed file saved to assets/data/cross_references_compressed.bin");
