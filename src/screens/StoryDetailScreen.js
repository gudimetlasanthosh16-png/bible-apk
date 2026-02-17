import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function StoryDetailScreen({ route, navigation }) {
    const { story } = route.params;
    const { language, colors, theme } = useContext(BibleContext);

    const title = language === 'te' ? story.title_te : story.title_en;
    const content = language === 'te' ? story.content_te : story.content_en;

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
        <SafeAreaView style={[styles.storyContainer, { backgroundColor: colors.background }]} edges={['right', 'left', 'bottom']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />
            <ScrollView contentContainerStyle={styles.storyScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.storyHeaderBox}>
                    <View style={[styles.ornamentLine, { backgroundColor: colors.accent }]} />
                    <Text style={[styles.storySubLabel, { color: colors.accent }]}>SACRED TALES FOR CHILDREN</Text>
                    <Text selectable={true} style={[styles.storyMainTitle, { color: colors.text }]}>{title}</Text>
                    <View style={[styles.ornamentLine, { backgroundColor: colors.accent }]} />
                </View>

                <View style={[styles.storyCard, { backgroundColor: colors.card, borderColor: colors.border }, cardShadow]}>
                    <View style={styles.quoteMark}>
                        <Text style={{ fontSize: 60, color: colors.accent, opacity: 0.2, fontWeight: '900' }}>“</Text>
                    </View>
                    <Text
                        selectable={true}
                        style={[
                            styles.storyBody,
                            { color: colors.text },
                            language === 'te' && styles.storyTelugu
                        ]}
                    >
                        {content}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: colors.highlight }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.backButtonText, { color: colors.accent }]}>BACK TO STORIES</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    storyContainer: {
        flex: 1,
    },
    storyScroll: {
        padding: SPACING.lg,
    },
    storyHeaderBox: {
        marginBottom: 32,
        alignItems: 'center',
    },
    storySubLabel: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 8,
    },
    storyMainTitle: {
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    storyCard: {
        padding: 28,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
    },
    storyBody: {
        fontSize: 19,
        lineHeight: 34,
        fontWeight: '500',
    },
    storyTelugu: {
        fontSize: 22,
        lineHeight: 44,
    },
    ornamentLine: {
        width: 40,
        height: 2,
        marginVertical: 12,
        borderRadius: 1,
    },
    quoteMark: {
        position: 'absolute',
        top: -10,
        left: 20,
    },
    backButton: {
        marginTop: 40,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
    }
});
