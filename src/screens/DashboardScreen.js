import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
    const { colors, language, theme, streakCount, totalReadCount, favorites, totalTimeSpent, badges } = useContext(BibleContext);

    const stats = [
        { label: language === 'en' ? 'Current Streak' : 'ప్రస్తుత స్ట్రీక్', value: `${streakCount} 🔥`, color: '#FF5722' },
        { label: language === 'en' ? 'Verses Read' : 'వచనాలు చదివారు', value: totalReadCount, color: '#4CAF50' },
        { label: language === 'en' ? 'Time Spent' : 'గడిపిన సమయం', value: `${totalTimeSpent}m`, color: '#2196F3' },
        { label: language === 'en' ? 'Badges' : 'బ్యాడ్జ్‌లు', value: badges.length, color: '#9C27B0' },
    ];

    const getLevel = () => {
        if (totalReadCount < 100) return language === 'en' ? 'Disciple' : 'శిష్యుడు';
        if (totalReadCount < 500) return language === 'en' ? 'Scholar' : 'పండితుడు';
        if (totalReadCount < 2000) return language === 'en' ? 'Elder' : 'పెద్ద';
        return language === 'en' ? 'Theologian' : 'దైవ శాస్త్రవేత్త';
    };

    const badgeIcons = {
        'Welcome Enthusiast': '👋',
        'Bible Starter': '🌱',
        'Bible Interessant': '🧐',
        'Bible Explorer': '🧭',
        'Bible Knowledge Gainer': '🧠',
        'Bible Enthusiast': '🔥',
        'Achievement of the Month': '🏅',
        'Bible User of the Year': '💎'
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{ fontSize: 24, color: colors.text }}>←</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {language === 'en' ? 'Spiritual Journey' : 'ఆధ్యాత్మిక ప్రయాణం'}
                </Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Level Progress Section */}
                <View style={[styles.levelCard, { backgroundColor: colors.card, borderColor: colors.border }, theme === 'light' ? SHADOWS.light : SHADOWS.dark]}>
                    <View style={[styles.levelIconBox, { backgroundColor: colors.highlight }]}>
                        <Text style={{ fontSize: 40 }}>🏆</Text>
                    </View>
                    <Text style={[styles.levelTitle, { color: colors.accent }]}>{getLevel()}</Text>
                    <Text style={[styles.levelSub, { color: colors.secondaryText }]}>
                        {language === 'en' ? 'Level ' : 'స్థాయి '}{Math.floor(totalReadCount / 100) + 1}
                    </Text>

                    <View style={[styles.progressBarBg, { backgroundColor: colors.highlight }]}>
                        <View style={[styles.progressBarFill, {
                            backgroundColor: colors.accent,
                            width: `${Math.min((totalReadCount % 100) / 100 * 100, 100)}%`
                        }]} />
                    </View>
                    <Text style={[styles.progressText, { color: colors.secondaryText }]}>
                        {totalReadCount % 100} / 100 {language === 'en' ? 'to next level' : 'తదుపరి స్థాయికి'}
                    </Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <View key={index} style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }, theme === 'light' ? SHADOWS.light : SHADOWS.dark]}>
                            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Badges Section */}
                <View style={[styles.calendarCard, { backgroundColor: colors.card, borderColor: colors.border }, theme === 'light' ? SHADOWS.light : SHADOWS.dark]}>
                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>
                        {language === 'en' ? 'UNLOCKED BADGES' : 'అన్లాక్ చేసిన బ్యాడ్జ్‌లు'}
                    </Text>
                    {badges.length > 0 ? (
                        <View style={styles.badgeGrid}>
                            {badges.map((badge, i) => (
                                <View key={i} style={styles.badgeItem}>
                                    <View style={[styles.badgeIconBox, { backgroundColor: colors.highlight }]}>
                                        <Text style={{ fontSize: 24 }}>{badgeIcons[badge] || '🏅'}</Text>
                                    </View>
                                    <Text style={[styles.badgeName, { color: colors.text }]}>{badge}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={[styles.emptyBadges, { color: colors.secondaryText }]}>
                            {language === 'en' ? 'Keep reading to unlock badges!' : 'బ్యాడ్జ్‌లను అన్‌లాక్ చేయడానికి చదువుతూ ఉండండి!'}
                        </Text>
                    )}
                </View>

                {/* Daily Engagement Calendar (Simplified) */}
                <View style={[styles.calendarCard, { backgroundColor: colors.card, borderColor: colors.border }, theme === 'light' ? SHADOWS.light : SHADOWS.dark]}>
                    <Text style={[styles.sectionTitle, { color: colors.accent }]}>
                        {language === 'en' ? 'DAILY STREAK' : 'రోజువారీ స్ట్రీక్'}
                    </Text>
                    <View style={styles.streakIcons}>
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                            const isActive = i < (streakCount % 7 === 0 && streakCount > 0 ? 7 : streakCount % 7);
                            return (
                                <View key={i} style={styles.dayCol}>
                                    <View style={[styles.dayCircle, { backgroundColor: isActive ? '#FF5722' : colors.highlight }]}>
                                        <Text style={{ color: isActive ? '#FFF' : colors.secondaryText, fontSize: 12 }}>{day}</Text>
                                    </View>
                                    {isActive && <Text style={{ fontSize: 10, marginTop: 4 }}>🔥</Text>}
                                </View>
                            );
                        })}
                    </View>
                    <Text style={[styles.devotionalTip, { color: colors.secondaryText }]}>
                        {language === 'en' ? 'Maintain your streak by reading every day!' : 'ప్రతిరోజూ చదవడం ద్వారా మీ స్ట్రీక్‌ను కొనసాగించండి!'}
                    </Text>
                </View>

                {/* Quote of encouragement */}
                <View style={styles.quoteSection}>
                    <Text style={[styles.quoteText, { color: colors.text }]}>
                        {language === 'en'
                            ? '"Let the word of Christ dwell in you richly..."'
                            : '"క్రీస్తు వాక్యము మీలో సమృద్ధిగా నివసింపనియ్యుడి..."'}
                    </Text>
                    <Text style={[styles.quoteRef, { color: colors.accent }]}>Colossians 3:16</Text>
                </View>
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
    },
    levelCard: {
        padding: 30,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: 24,
    },
    levelIconBox: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    levelTitle: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 1,
    },
    levelSub: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 20,
    },
    progressBarBg: {
        height: 10,
        width: '100%',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statBox: {
        width: (width - 60) / 2,
        padding: 20,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        marginBottom: 15,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    calendarCard: {
        padding: 24,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 20,
    },
    streakIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dayCol: {
        alignItems: 'center',
    },
    dayCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
    },
    devotionalTip: {
        fontSize: 13,
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: '500',
    },
    quoteSection: {
        padding: 40,
        alignItems: 'center',
    },
    quoteText: {
        fontSize: 18,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 28,
        marginBottom: 10,
        fontWeight: '600',
    },
    quoteRef: {
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    },
    badgeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginTop: 10,
    },
    badgeItem: {
        width: (width - 100) / 3,
        alignItems: 'center',
        marginBottom: 10,
    },
    badgeIconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    badgeName: {
        fontSize: 10,
        fontWeight: '800',
        textAlign: 'center',
    },
    emptyBadges: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 10,
    }
});
