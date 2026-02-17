import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { DAILY_BREAD } from '../constants/daily_bread';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function DailyBreadScreen({ route, navigation }) {
    const { colors, language, theme, markDailyBreadRead } = useContext(BibleContext);

    // Get verse ID from params or pick a random one
    const [bread] = React.useState(() => {
        const id = route.params?.id;
        if (id) {
            return DAILY_BREAD.find(b => b.id === id) || DAILY_BREAD[0];
        }
        const randomIndex = Math.floor(Math.random() * DAILY_BREAD.length);
        return DAILY_BREAD[randomIndex];
    });

    const handleAmen = async () => {
        if (markDailyBreadRead) {
            await markDailyBreadRead();
        }
        navigation.goBack();
    };

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

                {/* Related Verses */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>
                        {language === 'en' ? 'RELATED VERSES' : 'సంబంధిత వచనాలు'}
                    </Text>
                    <View style={styles.refsContainer}>
                        {bread.related_verses.map((v, i) => (
                            <View key={i} style={[styles.refPill, { backgroundColor: colors.highlight }]}>
                                <Text style={[styles.refPillText, { color: colors.text }]}>{v}</Text>
                            </View>
                        ))}
                    </View>
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
