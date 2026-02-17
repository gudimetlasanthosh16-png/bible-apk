import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Animated, Linking } from 'react-native';
import { BibleContext } from '../context/BibleContext';
import { checkForUpdates } from '../services/UpdateService';

const { width, height } = Dimensions.get('window');

export default function UpdateModal() {
    const { colors, language } = useContext(BibleContext);
    const [visible, setVisible] = useState(false);
    const [updateData, setUpdateData] = useState(null);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(height))[0];

    useEffect(() => {
        const check = async () => {
            const data = await checkForUpdates();
            if (data) {
                setUpdateData(data);
                // Brief delay to ensure app is ready
                setTimeout(() => {
                    setVisible(true);
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                        Animated.spring(slideAnim, {
                            toValue: 0,
                            friction: 8,
                            tension: 40,
                            useNativeDriver: true,
                        })
                    ]).start();
                }, 2000);
            }
        };
        check();
    }, []);

    if (!updateData) return null;

    const handleUpdate = () => {
        Linking.openURL(updateData.updateUrl);
        // Optional: Keep modal open or close it? 
        // Usually, browser opens, so we can hide.
        setVisible(false);
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="none"
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.backdrop,
                        { opacity: fadeAnim }
                    ]}
                />

                <Animated.View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.card,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={[styles.goldBanner, { backgroundColor: colors.accent }]}>
                        <Text style={styles.bannerText}>
                            {language === 'en' ? "SACRED UPDATE" : "నూతన నవీకరణ"}
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.sparkle}>✨</Text>
                            <Text style={styles.mainIcon}>📖</Text>
                            <Text style={styles.sparkle}>✨</Text>
                        </View>

                        <Text style={[styles.title, { color: colors.text }]}>
                            {language === 'en' ? "New Features Available!" : "కొత్త ఫీచర్లు అందుబాటులో ఉన్నాయి!"}
                        </Text>

                        <Text style={[styles.version, { color: colors.accent }]}>
                            v{updateData.latestVersion}
                        </Text>

                        <Text style={[styles.message, { color: colors.secondaryText }]}>
                            {updateData.message || (language === 'en'
                                ? "We've improved your spiritual journey with new tools and smoother experience."
                                : "మేము మీ ఆధ్యాత్మిక ప్రయాణాన్ని కొత్త పరికరాలతో మరియు సులభతరమైన అనుభవంతో మెరుగుపరిచాము.")}
                        </Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.laterButton}
                                onPress={() => setVisible(false)}
                            >
                                <Text style={[styles.laterText, { color: colors.secondaryText }]}>
                                    {language === 'en' ? "LATER" : "తరువాత"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.updateButton, { backgroundColor: colors.accent }]}
                                onPress={handleUpdate}
                            >
                                <Text style={styles.updateButtonText}>
                                    {language === 'en' ? "UPDATE NOW" : "ఇప్పుడే అప్‌డేట్ చేయండి"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
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
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    card: {
        width: width * 0.88,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
    },
    goldBanner: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    bannerText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 5,
    },
    content: {
        padding: 25,
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    mainIcon: {
        fontSize: 50,
        marginHorizontal: 10,
    },
    sparkle: {
        fontSize: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 8,
    },
    version: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        letterSpacing: 2,
    },
    message: {
        fontSize: 15,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    laterButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
    },
    laterText: {
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
    },
    updateButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 15,
        elevation: 5,
    },
    updateButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
    }
});
