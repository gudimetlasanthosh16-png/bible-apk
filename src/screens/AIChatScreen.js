import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { getAIResponse } from '../services/AIService';

const SUGGESTIONS = [
    { id: '1', text: 'Give me a verse for peace', icon: '🕊️' },
    { id: '2', text: 'Daily encouragement', icon: '☀️' },
    { id: '3', text: 'Strength in hard times', icon: '🛡️' },
    { id: '4', text: 'Explain Faith', icon: '📖' },
];

export default function AIChatScreen({ navigation }) {
    const { colors, theme, language } = useContext(BibleContext);
    const [messages, setMessages] = useState([
        { id: '1', text: language === 'en' ? 'Praise the Lord! I am Holy AI, your spiritual companion. How can I help you explore the Word today?' : 'ప్రభువుకు స్తోత్రం! నేను హోలీ AI, మీ ఆధ్యాత్మిక తోడుని. ఈ రోజు వాక్యాన్ని అన్వేషించడంలో నేను మీకు ఎలా సహాయపడగలను?', sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef();
    const typingAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isTyping) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(typingAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                    Animated.timing(typingAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
                ])
            ).start();
        }
    }, [isTyping]);

    const handleSend = async (text) => {
        const message = text || inputText;
        if (!message.trim()) return;

        const newUserMessage = { id: Date.now().toString(), text: message, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setInputText('');
        setIsTyping(true);

        // REAL ML LOGIC - Divine Logic Engine
        const response = await getAIResponse(message, messages, language);

        const newAiMessage = {
            id: (Date.now() + 1).toString(),
            text: response.text,
            sender: 'ai'
        };

        setMessages(prev => [...prev, newAiMessage]);
        setIsTyping(false);
    };

    const renderMessage = ({ item }) => (
        <View style={[styles.messageWrapper, item.sender === 'user' ? styles.userWrapper : styles.aiWrapper]}>
            {item.sender === 'ai' && (
                <View style={[styles.aiAvatar, { backgroundColor: colors.accent }]}>
                    <Text style={{ fontSize: 12 }}>🤖</Text>
                </View>
            )}
            <View style={[
                styles.messageBubble,
                item.sender === 'user'
                    ? { backgroundColor: colors.accent }
                    : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
                item.sender === 'user' ? styles.userBubble : styles.aiBubble
            ]}>
                <Text style={[styles.messageText, { color: item.sender === 'user' ? '#FFF' : colors.text }]}>
                    {item.text}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.chatContainer, { backgroundColor: colors.background }]} edges={['bottom']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messageList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    ListHeaderComponent={() => (
                        <View style={styles.chatHeader}>
                            <Text style={[styles.chatSub, { color: colors.accent }]}>HOLY AI</Text>
                            <Text style={[styles.chatTitle, { color: colors.text }]}>Spiritual Guide</Text>

                            <View style={styles.suggestionRow}>
                                {SUGGESTIONS.map(s => (
                                    <TouchableOpacity
                                        key={s.id}
                                        style={[styles.suggestBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                                        onPress={() => handleSend(s.text)}
                                    >
                                        <Text style={styles.suggestIcon}>{s.icon}</Text>
                                        <Text style={[styles.suggestText, { color: colors.text }]}>{s.text}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                />

                {isTyping && (
                    <Animated.View style={[styles.typingIndicator, { opacity: typingAnim }]}>
                        <Text style={{ color: colors.secondaryText, fontSize: 12 }}>Assistant is reflecting...</Text>
                    </Animated.View>
                )}

                <View style={[styles.inputContainer, { backgroundColor: colors.headerBackground, borderTopColor: colors.border }]}>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                        placeholder={language === 'en' ? "Ask anything..." : "ఏదైనా అడగండి..."}
                        placeholderTextColor={colors.secondaryText}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, { backgroundColor: colors.accent }]}
                        onPress={() => handleSend()}
                    >
                        <Text style={{ fontSize: 20 }}>🕊️</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
    },
    messageList: {
        padding: 20,
        paddingBottom: 40,
    },
    chatHeader: {
        marginBottom: 30,
        alignItems: 'center',
    },
    chatSub: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 4,
    },
    chatTitle: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 20,
    },
    suggestionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },
    suggestBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    suggestIcon: {
        marginRight: 6,
        fontSize: 14,
    },
    suggestText: {
        fontSize: 12,
        fontWeight: '700',
    },
    messageWrapper: {
        flexDirection: 'row',
        marginBottom: 20,
        maxWidth: '85%',
    },
    userWrapper: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    aiWrapper: {
        alignSelf: 'flex-start',
    },
    aiAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginTop: 4,
    },
    messageBubble: {
        padding: 16,
        borderRadius: 20,
    },
    userBubble: {
        borderTopRightRadius: 4,
    },
    aiBubble: {
        borderTopLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
    },
    inputContainer: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        maxHeight: 100,
        borderWidth: 1,
        fontSize: 16,
    },
    sendBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    typingIndicator: {
        paddingHorizontal: 30,
        marginBottom: 10,
    }
});
