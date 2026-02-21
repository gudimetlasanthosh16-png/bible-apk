import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { CommentaryService } from '../services/CommentaryService';
import { SHADOWS, SPACING } from '../constants/theme';

export default function CommentaryListScreen({ navigation, route }) {
    const { colors, theme, language } = useContext(BibleContext);
    const [commentaries, setCommentaries] = useState([]);
    const [filteredCommentaries, setFilteredCommentaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadCommentaries();
    }, []);

    const loadCommentaries = async () => {
        const data = await CommentaryService.getAvailableCommentaries();
        setCommentaries(data);
        setFilteredCommentaries(data);
        setLoading(false);
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text.trim() === '') {
            setFilteredCommentaries(commentaries);
        } else {
            const filtered = commentaries.filter(c =>
                c.name.toLowerCase().includes(text.toLowerCase()) ||
                (c.englishName && c.englishName.toLowerCase().includes(text.toLowerCase()))
            );
            setFilteredCommentaries(filtered);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, theme === 'light' ? SHADOWS.light : SHADOWS.dark]}
            onPress={() => navigation.navigate('CommentaryBooks', {
                commentary: item,
                ...route.params
            })}
        >

            <View style={[styles.accent, { backgroundColor: colors.accent }]} />
            <View style={styles.cardContent}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.lang, { color: colors.secondaryText }]}>
                    {item.languageName} • {item.numberOfBooks} Books
                </Text>
                {item.website && (
                    <Text style={[styles.website, { color: colors.accent }]}>Visit Website</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Bible Commentaries</Text>
                <View style={[styles.searchContainer, { backgroundColor: colors.highlight }]}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>🔍</Text>
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search commentary..."
                        placeholderTextColor={colors.secondaryText}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            ) : (
                <FlatList
                    data={filteredCommentaries}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={[styles.empty, { color: colors.secondaryText }]}>No commentaries found</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 25,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    list: {
        padding: SPACING.lg,
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 15,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    accent: {
        width: 5,
    },
    cardContent: {
        flex: 1,
        padding: 15,
    },
    name: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 5,
    },
    lang: {
        fontSize: 14,
        fontWeight: '600',
    },
    website: {
        fontSize: 12,
        fontWeight: '700',
        marginTop: 10,
        textTransform: 'uppercase',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        fontWeight: '600',
    }
});
