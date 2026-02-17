import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { useNavigation } from '@react-navigation/native';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function SearchScreen() {
    const { colors, searchBible, language, theme } = useContext(BibleContext);
    const navigation = useNavigation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        if (query.trim().length < 2) return;

        Keyboard.dismiss();
        setIsSearching(true);

        // Use a timeout to allow the UI to show the loader before heavy filtering happens
        setTimeout(() => {
            const searchResults = searchBible(query);
            setResults(searchResults);
            setIsSearching(false);
        }, 100);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.resultItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate('Reading', {
                bookIndex: item.bookIndex,
                chapterIndex: item.chapterIndex,
                bookName: item.bookName,
                verseIndex: item.verseNumber - 1
            })}
        >
            <View style={styles.resultHeader}>
                <Text style={[styles.resultRef, { color: colors.accent }]}>
                    {item.bookName} {item.chapterIndex + 1}:{item.verseNumber}
                </Text>
            </View>
            <Text style={[styles.resultText, { color: colors.text }]} numberOfLines={3}>
                {item.text}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <View style={[styles.searchBarContainer, { backgroundColor: colors.headerBackground, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
                </TouchableOpacity>
                <TextInput
                    style={[styles.searchInput, { backgroundColor: colors.highlight, color: colors.text }]}
                    placeholder={language === 'en' ? "Search word (e.g. Faith)..." : "పదం వెతకండి (ఉదా: విశ్వాసం)..."}
                    placeholderTextColor={colors.secondaryText}
                    value={query}
                    onChangeText={setQuery}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                    autoFocus={true}
                />
                <TouchableOpacity onPress={handleSearch} style={[styles.searchButton, { backgroundColor: colors.accent }]}>
                    <Text style={styles.searchButtonText}>🔍</Text>
                </TouchableOpacity>
            </View>

            {isSearching ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.accent} />
                    <Text style={[styles.infoText, { color: colors.secondaryText, marginTop: 10 }]}>Finding verses...</Text>
                </View>
            ) : results.length > 0 ? (
                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                />
            ) : query.length > 0 && !isSearching ? (
                <View style={styles.centerContainer}>
                    <Text style={[styles.infoText, { color: colors.secondaryText }]}>
                        {language === 'en' ? "No results found." : "ఫలితాలు ఏవీ కనుగొనబడలేదు."}
                    </Text>
                </View>
            ) : (
                <View style={styles.centerContainer}>
                    <Text style={{ fontSize: 60, opacity: 0.1 }}>📖</Text>
                    <Text style={[styles.infoText, { color: colors.secondaryText }]}>
                        {language === 'en' ? "Type a keyword to explore the Bible" : "కిటికీ పదం టైప్ చేసి బైబిల్ అన్వేషించండి"}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 10,
        marginRight: 5,
    },
    searchInput: {
        flex: 1,
        height: 46,
        borderRadius: 23,
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: '600',
    },
    searchButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        fontSize: 18,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    listContent: {
        paddingVertical: SPACING.sm,
    },
    resultItem: {
        padding: SPACING.lg,
        borderBottomWidth: 1,
    },
    resultHeader: {
        marginBottom: 8,
    },
    resultRef: {
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    resultText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
    }
});
