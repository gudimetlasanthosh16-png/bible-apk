import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { DAILY_BREAD } from '../constants/daily_bread';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { getAIResponse } from '../services/AIService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DailyBreadScreen({ route, navigation }) {
    const { colors, language, theme, markDailyBreadRead, bibleData } = useContext(BibleContext);
    const [bread, setBread] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDailyBread = async () => {
            setLoading(true);
            try {
                // 1. Determine day of year
                const now = new Date();
                const start = new Date(now.getFullYear(), 0, 0);
                const diff = now - start;
                const oneDay = 1000 * 60 * 60 * 24;
                const dayOfYear = Math.floor(diff / oneDay);
                const cacheKey = `daily_bread_${now.getFullYear()}_${dayOfYear}`;

                // 2. Check local cache first
                const cached = await AsyncStorage.getItem(cacheKey);
                if (cached) {
                    setBread(JSON.parse(cached));
                    setLoading(false);
                    return;
                }

                // 3. Check if we have it in static constants (for the first few days/fallback)
                const staticBread = DAILY_BREAD.find(b => parseInt(b.id) === dayOfYear);
                if (staticBread) {
                    setBread(staticBread);
                    await AsyncStorage.setItem(cacheKey, JSON.stringify(staticBread));
                    setLoading(false);
                    return;
                }

                // 4. Generate Dynamically using AI
                if (bibleData && bibleData.en) {
                    // Pick a prominent verse using the day number as a seed
                    // We'll pick from a list of 'fav' books to ensure quality
                    const books = [0, 18, 22, 39, 42, 44, 49, 57]; // Genesis, Psalms, Isaiah, Matthew, John, Romans, Ephesians, Hebrews
                    const bookIdx = books[dayOfYear % books.length];
                    const book = bibleData.en.Book[bookIdx];
                    const chapterIdx = dayOfYear % book.Chapter.length;
                    const verseIdx = dayOfYear % book.Chapter[chapterIdx].Verse.length;
                    const verseObj = book.Chapter[chapterIdx].Verse[verseIdx];

                    const verseText = verseObj.Verse;
                    const ref = `${book.BookName} ${chapterIdx + 1}:${verseObj.Verseid}`;

                    // Fetch Telugu version
                    let verseTe = verseText;
                    let refTe = ref;
                    if (bibleData.te && bibleData.te.Book[bookIdx]) {
                        const teBook = bibleData.te.Book[bookIdx];
                        const teVerse = teBook.Chapter[chapterIdx].Verse[verseIdx];
                        verseTe = teVerse.Verse;
                        refTe = `${teBook.BookName} ${chapterIdx + 1}:${teVerse.Verseid}`;
                    }

                    // Request AI to generate Summary and Prayer
                    const aiPrompt = `Generate a Daily Bread devotional for this verse: "${verseText}" (${ref}). 
                    Provide:
                    1. A 2-sentence spiritual summary in English.
                    2. A 2-sentence spiritual summary in Telugu.
                    3. A short heart-felt prayer in English.
                    4. A short heart-felt prayer in Telugu.
                    
                    Format your response EXACTLY as JSON like this:
                    {"summary_en": "...", "summary_te": "...", "prayer_en": "...", "prayer_te": "..."}`;

                    const aiResponse = await getAIResponse(aiPrompt, [], 'en', null);
                    let generated = null;
                    try {
                        // Extract JSON from AI response
                        const jsonMatch = aiResponse.text.match(/\{.*\}/s);
                        if (jsonMatch) {
                            generated = JSON.parse(jsonMatch[0]);
                        }
                    } catch (e) {
                        console.error("AI Daily Bread Parse Error:", e);
                    }

                    const finalBread = {
                        id: dayOfYear.toString(),
                        verse: verseText,
                        ref: ref,
                        verse_te: verseTe,
                        ref_te: refTe,
                        summary_en: generated?.summary_en || "Let this verse guide your heart today.",
                        summary_te: generated?.summary_te || "ఈ వచనం ఈ రోజు మీ హృదయాన్ని నడిపించనివ్వండి.",
                        prayer_en: generated?.prayer_en || "Lord, thank You for Your word. Guide me today. Amen.",
                        prayer_te: generated?.prayer_te || "ప్రభువా, నీ వాక్యానికి వందనాలు. ఈ రోజు నన్ను నడిపించు. ఆమేన్.",
                        related_verses: []
                    };

                    setBread(finalBread);
                    await AsyncStorage.setItem(cacheKey, JSON.stringify(finalBread));
                } else {
                    // Fallback if no bible data
                    setBread(DAILY_BREAD[0]);
                }
            } catch (error) {
                console.error("Daily Bread Loading Error:", error);
                setBread(DAILY_BREAD[0]);
            } finally {
                setLoading(false);
            }
        };

        loadDailyBread();
    }, [bibleData]);

    const handleAmen = async () => {
        if (markDailyBreadRead) {
            await markDailyBreadRead();
        }
        navigation.goBack();
    };

    if (loading || !bread) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={{ marginTop: 20, color: colors.accent, fontWeight: '700' }}>
                    Preparing your daily bread...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {language === 'en' ? 'Daily Bread' : 'నేటి ఆహారం'}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Verse Card */}
                <View style={[styles.verseCard, { backgroundColor: colors.card, borderColor: colors.border }, theme === 'light' ? SHADOWS.light : SHADOWS.dark]}>
                    <View style={[styles.accentBar, { backgroundColor: colors.accent }]} />
                    <Text
                        selectable={true}
                        style={[styles.verseText, { color: colors.text }]}
                    >
                        "{language === 'en' ? bread.verse : bread.verse_te}"
                    </Text>
                    <Text style={[styles.refText, { color: colors.accent }]}>
                        — {language === 'en' ? bread.ref : bread.ref_te}
                    </Text>
                </View>

                {/* Summary Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>
                        {language === 'en' ? 'UNDERSTANDING' : 'అవగాహన'}
                    </Text>
                    <Text
                        selectable={true}
                        style={[styles.bodyText, { color: colors.text }]}
                    >
                        {language === 'en' ? bread.summary_en : bread.summary_te}
                    </Text>
                </View>

                {/* Prayer Section */}
                <View style={[styles.prayerSection, { backgroundColor: colors.highlight }]}>
                    <Text style={[styles.sectionTitle, { color: colors.accent, textAlign: 'center' }]}>
                        {language === 'en' ? 'A SHORT PRAYER' : 'చిన్న ప్రార్థన'}
                    </Text>
                    <Text
                        selectable={true}
                        style={[styles.prayerText, { color: colors.text }]}
                    >
                        {language === 'en' ? bread.prayer_en : bread.prayer_te}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.amenButton, { backgroundColor: colors.accent }]}
                    onPress={handleAmen}
                >
                    <Text style={styles.amenButtonText}>AMEN</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        height: 60,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1,
    },
    backButton: {
        padding: 10,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: 40,
    },
    verseCard: {
        padding: 30,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        marginBottom: 30,
        alignItems: 'center',
    },
    accentBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
        marginBottom: 20,
    },
    verseText: {
        fontSize: 22,
        lineHeight: 34,
        textAlign: 'center',
        fontWeight: '700',
        fontStyle: 'italic',
        marginBottom: 15,
    },
    refText: {
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    bodyText: {
        fontSize: 16,
        lineHeight: 26,
        fontWeight: '500',
    },
    refsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    refPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginRight: 8,
        marginBottom: 8,
    },
    refPillText: {
        fontSize: 13,
        fontWeight: '700',
    },
    prayerSection: {
        padding: 25,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: 30,
    },
    prayerText: {
        fontSize: 17,
        lineHeight: 28,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 10,
        fontWeight: '600',
    },
    amenButton: {
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    amenButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 6,
    }
});

