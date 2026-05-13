const fs = require('fs');
const content = fs.readFileSync('c:/Users/mamat/bible/assets/data/telugu_bible.json', 'utf8');
const data = JSON.parse(content);
console.log("Keys in root:", Object.keys(data));
if (data.Book) {
  console.log("Number of Books:", data.Book.length);
  if (data.Book[0]) {
    console.log("Keys in Book[0]:", Object.keys(data.Book[0]));
    if (data.Book[0].Chapter) {
      console.log("Number of Chapters in Book[0]:", data.Book[0].Chapter.length);
      if (data.Book[0].Chapter[0]) {
        console.log("Keys in Chapter[0]:", Object.keys(data.Book[0].Chapter[0]));
      }
    }
  }
}
