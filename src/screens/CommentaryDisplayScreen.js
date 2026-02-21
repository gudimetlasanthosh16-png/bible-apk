import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { CommentaryService } from '../services/CommentaryService';
import { SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function CommentaryDisplayScreen({ route, navigation }) {
    const { commentaryId, bookId, chapterNumber, bookName, verseNumber } = route.params;
    const { colors, theme } = useContext(BibleContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            title: `${bookName} ${chapterNumber}`,
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={[styles.headerBtn, { backgroundColor: colors.highlight }]}
                >
                    <Text style={{ fontSize: 18 }}>🏠</Text>
                </TouchableOpacity>
            )
        });
        loadCommentary();
    }, [commentaryId, bookId, chapterNumber]);

    const loadCommentary = async () => {
        setLoading(true);
        const result = await CommentaryService.getChapterCommentary(commentaryId, bookId, chapterNumber);
        setData(result);
        setLoading(false);

        // Wait for list to render then scroll
        if (verseNumber) {
            setTimeout(() => {
                if (flatListRef.current && result?.chapter?.content) {
                    const index = result.chapter.content.findIndex(item => item.number === verseNumber);
                    if (index >= 0) {
                        flatListRef.current.scrollToIndex({
                            index,
                            animated: true,
                            viewPosition: 0.1
                        });
                    }
                }
            }, 500);
        }
    };

    const renderItem = ({ item }) => {
        if (item.type !== 'verse') return null;

        const isTarget = item.number === verseNumber;

        return (
            <View style={[
                styles.verseBox,
                isTarget && { backgroundColor: colors.highlight, borderColor: colors.accent, borderLeftWidth: 4 }
            ]}>
                <Text style={[styles.verseNum, { color: colors.accent }]}>Verse {item.number}</Text>
                {item.content.map((text, tIdx) => (
                    <Text key={tIdx} style={[styles.verseText, { color: colors.text }]}>{text}</Text>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={data?.chapter?.content || []}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.list}
                    onScrollToIndexFailed={(info) => {
                        setTimeout(() => {
                            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                        }, 500);
                    }}
                    ListHeaderComponent={() => (
                        <>
                            {data?.book?.introduction && (
                                <View style={[styles.introBox, { backgroundColor: colors.highlight }]}>
                                    <Text style={[styles.label, { color: colors.accent }]}>INTRODUCTION</Text>
                                    <Text style={[styles.introText, { color: colors.text }]}>{data.book.introduction}</Text>
                                </View>
                            )}
                            <View style={styles.headerGap} />
                        </>
                    )}
                    ListFooterComponent={() => (
                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: colors.secondaryText }]}>
                                Commentary by {data?.commentary?.name}
                            </Text>
                            <TouchableOpacity
                                style={[styles.backBtn, { backgroundColor: colors.accent }]}
                                onPress={() => navigation.navigate('Reading', {
                                    bookIndex: route.params.bookIndex,
                                    chapterIndex: chapterNumber - 1,
                                    bookName: bookName
                                })}
                            >
                                <Text style={styles.backBtnText}>Back to Bible</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    introBox: {
        padding: 20,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 10,
    },
    introText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
    },
    headerGap: {
        height: 10,
    },
    verseBox: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    verseNum: {
        fontSize: 13,
        fontWeight: '900',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    verseText: {
        fontSize: 17,
        lineHeight: 28,
        fontWeight: '500',
    },
    footer: {
        marginTop: 40,
        paddingBottom: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: 20,
    },
    backBtn: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        ...SHADOWS.light,
    },
    backBtnText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 16,
    }
});

