import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Dimensions, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');

const BACKGROUNDS = [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01674aa3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80',
];

const COLORS = ['#FFFFFF', '#FFD700', '#F8FAFC', '#E2E8F0', '#94A3B8', '#1E293B'];

export default function WallpaperCreatorScreen({ navigation }) {
    const { colors, theme } = useContext(BibleContext);
    const [verse, setVerse] = useState('');
    const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0]);
    const [textColor, setTextColor] = useState('#FFFFFF');

    const handleSave = () => {
        if (!verse.trim()) {
            Alert.alert('Incomplete Art', 'Please enter a sacred verse to complete your work.');
            return;
        }
        Alert.alert('Creation Successful', 'Your custom sacred art has been prepared.');
        navigation.goBack();
    };

    const cardShadow = theme === 'light' ? SHADOWS.light : SHADOWS.dark;

    return (
        <SafeAreaView style={[styles.createContainer, { backgroundColor: colors.background }]} edges={['bottom']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.createScroll}>

                <View style={styles.previewSection}>
                    <Text style={[styles.sectionSub, { color: colors.accent }]}>STUDIO PREVIEW</Text>
                    <View style={[styles.mainPreview, cardShadow]}>
                        <Image source={{ uri: selectedBg }} style={styles.fullPreviewBg} />
                        <View style={styles.previewTint} />
                        <View style={styles.previewTextOverlay}>
                            <Text style={[styles.previewMainText, { color: textColor }]}>
                                {verse || 'Your Blessed Word'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.creatorControls}>
                    <View style={styles.controlGroup}>
                        <Text style={[styles.controlLabel, { color: colors.accent }]}>SACRED VERSE</Text>
                        <TextInput
                            style={[styles.studioInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                            placeholder="Enter the word of God..."
                            placeholderTextColor={colors.secondaryText}
                            value={verse}
                            onChangeText={setVerse}
                            multiline
                        />
                    </View>

                    <View style={styles.controlGroup}>
                        <Text style={[styles.controlLabel, { color: colors.accent }]}>SELECT CANVAS</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.studioBgList}>
                            {BACKGROUNDS.map((url, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setSelectedBg(url)}
                                    style={[styles.studioBgItem, selectedBg === url && { borderColor: colors.accent, borderWidth: 2 }]}
                                >
                                    <Image source={{ uri: url }} style={styles.studioBgThumb} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.controlGroup}>
                        <Text style={[styles.controlLabel, { color: colors.accent }]}>TEXT SYMBOLISM</Text>
                        <View style={styles.studioColorGrid}>
                            {COLORS.map((color, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setTextColor(color)}
                                    style={[styles.studioColorCircle, { backgroundColor: color }, textColor === color && { borderColor: colors.accent, borderWidth: 2 }]}
                                />
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.createFinalBtn, { backgroundColor: colors.accent }]}
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.createFinalBtnText}>EXPORT CREATION</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    createContainer: {
        flex: 1,
    },
    createScroll: {
        paddingVertical: 24,
    },
    previewSection: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    sectionSub: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 16,
    },
    mainPreview: {
        width: width - 48,
        height: (width - 48) * 1.5,
        borderRadius: 32,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    fullPreviewBg: {
        width: '100%',
        height: '100%',
    },
    previewTint: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    previewTextOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    previewMainText: {
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 38,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 15,
    },
    creatorControls: {
        paddingHorizontal: 28,
    },
    controlGroup: {
        marginBottom: 32,
    },
    controlLabel: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    studioInput: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 20,
        fontSize: 16,
        height: 100,
        textAlignVertical: 'top',
        fontWeight: '500',
    },
    studioBgList: {
        flexDirection: 'row',
    },
    studioBgItem: {
        width: 80,
        height: 120,
        marginRight: 16,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    studioBgThumb: {
        width: '100%',
        height: '100%',
    },
    studioColorGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    studioColorCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    createFinalBtn: {
        height: 60,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    createFinalBtnText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 15,
        letterSpacing: 1.5,
    },
});
