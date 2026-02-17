import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { BibleContext } from '../context/BibleContext';
import { BLESSING_VERSES } from '../constants/blessings';

const { width, height } = Dimensions.get('window');

export default function DailyWordModal() {
    const { colors, language } = useContext(BibleContext);
    const [visible, setVisible] = useState(false);
    const [verse, setVerse] = useState(null);

    useEffect(() => {
        // Pick a random verse
        const randomIndex = Math.floor(Math.random() * BLESSING_VERSES.length);
        setVerse(BLESSING_VERSES[randomIndex]);

        // Brief delay before showing to ensure it's not abrupt
        const timer = setTimeout(() => {
            setVisible(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (!verse) return null;

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                />

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={[styles.goldBanner, { backgroundColor: colors.accent }]}>
                        <Text style={styles.bannerText}>
                            {language === 'en' ? "TODAY'S WORD" : "నేటి వాగ్దానం"}
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.quoteMark}>“</Text>

                        <Text
                            selectable={true}
                            style={[styles.verseText, { color: colors.text }]}
                        >
                            {language === 'en' ? verse.verse_en : verse.verse_te}
                        </Text>

                        <View style={styles.refContainer}>
                            <View style={[styles.refLine, { backgroundColor: colors.accent }]} />
                            <Text style={[styles.refText, { color: colors.accent }]}>
                                {language === 'en' ? verse.ref_en : verse.ref_te}
                            </Text>
                            <View style={[styles.refLine, { backgroundColor: colors.accent }]} />
                        </View>

                        <Text style={[styles.closeHint, { color: colors.secondaryText }]}>
                            {language === 'en' ? "Tap anywhere to continue" : "కొనసాగించడానికి ఎక్కడైనా క్లిక్ చేయండి"}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: colors.accent }]}
                        onPress={() => setVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>AMEN</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
    },
    card: {
        width: width * 0.85,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    goldBanner: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    bannerText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 4,
    },
    content: {
        padding: 30,
        alignItems: 'center',
    },
    quoteMark: {
        fontSize: 80,
        color: 'rgba(212, 175, 55, 0.2)',
        position: 'absolute',
        top: -10,
        fontFamily: 'serif',
    },
    verseText: {
        fontSize: 22,
        lineHeight: 34,
        textAlign: 'center',
        fontWeight: '700',
        fontStyle: 'italic',
        marginBottom: 20,
    },
    refContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    refLine: {
        height: 1,
        width: 30,
        opacity: 0.5,
    },
    refText: {
        fontSize: 14,
        fontWeight: '900',
        marginHorizontal: 15,
        letterSpacing: 1,
    },
    closeHint: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.6,
        marginTop: 10,
    },
    closeButton: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 8,
    }
});
