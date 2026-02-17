import React, { useState, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import commentaryData from '../../assets/data/commentary.json';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function CommentaryScreen() {
    const { colors, language, theme } = useContext(BibleContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedVerse, setSelectedVerse] = useState(null);

    const filteredCommentaries = useMemo(() => {
        let results = commentaryData;
        if (selectedBook) results = results.filter(c => c.book === selectedBook);
        if (selectedChapter) results = results.filter(c => c.chapter === parseInt(selectedChapter));
        if (selectedVerse) results = results.filter(c => c.verse === parseInt(selectedVerse));

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            results = results.filter(c =>
                c.commentary.toLowerCase().includes(lowerQuery) ||
                c.book.toLowerCase().includes(lowerQuery) ||
                `${c.book} ${c.chapter}:${c.verse}`.toLowerCase().includes(lowerQuery)
            );
            results.sort((a, b) => {
                const aText = a.commentary.toLowerCase();
                const bText = b.commentary.toLowerCase();
                if (aText.startsWith(lowerQuery) && !bText.startsWith(lowerQuery)) return -1;
                if (!aText.startsWith(lowerQuery) && bText.startsWith(lowerQuery)) return 1;
                return 0;
            });
        }
        return results;
    }, [searchQuery, selectedBook, selectedChapter, selectedVerse]);

    const availableBooks = useMemo(() => {
        const books = new Set(commentaryData.map(c => c.book));
        return Array.from(books);
    }, []);

    const availableChapters = useMemo(() => {
        if (!selectedBook) return [];
        const chapters = new Set(commentaryData.filter(c => c.book === selectedBook).map(c => c.chapter));
        return Array.from(chapters).sort((a, b) => a - b);
    }, [selectedBook]);

    const availableVerses = useMemo(() => {
        if (!selectedBook || !selectedChapter) return [];
        const verses = new Set(commentaryData.filter(c => c.book === selectedBook && c.chapter === parseInt(selectedChapter)).map(c => c.verse));
        return Array.from(verses).sort((a, b) => a - b);
    }, [selectedBook, selectedChapter]);

    const renderCommentaryItem = ({ item }) => {
        const cardShadow = theme === 'light' ? SHADOWS.light : SHADOWS.dark;
        return (
            <View style={[styles.commCard, { backgroundColor: colors.card, borderColor: colors.border }, cardShadow]}>
                <View style={styles.cardHeaderBox}>
                    <View style={[styles.refBadge, { backgroundColor: colors.highlight }]}>
                        <Text selectable={true} style={[styles.refText, { color: colors.accent }]}>
                            {item.book} {item.chapter}:{item.verse}
                        </Text>
                    </View>
                </View>
                <Text selectable={true} style={[styles.commBody, { color: colors.text }]}>
                    {item.commentary}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.commContainer, { backgroundColor: colors.background }]} edges={['bottom']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />

            <View style={[styles.commFilterSection, { backgroundColor: colors.headerBackground, borderBottomColor: colors.border }]}>
                <TextInput
                    style={[styles.commSearch, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                    placeholder={language === 'en' ? "Search scholar commentary..." : "వ్యాఖ్యానాన్ని శోధించండి..."}
                    placeholderTextColor={colors.secondaryText}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.commPillsScroll}>
                    <TouchableOpacity
                        style={[styles.commPill, { backgroundColor: selectedBook ? colors.accent : colors.highlight }]}
                        onPress={() => { setSelectedBook(null); setSelectedChapter(null); setSelectedVerse(null); }}
                    >
                        <Text style={[styles.commPillText, { color: selectedBook ? '#fff' : colors.accent }]}>
                            {selectedBook || "BOOKS"} {selectedBook && "✕"}
                        </Text>
                    </TouchableOpacity>

                    {!selectedBook ? availableBooks.map(book => (
                        <TouchableOpacity
                            key={book}
                            style={[styles.commPill, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => setSelectedBook(book)}
                        >
                            <Text style={[styles.commPillText, { color: colors.text }]}>{book}</Text>
                        </TouchableOpacity>
                    )) : (
                        <>
                            <TouchableOpacity
                                style={[styles.commPill, { backgroundColor: selectedChapter ? colors.accent : colors.highlight }]}
                                onPress={() => { setSelectedChapter(null); setSelectedVerse(null); }}
                            >
                                <Text style={[styles.commPillText, { color: selectedChapter ? '#fff' : colors.accent }]}>
                                    {selectedChapter ? `CH ${selectedChapter}` : "CHAPTER"} {selectedChapter && "✕"}
                                </Text>
                            </TouchableOpacity>
                            {!selectedChapter && availableChapters.map(ch => (
                                <TouchableOpacity
                                    key={ch}
                                    style={[styles.commPill, { backgroundColor: colors.card, borderColor: colors.border }]}
                                    onPress={() => setSelectedChapter(ch)}
                                >
                                    <Text style={[styles.commPillText, { color: colors.text }]}>{ch}</Text>
                                </TouchableOpacity>
                            ))}

                            {selectedChapter && (
                                <>
                                    <TouchableOpacity
                                        style={[styles.commPill, { backgroundColor: selectedVerse ? colors.accent : colors.highlight }]}
                                        onPress={() => setSelectedVerse(null)}
                                    >
                                        <Text style={[styles.commPillText, { color: selectedVerse ? '#fff' : colors.accent }]}>
                                            {selectedVerse ? `V ${selectedVerse}` : "VERSE"} {selectedVerse && "✕"}
                                        </Text>
                                    </TouchableOpacity>
                                    {!selectedVerse && availableVerses.map(v => (
                                        <TouchableOpacity
                                            key={v}
                                            style={[styles.commPill, { backgroundColor: colors.card, borderColor: colors.border }]}
                                            onPress={() => setSelectedVerse(v)}
                                        >
                                            <Text style={[styles.commPillText, { color: colors.text }]}>{v}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </ScrollView>
            </View>

            <FlatList
                data={filteredCommentaries}
                keyExtractor={(item, index) => `${item.book}-${item.chapter}-${item.verse}-${index}`}
                renderItem={renderCommentaryItem}
                contentContainerStyle={styles.commList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.commEmpty}>
                        <Text style={{ fontSize: 40, marginBottom: 20 }}>🔍</Text>
                        <Text style={[styles.commEmptyText, { color: colors.secondaryText }]}>
                            {language === 'en' ? "No scholarship found for this criteria." : "వ్యాఖ్యానాలు కనుగొనబడలేదు."}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    commContainer: {
        flex: 1,
    },
    commFilterSection: {
        padding: SPACING.md,
        paddingBottom: SPACING.sm,
        borderBottomWidth: 1,
    },
    commSearch: {
        height: 50,
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 16,
        fontWeight: '500',
    },
    commPillsScroll: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    commPill: {
        paddingHorizontal: 16,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    commPillText: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },
    commList: {
        padding: SPACING.md,
        paddingBottom: 40,
    },
    commCard: {
        padding: 24,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        marginBottom: 20,
    },
    cardHeaderBox: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    refBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    refText: {
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    commBody: {
        fontSize: 17,
        lineHeight: 28,
        fontWeight: '400',
    },
    commEmpty: {
        padding: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    commEmptyText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        opacity: 0.5,
    }
});
