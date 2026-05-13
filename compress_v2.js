const fs = require('fs');
const path = require('path');

const ENGLISH_BOOKS = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
    "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
    "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
    "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
    "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts",
    "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
    "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
    "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
    "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
    "Jude", "Revelation"
];

function getBookIndex(name) {
    if (name === 'Psalm') name = 'Psalms';
    return ENGLISH_BOOKS.indexOf(name);
}

console.log("Loading data...");
const data = JSON.parse(fs.readFileSync('c:/Users/mamat/bible/assets/data/cross_references_compressed.json', 'utf8'));
const refs = data.cross_references;

const compact = {};
let count = 0;

for (const key in refs) {
    const match = key.match(/^(.+)\s(\d+):(\d+)$/);
    if (!match) continue;
    
    const [_, book, chapter, verse] = match;
    const bIdx = getBookIndex(book);
    if (bIdx === -1) continue;
    
    // Key as integer to save space
    const id = bIdx * 1000000 + parseInt(chapter) * 1000 + parseInt(verse);
    
    const value = refs[key].split(';').map(item => {
        const [toRef, votes] = item.split('|');
        const toMatch = toRef.match(/^(.+)\s(\d+):(\d+)$/);
        if (!toMatch) return null;
        
        const toBIdx = getBookIndex(toMatch[1]);
        if (toBIdx === -1) return null;
        
        // Encode "to" reference as ID: toBIdx_Ch_Ver
        return `${toBIdx}_${toMatch[2]}_${toMatch[3]}`;
    }).filter(Boolean).join(',');
    
    compact[id] = value;
    count++;
}

console.log(`Compressed ${count} verses.`);
fs.writeFileSync('c:/Users/mamat/bible/assets/data/cross_references_v2.json', JSON.stringify(compact));
console.log("Done! Saved to assets/data/cross_references_v2.json");
