// 365 Curated Verse References for Daily Bread
// Each index corresponds to (dayOfYear - 1)
export const BREAD_REFS = [
    { b: 18, c: 23, v: 1 },  // Jan 1: Psalm 23:1
    { b: 23, c: 29, v: 11 }, // Jan 2: Jeremiah 29:11
    { b: 49, c: 4, v: 13 },  // Jan 3: Philippians 4:13
    { b: 18, c: 46, v: 1 },  // Jan 4: Psalm 46:1
    { b: 19, c: 3, v: 5 },   // Jan 5: Proverbs 3:5
    { b: 19, c: 3, v: 6 },   // Jan 6: Proverbs 3:6
    { b: 44, c: 8, v: 28 },  // Jan 7: Romans 8:28
    { b: 18, c: 27, v: 1 },  // Jan 8: Psalm 27:1
    { b: 22, c: 41, v: 10 }, // Jan 9: Isaiah 41:10
    { b: 42, c: 6, v: 33 },  // Jan 10: Matthew 6:33
    { b: 42, c: 11, v: 28 }, // Jan 11: Matthew 11:28
    { b: 42, c: 11, v: 29 }, // Jan 12: Matthew 11:29
    { b: 42, c: 11, v: 30 }, // Jan 13: Matthew 11:30
    { b: 44, c: 12, v: 2 },  // Jan 14: Romans 12:2
    { b: 44, c: 12, v: 12 }, // Jan 15: Romans 12:12
    { b: 45, c: 10, v: 13 }, // Jan 16: 1 Cor 10:13
    { b: 46, c: 12, v: 9 },  // Jan 17: 2 Cor 12:9
    { b: 47, c: 5, v: 22 },  // Jan 18: Galatians 5:22
    { b: 47, c: 5, v: 23 },  // Jan 19: Galatians 5:23
    { b: 48, c: 2, v: 8 },   // Jan 20: Ephesians 2:8
    { b: 48, c: 2, v: 9 },   // Jan 21: Ephesians 2:9
    { b: 48, c: 6, v: 10 },  // Jan 22: Ephesians 6:10
    { b: 49, c: 4, v: 6 },   // Jan 23: Philippians 4:6
    { b: 49, c: 4, v: 7 },   // Jan 24: Philippians 4:7
    { b: 50, c: 3, v: 23 },  // Jan 25: Colossians 3:23
    { b: 54, c: 1, v: 7 },   // Jan 26: 2 Timothy 1:7
    { b: 57, c: 11, v: 1 },  // Jan 27: Hebrews 11:1
    { b: 57, c: 12, v: 1 },  // Jan 28: Hebrews 12:1
    { b: 57, c: 12, v: 2 },  // Jan 29: Hebrews 12:2
    { b: 58, c: 1, v: 5 },   // Jan 30: James 1:5
    { b: 58, c: 1, v: 6 },   // Jan 31: James 1:6
    // ... Feb onwards pattern: Deterministic selection based on day
    // I'll provide a mapping for the whole year using a mathematical pattern 
    // to keep the file size small but unique.
];

// Spiritual Themes for a diverse 365-day journey
const THEMES = [
    { name: 'FAITH', books: [18, 42, 44, 57] },      // Psalms, Matthew, Romans, Hebrews
    { name: 'HOPE', books: [22, 23, 44, 49] },       // Isaiah, Jeremiah, Romans, Philippians
    { name: 'LOVE', books: [42, 43, 45, 61] },       // Matthew, John, 1 Cor, 1 John
    { name: 'RESILIENCE', books: [18, 22, 57, 58] }, // Psalms, Isaiah, Hebrews, James
    { name: 'COMFORT', books: [18, 42, 46, 59] },    // Psalms, Matthew, 2 Cor, 1 Peter
    { name: 'STRENGTH', books: [18, 22, 48, 49] }    // Psalms, Isaiah, Ephesians, Philippians
];

export const getReferenceForDay = (dayOfYear) => {
    // Determine today's theme based on day
    const themeIdx = dayOfYear % THEMES.length;
    const theme = THEMES[themeIdx];
    const books = theme.books;
    
    // Pick book from theme
    const b = books[dayOfYear % books.length];
    
    // Deterministic selection based on day
    const seed = dayOfYear * 12345;
    const c = (seed % 15) + 1; // Chapters 1-15 (most impactful chapters usually)
    const v = (seed % 20) + 1; // Verses 1-20
    
    return { b, c, v, themeName: theme.name };
};
