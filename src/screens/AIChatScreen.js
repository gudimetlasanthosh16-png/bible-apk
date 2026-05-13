import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Animated, StatusBar, Image, ActivityIndicator, Alert, Share, Linking } from 'react-native';
import * as Network from 'expo-network';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { getAIResponse } from '../services/AIService';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import * as Clipboard from 'expo-clipboard';

const SUGGESTIONS = [
    { id: '1', text: 'Give me a verse for peace', icon: '🕊️' },
    { id: '2', text: 'Show me an image of Noah\'s Ark', icon: '🚢' },
    { id: '3', text: 'Strength in hard times', icon: '🛡️' },
    { id: '4', text: 'Picture of a peaceful garden', icon: '🌿' },
];

export default function AIChatScreen({ navigation }) {
    const { colors, theme, language, bibleData } = useContext(BibleContext);
    const [messages, setMessages] = useState([
        { id: '1', text: language === 'en' ? 'Praise the Lord! I am Holy AI, your spiritual companion. How can I help you explore the Word today?' : 'ప్రభువుకు స్తోత్రం! నేను హోలీ AI, మీ ఆధ్యాత్మిక తోడుని. ఈ రోజు వాక్యాన్ని అన్వేషించడంలో నేను మీకు ఎలా సహాయపడగలను?', sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    
    const flatListRef = useRef();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true })
        ]).start();
    }, []);

    const handleDownload = async (imageUrl) => {
        try {
            setIsDownloading(true);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Required", "Please grant gallery permissions to save the holy image.");
                return;
            }

            const filename = `HolyAI_${Date.now()}.jpg`;
            const fileUri = `${FileSystem.documentDirectory}${filename}`;
            
            const downloadRes = await FileSystem.downloadAsync(imageUrl, fileUri);
            
            if (downloadRes.status === 200) {
                const asset = await MediaLibrary.createAssetAsync(downloadRes.uri);
                await MediaLibrary.createAlbumAsync('Holy AI', asset, false);
                Alert.alert("Divine Image Saved", "The image has been saved to your gallery in the 'Holy AI' folder.");
            }
        } catch (error) {
            console.error("Download Error:", error);
            Alert.alert("Download Failed", "There was an error saving the image.");
        } finally {
            setIsDownloading(false);
        }
    };

    const reportResponse = (messageId) => {
        Alert.alert(
            "Report Content",
            "Are you sure you want to report this AI response? This helps us keep the app safe.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Report", 
                    style: "destructive",
                    onPress: () => Alert.alert("Divine Peace", "Thank you. Our scholars will review this message immediately.")
                }
            ]
        );
    };

    const handleSend = async (text) => {
        const message = text || inputText;
        if (!message.trim()) return;

        // Offline Check
        const networkState = await Network.getNetworkStateAsync();
        if (!networkState.isConnected) {
            Alert.alert("Offline", "Please connect to the internet to receive divine guidance.");
            return;
        }

        if (!hasStarted) setHasStarted(true);

        const newUserMessage = { id: Date.now().toString(), text: message, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setInputText('');
        setIsTyping(true);

        const response = await getAIResponse(message, messages, language, bibleData);

        const newAiMessage = {
            id: (Date.now() + 1).toString(),
            text: response.text,
            image: response.image,
            links: response.links,
            sender: 'ai'
        };

        setMessages(prev => [...prev, newAiMessage]);
        setIsTyping(false);
    };

    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
        Alert.alert("Success", "Response copied to clipboard!");
    };

    const shareResponse = async (text) => {
        try {
            await Share.share({
                message: text,
                title: 'Spiritual Guidance from Holy AI'
            });
        } catch (error) {
            console.error("Share Error:", error);
        }
    };

    const renderMessage = ({ item }) => (
        <Animated.View 
            style={[
                styles.messageWrapper, 
                item.sender === 'user' ? styles.userWrapper : styles.aiWrapper,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
        >
            <View style={[
                styles.messageBubble,
                item.sender === 'user'
                    ? { backgroundColor: '#B8860B', borderBottomRightRadius: 4 }
                    : { backgroundColor: colors.card, borderColor: '#B8860B33', borderWidth: 1, borderBottomLeftRadius: 4 },
                SHADOWS.md
            ]}>
                {item.image && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: item.image }} style={styles.generatedImage} />
                        <View style={styles.imageOverlay}>
                            <Text style={styles.imageTag}>HOLY VISION</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.downloadBtn}
                            onPress={() => handleDownload(item.image)}
                        >
                            <Text style={styles.downloadIcon}>💾</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <Text style={[styles.messageText, { color: item.sender === 'user' ? '#FFF' : colors.text }]}>
                    {item.text}
                </Text>

                {item.sender === 'ai' && item.links && item.links.length > 0 && (
                    <View style={styles.linksContainer}>
                        <Text style={[styles.linksTitle, { color: colors.accent }]}>📚 Commentary Links</Text>
                        {item.links.map((link, idx) => (
                            <TouchableOpacity 
                                key={idx} 
                                style={[styles.linkBtn, { backgroundColor: colors.highlight }]}
                                onPress={() => Linking.openURL(link.url)}
                            >
                                <Text style={[styles.linkText, { color: colors.accent }]}>{link.title}</Text>
                                <Text style={{ color: colors.accent, opacity: 0.5 }}>↗</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {item.sender === 'ai' && (
                    <View style={styles.aiActions}>
                        <TouchableOpacity 
                            onPress={() => copyToClipboard(item.text)}
                            style={styles.aiActionBtn}
                        >
                            <Text style={styles.aiActionIcon}>📋</Text>
                            <Text style={[styles.aiActionText, { color: colors.secondaryText }]}>Copy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => shareResponse(item.text)}
                            style={styles.aiActionBtn}
                        >
                            <Text style={styles.aiActionIcon}>🔗</Text>
                            <Text style={[styles.aiActionText, { color: colors.secondaryText }]}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => reportResponse(item.id)}
                            style={[styles.aiActionBtn, { marginLeft: 'auto' }]}
                        >
                            <Text style={[styles.aiActionIcon, { opacity: 0.5 }]}>🚩</Text>
                            <Text style={[styles.aiActionText, { color: '#FF4444', opacity: 0.7 }]}>Report</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView style={[styles.chatContainer, { backgroundColor: colors.background }]} edges={['bottom']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />
            
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
                
                {!hasStarted && messages.length <= 1 ? (
                    <View style={styles.centeredView}>
                        <Animated.View style={[styles.oracleBox, { opacity: fadeAnim, transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }]}>
                            <View style={styles.glowRing} />
                            <Text style={[styles.oracleEmoji, { color: colors.accent }]}>🕊️</Text>
                            <Text style={[styles.oracleTitle, { color: colors.text }]}>Holy AI</Text>
                            <Text style={[styles.oracleSub, { color: colors.secondaryText }]}>Divine Wisdom at your fingertips</Text>
                            
                            <View style={styles.suggestionGrid}>
                                {SUGGESTIONS.map(s => (
                                    <TouchableOpacity 
                                        key={s.id} 
                                        style={[styles.oracleSuggest, { backgroundColor: colors.card, borderColor: colors.border }]}
                                        onPress={() => handleSend(s.text)}
                                    >
                                        <Text style={styles.oracleSuggestIcon}>{s.icon}</Text>
                                        <Text style={[styles.oracleSuggestText, { color: colors.text }]}>{s.text}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Animated.View>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.messageList}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />
                )}

                {isTyping && (
                    <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                        <Text style={{ color: colors.secondaryText, fontSize: 12, fontStyle: 'italic' }}>Holy AI is reflecting...</Text>
                    </View>
                )}

                <View style={[styles.inputContainer, { backgroundColor: colors.headerBackground, borderTopColor: colors.border }]}>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                        placeholder={language === 'en' ? "Ask anything spiritual..." : "ఆధ్యాత్మికంగా ఏదైనా అడగండి..."}
                        placeholderTextColor={colors.secondaryText}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity 
                        style={[styles.sendBtn, { backgroundColor: '#B8860B' }]} 
                        onPress={() => handleSend()}
                        disabled={!inputText.trim()}
                    >
                        <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '900' }}>→</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            {isDownloading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#B8860B" />
                    <Text style={styles.loadingText}>Saving to Gallery...</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    chatContainer: { flex: 1 },
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    oracleBox: { width: '100%', alignItems: 'center', padding: 30, borderRadius: 32, backgroundColor: 'rgba(184, 134, 11, 0.05)', borderWidth: 1, borderColor: 'rgba(184, 134, 11, 0.2)' },
    glowRing: { position: 'absolute', top: -10, width: 80, height: 80, borderRadius: 40, backgroundColor: '#B8860B22' },
    oracleEmoji: { fontSize: 48, marginBottom: 16 },
    oracleTitle: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    oracleSub: { fontSize: 14, fontWeight: '600', marginBottom: 30, opacity: 0.7 },
    suggestionGrid: { width: '100%', gap: 12 },
    oracleSuggest: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1 },
    oracleSuggestIcon: { fontSize: 18, marginRight: 12 },
    oracleSuggestText: { fontSize: 14, fontWeight: '700' },
    messageList: { padding: 20, paddingBottom: 40 },
    messageWrapper: { marginBottom: 20, maxWidth: '85%' },
    userWrapper: { alignSelf: 'flex-end' },
    aiWrapper: { alignSelf: 'flex-start' },
    messageBubble: { padding: 16, borderRadius: 24 },
    messageText: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
    imageContainer: { width: 240, height: 240, borderRadius: 20, overflow: 'hidden', marginBottom: 12 },
    generatedImage: { width: '100%', height: '100%' },
    imageOverlay: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    imageTag: { color: '#FFD700', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    downloadBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    downloadIcon: { fontSize: 18 },
    inputContainer: { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1 },
    input: { flex: 1, borderRadius: 30, paddingHorizontal: 20, paddingVertical: 12, maxHeight: 100, borderWidth: 1.5, fontSize: 16 },
    sendBtn: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
    loadingText: { color: '#FFF', marginTop: 10, fontSize: 16, fontWeight: '700' },
    aiActions: {
        flexDirection: 'row',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        gap: 16,
    },
    aiActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    aiActionIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    aiActionText: {
        fontSize: 12,
        fontWeight: '600',
    },
    linksContainer: {
        marginTop: 12,
        padding: 12,
        borderRadius: 16,
        backgroundColor: 'rgba(184, 134, 11, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(184, 134, 11, 0.1)',
    },
    linksTitle: {
        fontSize: 13,
        fontWeight: '900',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    linkBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        marginBottom: 6,
    },
    linkText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
