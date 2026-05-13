import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { ENGLISH_BOOKS, TELUGU_BOOKS } from '../constants/books';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function ChapterSelectionScreen({ route, navigation }) {
    const { bookIndex } = route.params;
    const { getBookData, language, colors, theme, bibleData } = useContext(BibleContext);

    const bookData = getBookData(bookIndex, language);

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
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.highlight }]}>
                    <Text style={{ fontSize: 20, color: colors.accent, fontWeight: '900' }}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={[styles.selTitle, { color: colors.text }]}>
                        {language === 'te' ? TELUGU_BOOKS[bookIndex] : ENGLISH_BOOKS[bookIndex]}
                    </Text>
                    <Text style={[styles.selSubtitle, { color: colors.secondaryText }]}>
                        {language === 'te' ? ENGLISH_BOOKS[bookIndex] : TELUGU_BOOKS[bookIndex]}
                    </Text>
                </View>
                <View style={[styles.selBadge, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.selBadgeText, { color: '#FFF' }]}>
                        {chapterCount}
                    </Text>
                    <Text style={[styles.selBadgeSub, { color: 'rgba(255,255,255,0.7)' }]}>CH</Text>
                </View>
            </View>

            {chapterCount === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                    <Text style={[styles.loadingText, { color: colors.secondaryText }]}>Loading Chapters...</Text>
                </View>
            ) : (
                <FlatList
                    data={chapters}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.toString()}
                    numColumns={4}
                    contentContainerStyle={styles.selGrid}
                    columnWrapperStyle={styles.selRow}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    selContainer: {
        flex: 1,
    },
    selHeader: {
        flexDirection: 'row',
        paddingVertical: 24,
        paddingHorizontal: SPACING.md,
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    selTitle: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 2,
        letterSpacing: -0.5,
    },
    selSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.8,
    },
    selBadge: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: BORDER_RADIUS.md,
    },
    selBadgeText: {
        fontSize: 20,
        fontWeight: '900',
    },
    selBadgeSub: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    selGrid: {
        padding: SPACING.md,
        paddingBottom: 40,
    },
    selRow: {
        justifyContent: 'flex-start',
        marginBottom: SPACING.md,
        gap: '4%',
    },
    chapterSquare: {
        width: '22%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1.5,
    },
    chapterNumber: {
        fontSize: 24,
        fontWeight: '900',
    },
});
