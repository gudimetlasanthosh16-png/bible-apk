import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, Alert, Modal, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BibleContext } from '../context/BibleContext';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function UserModeScreen({ navigation }) {
    const { colors, language, theme } = useContext(BibleContext);
    const [notes, setNotes] = useState([]);
    const [moments, setMoments] = useState([]);
    const [others, setOthers] = useState([]);

    const [activeSection, setActiveSection] = useState('notes'); // 'notes', 'moments', 'others'
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [verseRef, setVerseRef] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const savedNotes = await AsyncStorage.getItem('user_notes');
            const savedMoments = await AsyncStorage.getItem('user_moments');
            const savedOthers = await AsyncStorage.getItem('user_others');

            if (savedNotes) setNotes(JSON.parse(savedNotes));
            if (savedMoments) setMoments(JSON.parse(savedMoments));
            if (savedOthers) setOthers(JSON.parse(savedOthers));
        } catch (e) {
            console.error('Failed to load user data', e);
        }
    };

    const saveData = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save user data', e);
        }
    };

    const handleAdd = () => {
        if (!content.trim()) {
            Alert.alert('Error', 'Content cannot be empty');
            return;
        }

        const newItem = {
            id: Date.now().toString(),
            title: title.trim() || (activeSection === 'notes' ? verseRef : 'New Entry'),
            content: content.trim(),
            verseRef: activeSection === 'notes' ? verseRef.trim() : null,
            date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        };

        if (activeSection === 'notes') {
            const updated = [newItem, ...notes];
            setNotes(updated);
            saveData('user_notes', updated);
        } else if (activeSection === 'moments') {
            const updated = [newItem, ...moments];
            setMoments(updated);
            saveData('user_moments', updated);
        } else {
            const updated = [newItem, ...others];
            setOthers(updated);
            saveData('user_others', updated);
        }

        // Reset form
        setTitle('');
        setContent('');
        setVerseRef('');
        setIsAddModalVisible(false);
    };

    const deleteItem = (id) => {
        Alert.alert(
            'Delete Entry',
            'Are you sure you want to remove this memory?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (activeSection === 'notes') {
                            const updated = notes.filter(item => item.id !== id);
                            setNotes(updated);
                            saveData('user_notes', updated);
                        } else if (activeSection === 'moments') {
                            const updated = moments.filter(item => item.id !== id);
                            setMoments(updated);
                            saveData('user_moments', updated);
                        } else {
                            const updated = others.filter(item => item.id !== id);
                            setOthers(updated);
                            saveData('user_others', updated);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const cardShadow = theme === 'light' ? SHADOWS.light : SHADOWS.dark;
        return (
            <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }, cardShadow]}>
                <View style={styles.userCardHeader}>
                    <Text style={[styles.userCardTitle, { color: colors.text }]}>{item.title}</Text>
                    <View style={[styles.dateBadge, { backgroundColor: colors.highlight }]}>
                        <Text style={[styles.userCardDate, { color: colors.accent }]}>{item.date}</Text>
                    </View>
                </View>
                {item.verseRef && (
                    <View style={[styles.verseBox, { borderLeftColor: colors.accent }]}>
                        <Text style={[styles.verseLabel, { color: colors.accent }]}>REFERENCE</Text>
                        <Text style={[styles.verseVal, { color: colors.text }]}>{item.verseRef}</Text>
                    </View>
                )}
                <Text style={[styles.userCardContent, { color: colors.secondaryText }]}>{item.content}</Text>

                <View style={[styles.cardFoot, { borderTopColor: colors.border }]}>
                    <TouchableOpacity
                        style={styles.trashBtn}
                        onPress={() => deleteItem(item.id)}
                    >
                        <Text style={{ fontSize: 16 }}>🗑️</Text>
                        <Text style={[styles.trashText, { color: colors.secondaryText }]}>Delete Entry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const getActiveData = () => {
        if (activeSection === 'notes') return notes;
        if (activeSection === 'moments') return moments;
        return others;
    };

    return (
        <SafeAreaView style={[styles.userContainer, { backgroundColor: colors.background }]} edges={['bottom']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />

            <View style={[styles.userTabs, { backgroundColor: colors.headerBackground, borderBottomColor: colors.border }]}>
                {['notes', 'moments', 'others'].map(section => (
                    <TouchableOpacity
                        key={section}
                        style={[styles.userTab, activeSection === section && { borderBottomColor: colors.accent }]}
                        onPress={() => setActiveSection(section)}
                    >
                        <Text style={[styles.userTabText, { color: activeSection === section ? colors.accent : colors.secondaryText }]}>
                            {section.toUpperCase()}
                        </Text>
                        {activeSection === section && <View style={[styles.activeDot, { backgroundColor: colors.accent }]} />}
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={getActiveData()}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.userList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.userEmpty}>
                        <Text style={{ fontSize: 48, marginBottom: 20 }}>✍️</Text>
                        <Text style={[styles.userEmptyText, { color: colors.secondaryText }]}>
                            Your personal spiritual journal is empty. Title your first entry.
                        </Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={[styles.userFab, { backgroundColor: colors.accent }, SHADOWS.dark]}
                onPress={() => setIsAddModalVisible(true)}
                activeOpacity={0.9}
            >
                <Text style={styles.userFabIcon}>+</Text>
            </TouchableOpacity>

            <Modal
                visible={isAddModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsAddModalVisible(false)}
            >
                <View style={styles.uModalOverlay}>
                    <View style={[styles.uModalBox, { backgroundColor: colors.card }]}>
                        <View style={styles.uModalHeader}>
                            <Text style={[styles.uModalTitle, { color: colors.text }]}>
                                {activeSection === 'notes' ? 'VERSE REFLECTION' :
                                    activeSection === 'moments' ? 'DAILY MOMENT' : 'NEW ENTRY'}
                            </Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {activeSection === 'notes' && (
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.accent }]}>VERSE REFERENCE</Text>
                                    <TextInput
                                        style={[styles.uInput, { color: colors.text, borderColor: colors.border }]}
                                        placeholder="e.g. Psalms 23:1"
                                        placeholderTextColor={colors.secondaryText}
                                        value={verseRef}
                                        onChangeText={setVerseRef}
                                    />
                                </View>
                            )}

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.accent }]}>TITLE</Text>
                                <TextInput
                                    style={[styles.uInput, { color: colors.text, borderColor: colors.border }]}
                                    placeholder="Give your memory a name"
                                    placeholderTextColor={colors.secondaryText}
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.accent }]}>REFLECTION</Text>
                                <TextInput
                                    style={[styles.uInput, styles.uTextArea, { color: colors.text, borderColor: colors.border }]}
                                    placeholder="Write your thoughts..."
                                    placeholderTextColor={colors.secondaryText}
                                    multiline={true}
                                    value={content}
                                    onChangeText={setContent}
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.uModalBtns}>
                            <TouchableOpacity
                                style={[styles.uBtn, { backgroundColor: colors.highlight }]}
                                onPress={() => setIsAddModalVisible(false)}
                            >
                                <Text style={{ color: colors.text, fontWeight: '700' }}>DISCARD</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.uBtn, { backgroundColor: colors.accent }]}
                                onPress={handleAdd}
                            >
                                <Text style={{ color: '#fff', fontWeight: '800' }}>SAVE TO JOURNAL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    userContainer: {
        flex: 1,
    },
    userTabs: {
        flexDirection: 'row',
        height: 56,
        borderBottomWidth: 1,
    },
    userTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    userTabText: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        bottom: 8,
    },
    userList: {
        padding: SPACING.lg,
        paddingBottom: 100,
    },
    userCard: {
        padding: 24,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        marginBottom: 24,
    },
    userCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    userCardTitle: {
        fontSize: 22,
        fontWeight: '900',
        flex: 1,
        marginRight: 10,
        letterSpacing: -0.5,
    },
    dateBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    userCardDate: {
        fontSize: 10,
        fontWeight: '800',
    },
    verseBox: {
        borderLeftWidth: 3,
        paddingLeft: 12,
        marginBottom: 16,
    },
    verseLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 2,
    },
    verseVal: {
        fontSize: 16,
        fontWeight: '700',
    },
    userCardContent: {
        fontSize: 17,
        lineHeight: 26,
        marginBottom: 20,
    },
    cardFoot: {
        borderTopWidth: 1,
        paddingTop: 16,
    },
    trashBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trashText: {
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 8,
    },
    userFab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userFabIcon: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '300',
    },
    userEmpty: {
        marginTop: 80,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    userEmptyText: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '500',
        opacity: 0.6,
    },
    uModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    uModalBox: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 32,
        maxHeight: '85%',
    },
    uModalHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    uModalTitle: {
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
    },
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 10,
    },
    uInput: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        fontWeight: '500',
    },
    uTextArea: {
        height: 150,
        textAlignVertical: 'top',
    },
    uModalBtns: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
        marginBottom: 10,
    },
    uBtn: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
