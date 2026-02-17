import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function SongDetailScreen({ route, navigation }) {
    const { song } = route.params;
    const { language, colors, theme } = useContext(BibleContext);

    const title = language === 'te' ? song.title_te : song.title_en;
    const lyrics = (language === 'en' && song.lyrics_en && !song.lyrics_en.includes('translated soon'))
        ? song.lyrics_en
        : song.lyrics_te;
    const hymnNumber = song.hymn_number;

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerStyle: {
                backgroundColor: colors.headerBackground,
            },
            headerTintColor: colors.text,
        });
    }, [navigation, colors]);

    const cardShadow = theme === 'light' ? SHADOWS.light : SHADOWS.dark;

    return (
        <SafeAreaView style={[styles.songContainer, { backgroundColor: colors.background }]} edges={['right', 'left', 'bottom']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />
            <ScrollView contentContainerStyle={styles.songScroll} showsVerticalScrollIndicator={false}>
                <View style={[styles.paperPage, cardShadow]}>
                    <View style={styles.paperInner}>
                        <View style={styles.headerBox}>
                            {hymnNumber && (
                                <View style={styles.hymnBadge}>
                                    <Text style={styles.hymnBadgeText}>{hymnNumber}</Text>
                                </View>
                            )}
                            <Text style={styles.songSub}>HYMN / SONG</Text>
                            <Text style={styles.songTitle}>{title}</Text>
                        </View>

                        <View style={styles.lyricsContainer}>
                            <Text style={[
                                styles.lyricsText,
                                language === 'te' && styles.lyricsTelugu
                            ]}>
                                {lyrics}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    songContainer: {
        flex: 1,
    },
    songScroll: {
        padding: 16,
        paddingBottom: 40,
    },
    paperPage: {
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        minHeight: '100%',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    paperInner: {
        padding: 24,
    },
    headerBox: {
        marginBottom: 32,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 24,
    },
    songSub: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 8,
        color: '#888888',
    },
    songTitle: {
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 38,
        letterSpacing: -0.5,
        color: '#1A1A1A',
        marginTop: 8,
    },
    hymnBadge: {
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    hymnBadgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '900',
    },
    lyricsContainer: {
        alignItems: 'center',
    },
    lyricsText: {
        fontSize: 19,
        lineHeight: 34,
        textAlign: 'center',
        fontWeight: '500',
        color: '#222222',
    },
    lyricsTelugu: {
        fontSize: 21,
        lineHeight: 40,
    }
});
