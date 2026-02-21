import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { CommentaryService } from '../services/CommentaryService';
import { SHADOWS, SPACING } from '../constants/theme';
import { BOOK_CODES } from '../constants/books';

export default function CommentaryBooksScreen({ route, navigation }) {
    const { commentary, bookIndex, chapterIndex, verseNumber } = route.params;
    const { colors, theme } = useContext(BibleContext);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigation.setOptions({ title: commentary.name });
        loadBooks();
    }, []);

    const loadBooks = async () => {
        const data = await CommentaryService.getCommentaryBooks(commentary.id);
        setBooks(data);
        setLoading(false);

        // Auto-navigate if coming from ReadingScreen and haven't jumped yet
        if (bookIndex !== undefined && chapterIndex !== undefined && route.params?.autoJump !== false) {
            const targetCode = BOOK_CODES[bookIndex];
            const targetBook = data.find(b => b.id === targetCode);
            if (targetBook) {
                // Clear the autoJump flag so we don't jump again on back navigation
                navigation.setParams({ autoJump: false });

                // If chapterIndex is valid, go straight to display
                if (chapterIndex + 1 >= targetBook.firstChapterNumber && chapterIndex + 1 <= targetBook.lastChapterNumber) {
                    navigation.navigate('CommentaryDisplay', {
                        commentaryId: commentary.id,
                        bookId: targetBook.id,
                        chapterNumber: chapterIndex + 1,
                        bookName: targetBook.name,
                        bookIndex: bookIndex, // Pass along for "Back to Bible"
                        verseNumber: verseNumber
                    });
                } else {
                    // Go to chapter selection
                    navigation.navigate('CommentaryChapterSelection', {
                        book: targetBook,
                        commentaryId: commentary.id
                    });
                }
            }
        }
    };



    const renderBook = ({ item, index }) => (
        <TouchableOpacity
            style={[styles.bookItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('CommentaryChapterSelection', { book: item, commentaryId: commentary.id })}
        >
            <View style={[styles.bookNum, { backgroundColor: colors.highlight }]}>
                <Text style={{ color: colors.accent, fontWeight: 'bold' }}>{index + 1}</Text>
            </View>
            <View style={styles.bookInfo}>
                <Text style={[styles.bookName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.bookSub, { color: colors.secondaryText }]}>{item.numberOfChapters} Chapters</Text>
            </View>
            <Text style={{ color: colors.border, fontSize: 20 }}>→</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            ) : (
                <FlatList
                    data={books}
                    renderItem={renderBook}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: SPACING.md,
    },
    bookItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 10,
    },
    bookNum: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    bookInfo: {
        flex: 1,
    },
    bookName: {
        fontSize: 18,
        fontWeight: '700',
    },
    bookSub: {
        fontSize: 13,
        fontWeight: '500',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
