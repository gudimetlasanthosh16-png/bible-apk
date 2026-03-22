import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, ScrollView, StatusBar, Dimensions, Alert, Share, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { ENGLISH_BOOKS } from '../constants/books';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

const oldColorMap = {
    '#FFEB3B': '#FFF59D',
    '#8BC34A': '#A5D6A7',
    '#03A9F4': '#90CAF9',
    '#E91E63': '#EF9A9A',
    '#9C27B0': '#CE93D8'
};

export default function ReadingScreen({ route }) {
    const { bookIndex, chapterIndex, bookName, verseIndex } = route.params;
    const {
        getChapterContent, getCrossReferences,
        language, colors, theme,
        highlights, favorites, underlines,
        toggleHighlight, toggleFavorite, toggleUnderline,
        getBookData, TELUGU_BOOKS, crossReferenceData
    } = useContext(BibleContext);
    const navigation = useNavigation();
    const [isDualMode, setIsDualMode] = useState(false);

    // UI Interaction states
    const [isActionPanelVisible, setIsActionPanelVisible] = useState(false);
    const [activeVerseData, setActiveVerseData] = useState(null);

    // Auto-play state
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [speakingVerseIndex, setSpeakingVerseIndex] = useState(-1);

    // Audio Settings State
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [speechRate, setSpeechRate] = useState(0.75);
    const [speechPitch, setSpeechPitch] = useState(1.0);
    const [selectedVoice, setSelectedVoice] = useState(null);

    const [crossRefs, setCrossRefs] = useState([]);
    const [verses, setVerses] = useState([]);
    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVerses, setSelectedVerses] = useState([]); // Array of verse IDs

    const flatListRef = useRef(null);

    useEffect(() => {
        const getVoices = async () => {
            const voices = await Speech.getAvailableVoicesAsync();
            setAvailableVoices(voices);
        };
        getVoices();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerLeft: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -10 }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ padding: 10, marginRight: 5 }}
                    >
                        <View style={{
                            width: 36,
                            height: 36,
                            borderRadius: 12,
                            backgroundColor: colors.highlight,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{ fontSize: 20, color: colors.accent, fontWeight: '900' }}>←</Text>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <Text style={{ fontSize: 13, fontWeight: '800', color: colors.accent, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                            {bookName}
                        </Text>
                        <Text style={{ fontSize: 24, fontWeight: '900', color: colors.text, marginTop: -2 }}>
                            Chapter {chapterIndex + 1}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {selectedVerses.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                const firstVerse = verses.find(v => v.id === selectedVerses[0]);
                                setActiveVerseData(firstVerse);
                                setIsActionPanelVisible(true);
                            }}
                            style={[styles.modePill, { backgroundColor: colors.accent, marginRight: 8 }]}
                        >
                            <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 12 }}>{selectedVerses.length} SELECTED</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={() => setIsSettingsVisible(true)}
                        style={[styles.headerIconCircle, { backgroundColor: colors.highlight }]}
                    >
                        <Text style={{ fontSize: 18, color: colors.text }}>⚙️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleAutoPlay}
                        style={[styles.headerIconCircle, { backgroundColor: isAutoPlaying ? colors.accent : colors.highlight, marginHorizontal: 8 }]}
                    >
                        <Text style={{ fontSize: 16, color: isAutoPlaying ? '#FFF' : colors.text }}>
                            {isAutoPlaying ? '⏸' : '▶'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsDualMode(!isDualMode)}
                        style={[styles.modePill, { backgroundColor: isDualMode ? colors.accent : colors.highlight }]}
                    >
                        <Text style={[styles.modePillText, { color: isDualMode ? '#FFF' : colors.accent }]}>
                            {isDualMode ? 'DUAL' : 'SINGLE'}
                        </Text>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, isDualMode, bookName, chapterIndex, colors, isAutoPlaying, selectedVerses, verses]);

    useEffect(() => {
        const primaryVerses = getChapterContent(bookIndex, chapterIndex, language);

        if (isDualMode) {
            const secondaryLang = language === 'en' ? 'te' : 'en';
            const secondaryVerses = getChapterContent(bookIndex, chapterIndex, secondaryLang);

            const combined = primaryVerses.map((v, i) => ({
                id: v.Verseid,
                primary: v.Verse,
                secondary: secondaryVerses[i] ? secondaryVerses[i].Verse : '',
                verseNumber: i + 1,
                bookName: bookName,
                chapter: chapterIndex + 1,
                index: i
            }));
            setVerses(combined);
        } else {
            setVerses(primaryVerses.map((v, i) => ({
                id: v.Verseid,
                primary: v.Verse,
                verseNumber: i + 1,
                bookName: bookName,
                chapter: chapterIndex + 1,
                index: i
            })));
        }

        // Auto scroll to verse if search redirected here
        if (verseIndex !== undefined && verseIndex >= 0) {
            setTimeout(() => {
                if (flatListRef.current) {
                    flatListRef.current.scrollToIndex({
                        index: verseIndex,
                        animated: true,
                        viewPosition: 0.2
                    });
                }
            }, 600);
        }
    }, [bookIndex, chapterIndex, language, isDualMode]);

    useEffect(() => {
        if (isAutoPlaying && speakingVerseIndex >= 0 && speakingVerseIndex < verses.length) {
            const verse = verses[speakingVerseIndex];

            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                    animated: true,
                    index: speakingVerseIndex,
                    viewPosition: 0.3
                });
            }

            speakFunc(verse.primary, verse.id, true);
        } else if (isAutoPlaying && speakingVerseIndex >= verses.length) {
            setIsAutoPlaying(false);
            setSpeakingVerseIndex(-1);
            Speech.stop();
        }
    }, [speakingVerseIndex, isAutoPlaying, verses]);

    const toggleAutoPlay = () => {
        if (isAutoPlaying) {
            setIsAutoPlaying(false);
            setSpeakingVerseIndex(-1);
            Speech.stop();
        } else {
            setSpeakingVerseIndex(0);
            setIsAutoPlaying(true);
        }
    };

    const speakFunc = (text, id, isSequence) => {
        let voiceIdentifier = selectedVoice;

        if (!voiceIdentifier) {
            if (language === 'te') {
                const teVoice = availableVoices.find(v => v.language.startsWith('te') && (v.name.toLowerCase().includes('female') || v.identifier.toLowerCase().includes('female')));
                voiceIdentifier = teVoice ? teVoice.identifier : (availableVoices.find(v => v.language.startsWith('te'))?.identifier);
            } else {
                const enVoices = availableVoices.filter(v => v.language.startsWith('en'));
                let vObj = enVoices.find(v => (
                    v.name.toLowerCase().includes('female') ||
                    v.identifier.toLowerCase().includes('female') ||
                    v.name.toLowerCase().includes('samantha') ||
                    v.name.toLowerCase().includes('victoria') ||
                    v.identifier.toLowerCase().includes('en-us-x-sfg#female')
                ));

                if (!vObj) vObj = enVoices.find(v => v.quality === 'Enhanced' || v.quality === 'High');
                if (!vObj) vObj = enVoices[0];
                voiceIdentifier = vObj?.identifier;
            }
        }

        const options = {
            rate: speechRate,
            pitch: speechPitch,
            onDone: () => {
                if (isAutoPlaying) setSpeakingVerseIndex(prev => prev + 1);
                else if (!isSequence) setSpeakingVerseIndex(-1);
            },
            voice: voiceIdentifier
        };

        Speech.speak(text, options);
    };

    const toggleVerseOptions = async (index, item) => {
        // If we are in multi-selection mode, toggle the selection instead of opening the panel
        if (selectedVerses.length > 0) {
            handleVerseToggle(item.id);
            return;
        }

        await Speech.stop();
        setIsAutoPlaying(false);
        setSpeakingVerseIndex(-1);

        setActiveVerseData({ ...item, index });
        
        // Instant raw data lookup
        const refs = getCrossReferences(item.bookName, item.chapter, item.verseNumber);
        setCrossRefs(refs);
        setIsActionPanelVisible(true);
    };

    const handleVerseToggle = (id) => {
        setSelectedVerses(prev => {
            const isAlreadySelected = prev.includes(id);
            if (isAlreadySelected) {
                return prev.filter(v => v !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const formatVersesForExport = () => {
        if (selectedVerses.length > 0) {
            // Get all selected verse objects and sort them by verse number
            const sortedSelected = verses
                .filter(v => selectedVerses.includes(v.id))
                .sort((a, b) => a.verseNumber - b.verseNumber);

            if (sortedSelected.length === 0) return '';

            const firstVerse = sortedSelected[0];
            const lastVerse = sortedSelected[sortedSelected.length - 1];
            
            const citation = sortedSelected.length > 1 
                ? `${firstVerse.bookName} ${firstVerse.chapter}:${firstVerse.verseNumber}-${lastVerse.verseNumber}`
                : `${firstVerse.bookName} ${firstVerse.chapter}:${firstVerse.verseNumber}`;

            const text = sortedSelected.map(v =>
                `${v.verseNumber}. ${v.primary}${isDualMode ? '\n' : ''}${isDualMode ? v.secondary : ''}`
            ).join('\n\n');

            const header = `📖 ${citation}\n${'━'.repeat(20)}\n\n`;
            return `${header}${text}\n\n— Shared from Holy Bible App`;
        } else if (activeVerseData) {
            const header = `📖 ${activeVerseData.bookName} ${activeVerseData.chapter}:${activeVerseData.verseNumber}\n${'━'.repeat(20)}\n\n`;
            const verseText = `${activeVerseData.primary}${isDualMode ? '\n' + activeVerseData.secondary : ''}`;
            return `${header}${verseText}\n\n— Shared from Holy Bible App`;
        }
        return '';
    };

    const copyVerse = async () => {
        const textToCopy = formatVersesForExport();
        if (!textToCopy) return;
        await Clipboard.setStringAsync(textToCopy);
        Alert.alert(
            language === 'en' ? "Copied" : "కాపీ చేయబడింది",
            language === 'en' ? `Text copied to clipboard` : `పాఠ్యం క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది`
        );
        setSelectedVerses([]);
        setIsActionPanelVisible(false);
    };

    const shareVerse = async () => {
        const textToShare = formatVersesForExport();
        if (!textToShare) return;
        try {
            await Share.share({
                message: textToShare,
            });
            setSelectedVerses([]);
            setIsActionPanelVisible(false);
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item, index }) => {
        const isSpeaking = speakingVerseIndex === index;
        const rawHighlight = highlights[item.id];
        const highlightColor = rawHighlight ? (oldColorMap[rawHighlight] || rawHighlight) : undefined;
        const isFavorited = favorites.includes(item.id);
        const isUnderlined = underlines.includes(item.id);
        const isSelected = selectedVerses.includes(item.id);

        return (
            <View
                style={[
                    styles.verseItem,
                    {
                        backgroundColor: isSelected ? '#FFF176' : (isSpeaking ? colors.highlight : (highlightColor || 'transparent')),
                        borderLeftColor: (isSelected || isFavorited) ? colors.accent : 'transparent',
                    }
                ]}
            >
                <View style={styles.verseRow}>
                    <TouchableOpacity
                        onPress={() => {
                            if (selectedVerses.length > 0) {
                                handleVerseToggle(item.id);
                            } else {
                                toggleVerseOptions(index, item);
                            }
                        }}
                        onLongPress={() => handleVerseToggle(item.id)}
                        delayLongPress={300}
                        activeOpacity={0.7}
                        style={{ paddingRight: 4, paddingBottom: 10 }}
                    >
                        <View style={[styles.vNumberBox, { 
                            backgroundColor: isSelected ? colors.accent : (isSpeaking || isFavorited ? colors.accent : colors.highlight),
                            transform: [{ scale: isSelected ? 1.05 : 1 }]
                        }]}>
                            <Text style={[styles.vNumberText, { color: (isSelected || isSpeaking || isFavorited) ? '#FFF' : colors.verseNumber }]}>
                                {isSelected ? '✓' : item.verseNumber}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.vTextContainer}>
                        <Text
                            selectable={true}
                            selectionColor="#FFF59D"
                            style={[
                                styles.vPrimaryText,
                                { color: (highlightColor || isSelected) ? '#1C1C1E' : colors.text },
                                isUnderlined && { textDecorationLine: 'underline', textDecorationColor: colors.accent }
                            ]}
                        >
                            {item.primary}
                        </Text>
                        {isDualMode && (
                            <View style={[styles.dualDivider, { backgroundColor: colors.border }]} />
                        )}
                        {isDualMode && (
                            <Text
                                selectable={true}
                                selectionColor="#FFF59D"
                                style={[styles.vSecondaryText, { color: (highlightColor || isSelected) ? '#3A3A3C' : colors.secondaryText }]}
                            >
                                {item.secondary}
                            </Text>
                        )}
                    </View>
                    <View style={styles.verseActionIcons}>
                        {isFavorited && <Text style={styles.smallIcon}>⭐</Text>}
                        {isSpeaking && <View style={styles.speakingIndicator}><Text>🔊</Text></View>}
                    </View>
                </View>
            </View>
        );
    };

    const currentLangVoices = availableVoices.filter(v =>
        (language === 'en' && v.language.startsWith('en')) ||
        (language === 'te' && v.language.startsWith('te'))
    );

    return (
        <SafeAreaView style={[styles.readContainer, { backgroundColor: colors.background }]} edges={['right', 'left', 'bottom']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />
            <FlatList
                ref={flatListRef}
                data={verses}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.readList}
                showsVerticalScrollIndicator={false}
                onScrollToIndexFailed={(info) => {
                    setTimeout(() => {
                        if (flatListRef.current) flatListRef.current.scrollToIndex({ index: info.index, animated: true });
                    }, 500);
                }}
            />

            {/* Action Panel Modal */}
            <Modal
                visible={isActionPanelVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsActionPanelVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={() => setIsActionPanelVisible(false)}
                >
                    <View style={[styles.actionPanel, { backgroundColor: colors.card }]}>
                        <View style={styles.actionHeader}>
                            <View style={[styles.vNumberBox, { backgroundColor: colors.accent }]}>
                                <Text style={[styles.vNumberText, { color: '#FFF' }]}>
                                    {selectedVerses.length > 0 ? '✓' : activeVerseData?.verseNumber}
                                </Text>
                            </View>
                            <Text style={[styles.actionTitle, { color: colors.text }]}>
                                {selectedVerses.length > 0 ? `${selectedVerses.length} Verses Selected` : 'Verse Options'}
                            </Text>
                            <TouchableOpacity onPress={() => { setIsActionPanelVisible(false); setSelectedVerses([]); }}>
                                <Text style={{ fontSize: 24, color: colors.secondaryText }}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedVerses.length === 0 && (
                            <>
                                <Text style={[styles.actionLabel, { color: colors.secondaryText }]}>HIGHLIGHT COLOR</Text>
                                <View style={styles.colorRow}>
                                    {['#FFF59D', '#A5D6A7', '#90CAF9', '#EF9A9A', '#CE93D8'].map((color) => (
                                        <TouchableOpacity
                                            key={color}
                                            style={[
                                                styles.colorCircle,
                                                { backgroundColor: color },
                                                (highlights[activeVerseData?.id] === color || oldColorMap[highlights[activeVerseData?.id]] === color) && { borderWidth: 3, borderColor: colors.accent }
                                            ]}
                                            onPress={() => toggleHighlight(activeVerseData.id, color)}
                                        />
                                    ))}
                                    <TouchableOpacity
                                        style={[styles.colorCircle, { backgroundColor: colors.highlight, justifyContent: 'center', alignItems: 'center' }]}
                                        onPress={() => toggleHighlight(activeVerseData.id, highlights[activeVerseData.id])}
                                    >
                                        <Text style={{ fontSize: 20 }}>🚫</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        <View style={styles.mainActionsRow}>
                            {selectedVerses.length === 0 && (
                                <TouchableOpacity
                                    style={[styles.actionBtn, { backgroundColor: favorites.includes(activeVerseData?.id) ? colors.accent : colors.highlight }]}
                                    onPress={() => toggleFavorite(activeVerseData.id)}
                                >
                                    <Text style={{ fontSize: 20 }}>{favorites.includes(activeVerseData?.id) ? '⭐' : '☆'}</Text>
                                    <Text style={[styles.actionBtnText, { color: favorites.includes(activeVerseData?.id) ? '#FFF' : colors.text }]}>Favorite</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: colors.highlight }]}
                                onPress={copyVerse}
                            >
                                <Text style={{ fontSize: 20 }}>📋</Text>
                                <Text style={[styles.actionBtnText, { color: colors.text }]}>Copy</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionBtn, { backgroundColor: colors.highlight }]}
                                onPress={shareVerse}
                            >
                                <Text style={{ fontSize: 20 }}>🔗</Text>
                                <Text style={[styles.actionBtnText, { color: colors.text }]}>Share</Text>
                            </TouchableOpacity>
                        </View>


                        {selectedVerses.length === 0 && (
                            <>
                                <View style={[styles.drawerDivider, { backgroundColor: colors.border, marginVertical: 20 }]} />
                                <Text style={[styles.actionLabel, { color: colors.secondaryText, marginBottom: 12 }]}>CROSS REFERENCES</Text>
                                
                                <ScrollView 
                                    style={{ maxHeight: 280 }} 
                                    showsVerticalScrollIndicator={true}
                                    indicatorStyle={theme === 'dark' ? 'white' : 'black'}
                                >
                                    {crossRefs.length === 0 ? (
                                        <View style={styles.emptyRefContainer}>
                                            <Text style={[styles.emptyRef, { color: colors.secondaryText }]}>
                                                No cross references found for this verse.
                                            </Text>
                                        </View>
                                    ) : (
                                        crossRefs && crossRefs.length > 0 ? (
                                            crossRefs.map((ref, idx) => {
                                                if (!ref) return null;
                                                // Look up the verse text for preview
                                                const targetBookName = ref.book;
                                                const targetBookIndex = ENGLISH_BOOKS.indexOf(targetBookName);
                                                let previewText = '';
                                                let displayBookName = targetBookName;
                                                
                                                if (targetBookIndex >= 0) {
                                                    const bookData = getBookData(targetBookIndex, language);
                                                    displayBookName = language === 'te' ? TELUGU_BOOKS[targetBookIndex] : targetBookName;
                                                    
                                                    if (bookData && bookData.Chapter && bookData.Chapter[ref.chapter - 1]) {
                                                        const verseData = bookData.Chapter[ref.chapter - 1].Verse[ref.verse - 1];
                                                        if (verseData) {
                                                            previewText = verseData.Verse;
                                                        }
                                                    }
                                                }

                                                return (
                                                    <TouchableOpacity
                                                        key={idx}
                                                        onPress={() => {
                                                            setIsActionPanelVisible(false);
                                                            if (targetBookIndex >= 0) {
                                                                navigation.push('Reading', {
                                                                    bookIndex: targetBookIndex,
                                                                    chapterIndex: ref.chapter - 1,
                                                                    bookName: displayBookName,
                                                                    verseIndex: ref.verse - 1
                                                                });
                                                            }
                                                        }}
                                                        style={[styles.refLinkContainer, { backgroundColor: colors.highlight, borderColor: colors.border }]}
                                                    >
                                                        <View style={styles.refHeaderRow}>
                                                            <View style={[styles.refIconCircle, { backgroundColor: colors.accent }]}>
                                                                <Text style={{ fontSize: 10, color: '#FFF' }}>🔗</Text>
                                                            </View>
                                                            <Text style={[styles.refTitleText, { color: colors.text }]}>
                                                                {displayBookName} {ref.chapter}:{ref.verse}
                                                            </Text>
                                                        </View>
                                                        {previewText ? (
                                                            <Text style={[styles.refBodyText, { color: colors.secondaryText }]} numberOfLines={3}>
                                                                "{previewText}"
                                                            </Text>
                                                        ) : (
                                                            ref.text ? (
                                                                <Text style={[styles.refBodyText, { color: colors.secondaryText }]} numberOfLines={3}>
                                                                    "{ref.text}"
                                                                </Text>
                                                            ) : null
                                                        )}
                                                    </TouchableOpacity>
                                                );
                                            })
                                        ) : (
                                            <View style={styles.emptyRefContainer}>
                                                <Text style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>📖</Text>
                                                <Text style={[styles.emptyRef, { color: colors.secondaryText }]}>
                                                    No specific cross references found for this verse.
                                                </Text>
                                            </View>
                                        )
                                    )}
                                </ScrollView>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal
                visible={isSettingsVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsSettingsVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={() => setIsSettingsVisible(false)}
                >
                    <View style={[styles.settingPanel, { backgroundColor: colors.card }]}>
                        <View style={styles.settingHeaderBox}>
                            <Text style={[styles.settingTitle, { color: colors.text }]}>Audio Voice Control</Text>
                            <TouchableOpacity onPress={() => setIsSettingsVisible(false)}>
                                <Text style={{ fontSize: 24, color: colors.secondaryText }}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.sLabel, { color: colors.secondaryText }]}>READING SPEED</Text>
                        <View style={styles.sControlRow}>
                            <TouchableOpacity onPress={() => setSpeechRate(prev => Math.max(0.1, prev - 0.1))} style={[styles.sControlButton, { backgroundColor: colors.highlight }]}>
                                <Text style={{ fontSize: 24, color: colors.text }}>-</Text>
                            </TouchableOpacity>
                            <Text style={[styles.sValue, { color: colors.accent }]}>{speechRate.toFixed(1)}x</Text>
                            <TouchableOpacity onPress={() => setSpeechRate(prev => Math.min(2.0, prev + 0.1))} style={[styles.sControlButton, { backgroundColor: colors.highlight }]}>
                                <Text style={{ fontSize: 24, color: colors.text }}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.sLabel, { color: colors.secondaryText, marginTop: 20 }]}>SELECT VOICE</Text>
                        <View style={[styles.voiceList, { borderColor: colors.border }]}>
                            <ScrollView nestedScrollEnabled={true}>
                                {currentLangVoices.map((v, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={[styles.voiceOption, selectedVoice === v.identifier && { backgroundColor: colors.highlight }]}
                                        onPress={() => setSelectedVoice(v.identifier)}
                                    >
                                        <Text style={[styles.voiceName, { color: colors.text, fontWeight: selectedVoice === v.identifier ? '800' : '600' }]}>
                                            {v.name} {selectedVoice === v.identifier ? '✓' : ''}
                                        </Text>
                                        <Text style={{ color: colors.secondaryText, fontSize: 10 }}>{v.identifier}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        <TouchableOpacity
                            onPress={() => setIsSettingsVisible(false)}
                            style={[styles.saveBtn, { backgroundColor: colors.accent }]}
                        >
                            <Text style={styles.saveBtnText}>Save Settings</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    readContainer: {
        flex: 1,
    },
    readList: {
        paddingTop: 10,
        paddingBottom: 50,
    },
    verseItem: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: 14,
        borderLeftWidth: 3,
        marginVertical: 1,
    },
    verseRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    vNumberBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        marginTop: 4,
    },
    vNumberText: {
        fontSize: 14,
        fontWeight: '900',
    },
    vTextContainer: {
        flex: 1,
    },
    vPrimaryText: {
        fontSize: 19,
        lineHeight: 32,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    dualDivider: {
        height: 1,
        marginVertical: 12,
        opacity: 0.3,
    },
    vSecondaryText: {
        fontSize: 18,
        lineHeight: 30,
        fontWeight: '500', // Increased from 400
        opacity: 0.95, // Increased from 0.8
    },
    speakingIndicator: {
        marginLeft: 10,
        marginTop: 10,
    },
    moreContainer: {
        marginTop: 16,
        marginLeft: 48,
    },
    refBox: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
    },
    refHeader: {
        marginBottom: 10,
    },
    refLabel: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    refLinkContainer: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
    },
    refHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    refIconCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    refTitleText: {
        fontSize: 15,
        fontWeight: '800',
    },
    refBodyText: {
        fontSize: 13,
        lineHeight: 18,
        fontStyle: 'italic',
        opacity: 0.8,
    },
    emptyRefContainer: {
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyRef: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
    headerIconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modePill: {
        paddingHorizontal: 16,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modePillText: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    settingPanel: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: SPACING.xl,
        paddingBottom: 40,
    },
    settingHeaderBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    settingTitle: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    sLabel: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    sControlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    sControlButton: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sValue: {
        fontSize: 32,
        fontWeight: '900',
    },
    voiceList: {
        height: 180,
        borderWidth: 1,
        borderRadius: 16,
        marginTop: 15,
        overflow: 'hidden',
    },
    voiceOption: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    voiceName: {
        fontSize: 16,
    },
    saveBtn: {
        marginTop: 30,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '900',
    },
    actionPanel: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
    },
    actionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    actionTitle: {
        fontSize: 20,
        fontWeight: '900',
        marginLeft: 16,
        flex: 1,
    },
    actionLabel: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    colorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    colorCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    mainActionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        height: 60,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    actionBtnText: {
        fontSize: 15,
        fontWeight: '700',
    },
    verseActionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    smallIcon: {
        fontSize: 14,
    },
    drawerDivider: {
        height: 1,
        opacity: 0.2,
    }
});
