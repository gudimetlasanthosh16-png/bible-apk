import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { ENGLISH_BOOKS, TELUGU_BOOKS } from '../constants/books';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function ChapterSelectionScreen({ route, navigation }) {
    const { bookIndex } = route.params;
    const { getBookData, language, colors, theme } = useContext(BibleContext);

    const bookData = getBookData(bookIndex, 'en');

    const chapterCount = bookData && bookData.Chapter ? bookData.Chapter.length : 0;
    const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

    const renderItem = ({ item }) => {
        const cardShadow = theme === 'light' ? SHADOWS.light : SHADOWS.dark;
        return (
            <TouchableOpacity
                style={[styles.chapterSquare, { backgroundColor: colors.card, borderColor: colors.border }, cardShadow]}
                onPress={() => navigation.navigate('Reading', {
                    bookIndex,
                    chapterIndex: item - 1,
                    bookName: language === 'te' ? TELUGU_BOOKS[bookIndex] : ENGLISH_BOOKS[bookIndex]
                })}
                activeOpacity={0.8}
            >
                <Text style={[styles.chapterNumber, { color: colors.text }]}>{item}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.selContainer, { backgroundColor: colors.background }]} edges={['right', 'left']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />

            <View style={[styles.selHeader, { backgroundColor: colors.headerBackground, borderBottomColor: colors.border }]}>
                <Text style={[styles.selTitle, { color: colors.accent }]}>
                    {language === 'te' ? TELUGU_BOOKS[bookIndex] : ENGLISH_BOOKS[bookIndex]}
                </Text>
                <Text style={[styles.selSubtitle, { color: colors.secondaryText }]}>
                    {language === 'te' ? ENGLISH_BOOKS[bookIndex] : TELUGU_BOOKS[bookIndex]}
                </Text>
                <View style={[styles.selBadge, { backgroundColor: colors.highlight }]}>
                    <Text style={[styles.selBadgeText, { color: colors.accent }]}>
                        {chapterCount} CHAPTERS
                    </Text>
                </View>
            </View>

            <FlatList
                data={chapters}
                renderItem={renderItem}
                keyExtractor={(item) => item.toString()}
                numColumns={4}
                contentContainerStyle={styles.selGrid}
                columnWrapperStyle={styles.selRow}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    selContainer: {
        flex: 1,
    },
    selHeader: {
        paddingVertical: 32,
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    selTitle: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 4,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    selSubtitle: {
        fontSize: 16,
        fontWeight: '700',
        opacity: 0.6,
        marginBottom: 16,
    },
    selBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: BORDER_RADIUS.full,
    },
    selBadgeText: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    selGrid: {
        padding: SPACING.md,
        paddingBottom: 40,
    },
    selRow: {
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    chapterSquare: {
        width: '22%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
    },
    chapterNumber: {
        fontSize: 22,
        fontWeight: '900',
    },
});
