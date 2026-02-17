const fs = require('fs');
const path = require('path');

const teDir = 'c:/Users/mamat/bible/te';
const songsJsonPath = 'c:/Users/mamat/bible/assets/data/songs.json';

function parseXml(content) {
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/);
    const lyricsMatch = content.match(/<lyrics>([\s\S]*?)<\/lyrics>/);
    const hymnMatch = content.match(/<hymn_number>([\s\S]*?)<\/hymn_number>/);

    return {
        title: titleMatch ? titleMatch[1].trim() : 'Unknown Title',
        lyrics: lyricsMatch ? lyricsMatch[1].trim() : 'Lyrics not available.',
        hymnNumber: hymnMatch ? hymnMatch[1].trim() : ''
    };
}

try {
    const files = fs.readdirSync(teDir);
    const songs = [];

    files.forEach((file, index) => {
        const filePath = path.join(teDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = parseXml(content);

        // Extract ID from filename if hymnNumber is missing
        // Filename example: అంకితం ప్రభూ నా జీవితం i62198
        let id = parsed.hymnNumber;
        if (!id) {
            const idMatch = file.match(/i(\d+)$/);
            id = idMatch ? idMatch[1] : (index + 1).toString();
        }

        const title = parsed.hymnNumber ? `${parsed.hymnNumber}. ${parsed.title}` : parsed.title;

        songs.push({
            id: id,
            title_en: title,
            title_te: title,
            lyrics_en: "Lyrics translated soon...",
            lyrics_te: parsed.lyrics
        });
    });

    // Sort by hymn number if possible
    songs.sort((a, b) => {
        const numA = parseInt(a.title_te.split('.')[0]);
        const numB = parseInt(b.title_te.split('.')[0]);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.id.localeCompare(b.id, undefined, { numeric: true });
    });

    fs.writeFileSync(songsJsonPath, JSON.stringify(songs, null, 2));
    console.log(`Successfully processed ${songs.length} songs.`);
} catch (error) {
    console.error('Error processing songs:', error);
}
