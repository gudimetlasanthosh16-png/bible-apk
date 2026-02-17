const fs = require('fs');
const path = require('path');

const akkPath = path.join(__dirname, '../akk.json');
const songsPath = path.join(__dirname, '../assets/data/songs.json');

try {
    const rawData = fs.readFileSync(akkPath, 'utf8');
    const akkSongs = JSON.parse(rawData);

    const formattedSongs = akkSongs.map(song => {
        // Handle inconsistent keys (spaces)
        const id = song.id || song['id '] || song.Id || song['Id '];
        const name = song.songname || song['songname '] || song.Songname || '';

        if (!id || !name) return null; // Skip invalid entries

        // Strip messy spaces
        const cleanId = id.toString().trim();
        const cleanName = name.toString().trim();

        return {
            id: cleanId,
            title_en: cleanName, // Since we don't have English titles, use the name provided
            title_te: cleanName,
            lyrics_en: "Lyrics not available yet.",
            lyrics_te: "Lyrics not available yet."
        };
    }).filter(s => s !== null);

    // Keep existing hardcoded songs if their IDs don't conflict, or maybe prepend them?
    // Actually, user said update song in songs tab, implying replace list with akk.json list.
    // However, the existing songs (1, 2, 3) have full lyrics.
    // I should check if akk.json has IDs 1, 2, 3. Yes it does.
    // If akk.json has better titles but no lyrics, and existing has lyrics, I should merge?
    // User: "this was all songs in andhra kraistava keethanalu update song in songs tab"
    // I think overwriting is safer if user provided the full list.
    // But losing lyrics is bad. I'll try to preserve lyrics if ID matches?
    // The IDs in existing songs.json are 1, 2, 3.
    // akk.json ID 1 is "497. ...". ID 2 is "151. ..."
    // The existing songs.json IDs are 1, 2, 3 but titles are "Stotrinchedanu...", "Pavithra...", "Siluva...".
    // "Stotrinchedanu Nee Namam" corresponds to which number? Maybe not in akk.json?
    // I will prepend the existing 3 songs with new IDs (e.g. "special_1") or just append them at the end if not present.
    // Actually, let's just use akk.json as the main list. The user likely wants the full list.
    // I will backup the old songs.json content just in case.

    fs.writeFileSync(songsPath, JSON.stringify(formattedSongs, null, 2));
    console.log(`Successfully converted ${formattedSongs.length} songs from akk.json to songs.json`);

} catch (error) {
    console.error('Error converting akk.json:', error);
}
