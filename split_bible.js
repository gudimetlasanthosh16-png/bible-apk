const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'assets', 'data', 'telugu_bible.bin');
const outputPath = path.join(__dirname, 'assets', 'data');

try {
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    const books = data.Book;
    const chunkSize = 11;
    
    for (let i = 0; i < books.length; i += chunkSize) {
        const chunk = books.slice(i, i + chunkSize);
        const fileName = `telugu_bible_part_${Math.floor(i / chunkSize) + 1}.bin`;
        fs.writeFileSync(path.join(outputPath, fileName), JSON.stringify({ Book: chunk }));
        console.log(`Saved ${fileName} with ${chunk.length} books.`);
    }
    console.log("Successfully split Telugu Bible into 6 parts.");
} catch (e) {
    console.error("Split failed:", e);
}
