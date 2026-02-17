import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENGLISH_BOOKS, TELUGU_BOOKS } from '../constants/books';
import { COLORS } from '../constants/theme';

export const BibleContext = createContext();

export const BibleProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // 'en' or 'te'
    const [themeMode, setThemeMode] = useState('light'); // 'light' or 'dark'
    const [loading, setLoading] = useState(true);
    const [bibleData, setBibleData] = useState({ en: null, te: null });
    const [commentaryData, setCommentaryData] = useState([]);
    const [crossReferenceData, setCrossReferenceData] = useState([]);
    const [childrenStories, setChildrenStories] = useState([]);
    const [songs, setSongs] = useState([]);
    const [dailyBreadRead, setDailyBreadRead] = useState(false);

    // User Interaction States
    const [highlights, setHighlights] = useState({}); // { verseId: color }
    const [favorites, setFavorites] = useState([]); // [verseId]
    const [underlines, setUnderlines] = useState([]); // [verseId]

    // Gamification / Streak States
    const [streakCount, setStreakCount] = useState(0);
    const [totalReadCount, setTotalReadCount] = useState(0);
    const [lastReadingDate, setLastReadingDate] = useState(null);
    const [totalTimeSpent, setTotalTimeSpent] = useState(0); // in minutes
    const [totalDaysEngaged, setTotalDaysEngaged] = useState(0);
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        loadSettingsAndData();

        // Track time spent - check every minute
        const timer = setInterval(() => {
            updateTimeSpent();
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const loadSettingsAndData = async () => {
        // Force loading to false after a tiny delay to show the brand
        setTimeout(() => setLoading(false), 500);

        try {
            // Background load settings
            AsyncStorage.getItem('language').then(lang => lang && setLanguage(lang));
            AsyncStorage.getItem('theme').then(theme => theme && setThemeMode(theme));
            AsyncStorage.getItem('highlights').then(data => data && setHighlights(JSON.parse(data)));
            AsyncStorage.getItem('favorites').then(data => data && setFavorites(JSON.parse(data)));
            AsyncStorage.getItem('underlines').then(data => data && setUnderlines(JSON.parse(data)));

            // Load streak data
            const streakData = await AsyncStorage.getItem('userStreakData');
            if (streakData) {
                const parsed = JSON.parse(streakData);
                setStreakCount(parsed.count || 0);
                setTotalReadCount(parsed.total || 0);
                setLastReadingDate(parsed.lastDate || null);
                setTotalTimeSpent(parsed.timeSpent || 0);
                setTotalDaysEngaged(parsed.daysEngaged || 0);
                setBadges(parsed.badges || []);

                // Reset streak if last read was more than 1 day ago
                if (parsed.lastDate) {
                    const last = new Date(parsed.lastDate);
                    const now = new Date();
                    last.setHours(0, 0, 0, 0);
                    now.setHours(0, 0, 0, 0);
                    const diff = (now - last) / (1000 * 60 * 60 * 24);
                    if (diff > 1) {
                        setStreakCount(0);
                        const newData = { ...parsed, count: 0 };
                        await AsyncStorage.setItem('userStreakData', JSON.stringify(newData));
                    }
                }
            }

            // Check if daily bread was read today
            const lastReadData = await AsyncStorage.getItem('dailyBreadLastRead');
            if (lastReadData) {
                const { date } = JSON.parse(lastReadData);
                const today = new Date().toDateString();
                if (date === today) {
                    setDailyBreadRead(true);
                }
            }

            // Background load sacred texts after home screen is ready
            setTimeout(() => {
                console.log("Loading sacred texts in background...");
                try {
                    const commData = require('../../assets/data/commentary.json');
                    const kidsData = require('../../assets/data/children_stories.json');
                    const songsData = require('../../assets/data/songs.json');
                    const xrefData = require('../../assets/data/cross_references.json');

                    setCommentaryData(commData);
                    setChildrenStories(kidsData);
                    setSongs(songsData);
                    setCrossReferenceData(xrefData);

                    // Load heavy Bible volumes
                    const enData = require('../../assets/data/english_bible.json');
                    const teData = require('../../assets/data/telugu_bible.json');
                    setBibleData({ en: enData, te: teData });

                    console.log("Background load complete.");
                } catch (err) {
                    console.warn("Background load deferred or failed:", err);
                }
            }, 1000);
        } catch (e) {
            console.error("Context initialization error:", e);
            setLoading(false);
        }
    };

    const switchLanguage = async (lang) => {
        try {
            setLanguage(lang);
            await AsyncStorage.setItem('language', lang);
        } catch (e) {
            console.error("Failed to save language", e);
        }
    };

    const toggleTheme = async () => {
        try {
            const newTheme = themeMode === 'light' ? 'dark' : 'light';
            setThemeMode(newTheme);
            await AsyncStorage.setItem('theme', newTheme);
        } catch (e) {
            console.error("Failed to save theme", e);
        }
    };

    const getBookName = (bookIndex, lang = language) => {
        if (lang === 'te') {
            return TELUGU_BOOKS[bookIndex] || ENGLISH_BOOKS[bookIndex];
        }
        return ENGLISH_BOOKS[bookIndex];
    };

    const getBookData = (bookIndex, lang = language) => {
        const data = lang === 'te' ? bibleData.te : bibleData.en;
        if (data && data.Book && data.Book[bookIndex]) {
            return data.Book[bookIndex];
        }
        return null;
    };

    const getChapterContent = (bookIndex, chapterIndex, lang = language) => {
        const book = getBookData(bookIndex, lang);
        if (book && book.Chapter && book.Chapter[chapterIndex]) {
            return book.Chapter[chapterIndex].Verse;
        }
        return [];
    };

    const getCommentaryForVerse = (bookName, chapter, verse) => {
        if (!commentaryData) return null;
        return commentaryData.find(c =>
            c.book === bookName &&
            c.chapter === chapter &&
            c.verse === verse
        );
    };

    const getCrossReferences = (bookName, chapter, verse) => {
        if (!crossReferenceData) return [];

        // 1. References defined FOR this verse (Forward)
        const forwardEntry = crossReferenceData.find(c =>
            c.book === bookName &&
            c.chapter === chapter &&
            c.verse === verse
        );
        const forwardRefs = forwardEntry ? forwardEntry.references : [];

        // 2. References that POINT TO this verse (Backward)
        const backwardRefs = crossReferenceData.filter(c =>
            c.references.some(r =>
                r.book === bookName &&
                r.chapter === chapter &&
                r.verse === verse
            )
        ).map(c => ({
            book: c.book,
            chapter: c.chapter,
            verse: c.verse,
            text: `Cross-referenced from ${c.book} ${c.chapter}:${c.verse}`
        }));

        // Merge and ensure uniqueness by Book-Chapter-Verse
        const allRefs = [...forwardRefs, ...backwardRefs];
        const uniqueRefs = [];
        const seen = new Set();

        for (const ref of allRefs) {
            const key = `${ref.book}-${ref.chapter}-${ref.verse}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueRefs.push(ref);
            }
        }

        return uniqueRefs;
    };

    const searchBible = (query, lang = language) => {
        if (!query || query.length < 2) return [];
        const data = lang === 'te' ? bibleData.te : bibleData.en;
        if (!data || !data.Book) return [];

        const results = [];
        const lowerQuery = query.toLowerCase();

        data.Book.forEach((book, bIdx) => {
            const bookName = getBookName(bIdx, lang);
            book.Chapter.forEach((chapter, cIdx) => {
                chapter.Verse.forEach((verse, vIdx) => {
                    if (verse.Verse.toLowerCase().includes(lowerQuery)) {
                        results.push({
                            bookIndex: bIdx,
                            bookName: bookName,
                            chapterIndex: cIdx,
                            verseNumber: vIdx + 1,
                            text: verse.Verse,
                            id: verse.Verseid
                        });
                    }
                });
            });
        });

        return results;
    };

    const markDailyBreadRead = async () => {
        try {
            const today = new Date().toDateString();
            await AsyncStorage.setItem('dailyBreadLastRead', JSON.stringify({ date: today }));
            setDailyBreadRead(true);
        } catch (e) {
            console.error("Failed to save daily bread status", e);
        }
    };

    const toggleHighlight = async (verseId, color) => {
        const newHighlights = { ...highlights };
        if (newHighlights[verseId] === color) {
            delete newHighlights[verseId];
        } else {
            newHighlights[verseId] = color;
        }
        setHighlights(newHighlights);
        await AsyncStorage.setItem('highlights', JSON.stringify(newHighlights));
    };

    const toggleFavorite = async (verseId) => {
        let newFavorites = [...favorites];
        if (newFavorites.includes(verseId)) {
            newFavorites = newFavorites.filter(id => id !== verseId);
        } else {
            newFavorites.push(verseId);
        }
        setFavorites(newFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    const toggleUnderline = async (verseId) => {
        let newUnderlines = [...underlines];
        if (newUnderlines.includes(verseId)) {
            newUnderlines = newUnderlines.filter(id => id !== verseId);
        } else {
            newUnderlines.push(verseId);
        }
        setUnderlines(newUnderlines);
        await AsyncStorage.setItem('underlines', JSON.stringify(newUnderlines));
    };

    const updateReadingActivity = async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString();

        let newCount = streakCount;
        let newTotal = totalReadCount + 1;
        let newDaysEngaged = totalDaysEngaged;

        if (!lastReadingDate) {
            newCount = 1;
            newDaysEngaged = 1;
        } else {
            const last = new Date(lastReadingDate);
            last.setHours(0, 0, 0, 0);
            const diff = (today - last) / (1000 * 60 * 60 * 24);

            if (diff === 1) {
                newCount += 1;
                newDaysEngaged += 1;
            } else if (diff > 1) {
                newCount = 1;
                newDaysEngaged += 1;
            }
            // if diff === 0, keep same count (already counted today)
        }

        setStreakCount(newCount);
        setTotalReadCount(newTotal);
        setLastReadingDate(todayStr);
        setTotalDaysEngaged(newDaysEngaged);

        const badgeList = checkBadges(newTotal, newDaysEngaged, totalTimeSpent, newCount);
        setBadges(badgeList);

        const streakData = {
            count: newCount,
            total: newTotal,
            lastDate: todayStr,
            timeSpent: totalTimeSpent,
            daysEngaged: newDaysEngaged,
            badges: badgeList
        };
        await AsyncStorage.setItem('userStreakData', JSON.stringify(streakData));
    };

    const updateTimeSpent = async () => {
        setTotalTimeSpent(prev => {
            const newTime = prev + 1;
            const badgeList = checkBadges(totalReadCount, totalDaysEngaged, newTime, streakCount);
            setBadges(badgeList);

            const streakData = {
                count: streakCount,
                total: totalReadCount,
                lastDate: lastReadingDate,
                timeSpent: newTime,
                daysEngaged: totalDaysEngaged,
                badges: badgeList
            };
            AsyncStorage.setItem('userStreakData', JSON.stringify(streakData));
            return newTime;
        });
    };

    const checkBadges = (totalRead, daysEngaged, timeSpent, streak) => {
        const newBadges = ['Welcome Enthusiast'];
        if (timeSpent >= 2) newBadges.push('Bible Starter');
        if (timeSpent >= 10) newBadges.push('Bible Interessant');
        if (timeSpent >= 60) newBadges.push('Bible Explorer');
        if (daysEngaged >= 10) newBadges.push('Bible Knowledge Gainer');
        if (daysEngaged >= 20) newBadges.push('Bible Enthusiast');
        if (daysEngaged >= 30) newBadges.push('Achievement of the Month');
        if (daysEngaged >= 365) newBadges.push('Bible User of the Year');

        return newBadges;
    };

    return (
        <BibleContext.Provider value={{
            language,
            switchLanguage,
            getBookName,
            getBookData,
            getChapterContent,
            getCommentaryForVerse,
            getCrossReferences,
            searchBible,
            dailyBreadRead,
            markDailyBreadRead,
            highlights,
            favorites,
            underlines,
            toggleHighlight,
            toggleFavorite,
            toggleUnderline,
            streakCount,
            totalReadCount,
            totalTimeSpent,
            totalDaysEngaged,
            badges,
            updateReadingActivity,
            childrenStories,
            songs,
            loading,
            theme: themeMode,
            colors: COLORS[themeMode],
            toggleTheme
        }}>
            {children}
        </BibleContext.Provider>
    );
};
