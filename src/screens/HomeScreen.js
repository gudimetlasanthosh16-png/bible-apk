import React, { useContext, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, FlatList, Modal, Image, Alert, ScrollView, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS, TELUGU_BOOKS, ENGLISH_BOOKS } from '../constants/books';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function HomeScreen({ navigation }) {
    const { language, switchLanguage, colors, childrenStories, songs, theme, toggleTheme, dailyBreadRead, updateReadingActivity } = useContext(BibleContext);
    const [activeTab, setActiveTab] = useState('Old Testament');
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const listRef = useRef(null);

    const CustomHeader = () => (
        <View style={[styles.customHeader, { backgroundColor: colors.headerBackground, borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Holy Bible</Text>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Search')}
                    style={[styles.hBtn, { backgroundColor: colors.highlight }]}
                >
                    <Text style={{ fontSize: 20 }}>🔍</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => switchLanguage(language === 'en' ? 'te' : 'en')}
                    style={[styles.hBtn, { backgroundColor: colors.highlight, marginHorizontal: 8 }]}
                >
                    <Text style={[styles.hBtnText, { color: colors.accent }]}>
                        {language === 'en' ? 'EN ⇄ TE' : 'TE ⇄ EN'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setIsMenuVisible(true)}
                    style={[styles.hBtn, { backgroundColor: colors.highlight }]}
                >
                    <Text style={{ fontSize: 24, color: colors.text }}>☰</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const getBookName = (book) => {
        const englishIndex = ENGLISH_BOOKS.indexOf(book);
        if (englishIndex === -1) return book;
        return language === 'en' ? ENGLISH_BOOKS[englishIndex] : TELUGU_BOOKS[englishIndex];
    };

    const getSubtext = (book) => {
        const englishIndex = ENGLISH_BOOKS.indexOf(book);
        if (englishIndex === -1) return '';
        return language === 'en' ? TELUGU_BOOKS[englishIndex] : ENGLISH_BOOKS[englishIndex];
    };

    const getBookIndex = (book) => {
        return ENGLISH_BOOKS.indexOf(book);
    };

    const oldTestamentTitle = language === 'en' ? 'Old Testament' : 'పాత నిబంధన';
    const newTestamentTitle = language === 'en' ? 'New Testament' : 'కొత్త నిబంధన';
    const childrenStoriesTitle = language === 'en' ? 'Stories' : 'పిల్లల కథలు';

    const renderBookItem = ({ item, index }) => {
        const bookIndex = getBookIndex(item);
        const cardShadow = theme === 'light' ? SHADOWS.light : SHADOWS.dark;

        return (
            <TouchableOpacity
                style={[styles.bookCard, { backgroundColor: colors.card, borderColor: colors.border }, cardShadow]}
                onPress={() => navigation.navigate('ChapterSelection', { bookIndex: bookIndex, bookName: getBookName(item) })}
                activeOpacity={0.7}
            >
                <View style={[styles.cardAccent, { backgroundColor: colors.accent }]} />
                <View style={styles.bookInner}>
                    <View style={[styles.bookNumBox, { backgroundColor: colors.highlight }]}>
                        <Text style={[styles.bookNum, { color: colors.accent }]}>{index + 1}</Text>
                    </View>
                    <View style={styles.bookInfo}>
                        <Text style={[styles.bookTitle, { color: colors.text }]}>{getBookName(item)}</Text>
                        <Text style={[styles.bookSub, { color: colors.secondaryText }]}>{getSubtext(item)}</Text>
                    </View>
                    <View style={styles.bookActionBox}>
                        <Text style={[styles.bookChevron, { color: colors.border }]}>→</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderStoryItem = ({ item }) => {
        const title = language === 'te' ? item.title_te : item.title_en;
        const cardShadow = theme === 'light' ? SHADOWS.light : SHADOWS.dark;
        const emojis = ['🤴', '🦁', '🌊', '🔥', '🦅', '🏹', '🐋', '🥖'];
        const emoji = emojis[item.id % emojis.length] || '📖';

        return (
            <TouchableOpacity
                style={[styles.mediaCard, { backgroundColor: colors.card, borderColor: colors.border }, cardShadow]}
                onPress={() => navigation.navigate('StoryDetail', { story: item })}
                activeOpacity={0.8}
            >
                <View style={[styles.mediaIconLarge, { backgroundColor: colors.highlight }]}>
                    <Text style={{ fontSize: 36 }}>{emoji}</Text>
                </View>
                <View style={styles.mediaContent}>
                    <Text style={[styles.mediaSub, { color: colors.accent, marginBottom: 4 }]}>BIBLE STORY</Text>
                    <Text style={[styles.mediaTitle, { color: colors.text }]} numberOfLines={2}>
                        {title}
                    </Text>
                    <View style={[styles.mediaBadge, { backgroundColor: colors.accent, marginTop: 12, paddingHorizontal: 12 }]}>
                        <Text style={[styles.mediaBadgeText, { color: '#FFF' }]}>READ NOW</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderSongItem = ({ item }) => {
        const title = language === 'te' ? item.title_te : item.title_en;
        const cardShadow = theme === 'light' ? SHADOWS.light : SHADOWS.dark;
        const lyricsPreview = item.lyrics_te ? item.lyrics_te.replace(/\[V\d+\]/g, '').trim().substring(0, 60) + '...' : '';

        return (
            <TouchableOpacity
                style={[styles.mediaCard, { backgroundColor: colors.card, borderColor: colors.border }, cardShadow]}
                onPress={() => navigation.navigate('SongDetail', { song: item })}
                activeOpacity={0.8}
            >
                <View style={[styles.mediaIconLarge, { backgroundColor: colors.highlight }]}>
                    <Text style={{ fontSize: 32 }}>🎵</Text>
                </View>
                <View style={styles.mediaContent}>
                    <Text style={[styles.mediaTitle, { color: colors.text }]} numberOfLines={1}>
                        {item.hymn_number ? `${item.hymn_number}. ` : ''}{title}
                    </Text>
                    <Text style={[styles.mediaSub, { color: colors.secondaryText }]} numberOfLines={1}>
                        {lyricsPreview}
                    </Text>
                    <View style={[styles.mediaBadge, { backgroundColor: colors.highlight, marginTop: 8 }]}>
                        <Text style={[styles.mediaBadgeText, { color: colors.accent }]}>VIEW HYMN</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    const getData = () => {
        if (activeTab === 'Old Testament') return OLD_TESTAMENT_BOOKS;
        if (activeTab === 'New Testament') return NEW_TESTAMENT_BOOKS;
        if (activeTab === 'Children Stories') return childrenStories;
        if (activeTab === 'Songs') {
            if (!searchQuery) return songs;
            const lowerQuery = searchQuery.toLowerCase();
            return songs.filter(song =>
                (song.title_te && song.title_te.toLowerCase().includes(lowerQuery)) ||
                (song.hymn_number && song.hymn_number.toString().includes(lowerQuery)) ||
                (song.lyrics_te && song.lyrics_te.toLowerCase().includes(lowerQuery))
            );
        }
        return [];
    };

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (activeTab === 'Songs') {
            setShowScrollTop(offsetY > 300);
        } else {
            setShowScrollTop(false);
        }
    };

    const scrollToTop = () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    const handleSongMenuClick = () => {
        setActiveTab('Songs');
        setIsMenuVisible(false);
    };

    const handleStoryMenuClick = () => {
        setActiveTab('Children Stories');
        setIsMenuVisible(false);
    };

    return (
        <SafeAreaView style={[styles.hContainer, { backgroundColor: colors.background }]} edges={['right', 'left', 'top']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />
            <CustomHeader />

            <View style={[styles.hTabsContainer, { backgroundColor: colors.headerBackground }]}>
                <View style={[styles.segmentedControl, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                    {['Old Testament', 'New Testament'].map(tab => {
                        const title = tab === 'Old Testament' ? oldTestamentTitle : newTestamentTitle;
                        const isActive = activeTab === tab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.hTabPill,
                                    { backgroundColor: isActive ? colors.accent : 'transparent' }
                                ]}
                                onPress={() => setActiveTab(tab)}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.hTabPillText,
                                    { color: isActive ? '#FFFFFF' : colors.secondaryText }
                                ]}>
                                    {title}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <FlatList
                ref={listRef}
                data={getData()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={
                    activeTab === 'Children Stories' ? renderStoryItem :
                        activeTab === 'Songs' ? renderSongItem :
                            renderBookItem
                }
                contentContainerStyle={styles.hList}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                ListHeaderComponent={() => (
                    <View style={styles.hListHead}>
                        {/* Daily Devotional Highlight Card */}
                        {!dailyBreadRead && (
                            <TouchableOpacity
                                style={[styles.devotionalCard, { backgroundColor: colors.accent }, theme === 'light' ? SHADOWS.light : SHADOWS.dark]}
                                onPress={() => navigation.navigate('DailyBread')}
                                activeOpacity={0.9}
                            >
                                <View style={styles.devotionalInner}>
                                    <View style={[styles.devotionalIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                        <Text style={{ fontSize: 28 }}>☀️</Text>
                                    </View>
                                    <View style={styles.devotionalTextContainer}>
                                        <Text style={[styles.devotionalTitle, { color: '#FFFFFF' }]}>
                                            {language === 'en' ? 'Daily Bread' : 'నేటి ఆహారం'}
                                        </Text>
                                        <Text style={[styles.devotionalSub, { color: 'rgba(255,255,255,0.8)' }]}>
                                            {language === 'en' ? 'Start your day with a blessing' : 'ఈ రోజు ఆశీర్వాదంతో ప్రారంభించండి'}
                                        </Text>
                                    </View>
                                    <View style={[styles.devotionalAction, { backgroundColor: '#FFFFFF' }]}>
                                        <Text style={{ fontSize: 16, color: colors.accent, fontWeight: 'bold' }}>READ</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}

                        <Text style={[styles.hListLabel, { color: colors.accent }]}>EXPLORE THE WORD</Text>
                        <Text style={[styles.hListTitle, { color: colors.text }]}>{activeTab}</Text>

                        {activeTab === 'Songs' && (
                            <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 }]}>
                                <Text style={{ fontSize: 22, marginRight: 12, opacity: 0.5 }}>🔍</Text>
                                <TextInput
                                    style={[styles.searchInput, { color: colors.text }]}
                                    placeholder={language === 'en' ? "Search hymn number or lyrics..." : "కీర్తన సంఖ్య లేదా సాహిత్యం వెతకండి..."}
                                    placeholderTextColor={colors.secondaryText}
                                    value={searchQuery}
                                    onChangeText={(text) => {
                                        setSearchQuery(text);
                                        listRef.current?.scrollToOffset({ offset: 0, animated: false });
                                    }}
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                                        <View style={{ backgroundColor: colors.highlight, borderRadius: 12, padding: 4 }}>
                                            <Text style={{ color: colors.accent, fontSize: 14, fontWeight: '900' }}>✕</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                )}
            />

            {showScrollTop && activeTab === 'Songs' && (
                <TouchableOpacity
                    style={[styles.scrollTopButton, { backgroundColor: colors.accent }, SHADOWS.dark]}
                    onPress={scrollToTop}
                >
                    <Text style={{ fontSize: 28, color: '#fff', fontWeight: 'bold' }}>↑</Text>
                </TouchableOpacity>
            )}

            {/* Daily Bread FAB */}
            <TouchableOpacity
                style={[styles.dailyBreadFAB, { backgroundColor: colors.accent }, SHADOWS.dark]}
                onPress={() => navigation.navigate('DailyBread')}
                activeOpacity={0.9}
            >
                <View style={styles.fabInner}>
                    <Text style={{ fontSize: 28 }}>☀️</Text>
                </View>
            </TouchableOpacity>

            <Modal
                visible={isMenuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.drawerOverlay}
                    activeOpacity={1}
                    onPress={() => setIsMenuVisible(false)}
                >
                    <View style={[styles.drawerBox, { backgroundColor: colors.card }]}>
                        <View style={styles.drawerHead}>
                            <Text style={[styles.drawerBrand, { color: colors.accent }]}>Holy Bible</Text>
                            <TouchableOpacity onPress={() => setIsMenuVisible(false)} style={[styles.drawerClose, {backgroundColor: colors.highlight}]}>
                                <Text style={{ fontSize: 16, color: colors.accent, fontWeight: 'bold' }}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.drawerDivider, { backgroundColor: colors.border }]} />

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <DrawerItem
                                icon="📖"
                                title={language === 'en' ? 'Children Stories' : 'పిల్లల కథలు'}
                                onPress={handleStoryMenuClick}
                                colors={colors}
                            />
                            <DrawerItem
                                icon="🎵"
                                title={language === 'en' ? 'Christian Songs' : 'కీర్తనలు'}
                                onPress={handleSongMenuClick}
                                colors={colors}
                            />
                            <DrawerItem
                                icon="✍️"
                                title={language === 'en' ? 'Spiritual Journal' : 'జర్నల్'}
                                onPress={() => { setIsMenuVisible(false); navigation.navigate('UserMode'); }}
                                colors={colors}
                            />
                            <DrawerItem
                                icon="🤖"
                                title={language === 'en' ? 'Holy AI' : 'AI చాట్'}
                                onPress={() => { setIsMenuVisible(false); navigation.navigate('AIChat'); }}
                                colors={colors}
                            />

                            <View style={[styles.drawerDivider, { backgroundColor: colors.border, marginVertical: 32 }]} />

                            <View style={[styles.drawerOption, { backgroundColor: colors.highlight, padding: 16, borderRadius: 20 }]}>
                                <View style={styles.drawerOptionLeft}>
                                    <View style={[styles.drawerIconBox, { backgroundColor: colors.card }]}>
                                        <Text style={{ fontSize: 22 }}>{theme === 'light' ? '☀️' : '🌙'}</Text>
                                    </View>
                                    <View style={{ marginLeft: 16 }}>
                                        <Text style={[styles.drawerOptionText, { color: colors.text }]}>Dark Mode</Text>
                                        <Text style={[styles.drawerOptionSub, { color: colors.secondaryText }]}>Comfort for your eyes</Text>
                                    </View>
                                </View>
                                <Switch
                                    trackColor={{ false: "#D1D5DB", true: colors.accent }}
                                    thumbColor="#fff"
                                    onValueChange={toggleTheme}
                                    value={theme === 'dark'}
                                />
                            </View>
                        </ScrollView>

                        <View style={styles.drawerFoot}>
                            <Text style={[styles.vText, { color: colors.secondaryText }]}>Version 2.1.0 • Holy Bible Edition</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView >
    );
}

const DrawerItem = ({ icon, title, onPress, colors }) => (
    <TouchableOpacity style={styles.dItem} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.drawerIconBox, { backgroundColor: colors.highlight }]}>
            <Text style={{ fontSize: 22 }}>{icon}</Text>
        </View>
        <Text style={[styles.dItemText, { color: colors.text }]}>{title}</Text>
        <Text style={{ marginLeft: 'auto', fontSize: 18, color: colors.secondaryText, opacity: 0.5 }}>›</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    hContainer: {
        flex: 1,
    },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hBtnText: {
        fontSize: 10,
        fontWeight: '900',
    },
    hTabsContainer: {
        paddingVertical: 16,
        paddingHorizontal: SPACING.md,
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)', // Fallback, will be replaced with colors.highlight in component if needed, but keeping it simple
        borderRadius: BORDER_RADIUS.full,
        padding: 4,
    },
    hTabPill: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hTabPillText: {
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    hList: {
        padding: 16,
        paddingBottom: 60,
    },
    hListHead: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    devotionalCard: {
        borderRadius: 24,
        marginBottom: 32,
        overflow: 'hidden',
    },
    devotionalInner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
    },
    devotionalIcon: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    devotionalTextContainer: {
        flex: 1,
    },
    devotionalTitle: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    devotionalSub: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4,
    },
    devotionalAction: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
    },
    hListLabel: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2.5,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    hListTitle: {
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1.2,
        marginBottom: 10,
    },
    bookCard: {
        padding: 22,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    cardAccent: {
        position: 'absolute',
        left: 0,
        top: '20%',
        bottom: '20%',
        width: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    bookInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookNumBox: {
        width: 50,
        height: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18,
    },
    bookNum: {
        fontSize: 18,
        fontWeight: '900',
    },
    bookInfo: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    bookSub: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 4,
    },
    bookChevron: {
        fontSize: 24,
        fontWeight: '300',
        opacity: 0.4,
    },
    mediaCard: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 20,
        alignItems: 'center',
    },
    mediaIconLarge: {
        width: 76,
        height: 76,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
    },
    mediaContent: {
        flex: 1,
    },
    mediaTitle: {
        fontSize: 22,
        fontWeight: '900',
        lineHeight: 28,
        marginBottom: 6,
    },
    mediaBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },
    mediaBadgeText: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1,
    },
    drawerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    drawerBox: {
        width: '85%',
        height: '100%',
        padding: 32,
        paddingTop: 64,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
    },
    drawerHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    drawerBrand: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1.5,
    },
    drawerClose: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawerDivider: {
        height: 1,
        opacity: 0.1,
        marginBottom: 20,
    },
    dItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        marginBottom: 8,
    },
    drawerIconBox: {
        width: 52,
        height: 52,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18,
    },
    dItemText: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    drawerOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    drawerOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    drawerOptionText: {
        fontSize: 17,
        fontWeight: '800',
    },
    drawerOptionSub: {
        fontSize: 13,
        fontWeight: '500',
        marginTop: 2,
    },
    drawerFoot: {
        marginTop: 'auto',
        alignItems: 'center',
        paddingBottom: 20,
    },
    vText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        opacity: 0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 24,
        marginTop: 20,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 17,
        fontWeight: '600',
        padding: 0,
    },
    clearButton: {
        padding: 4,
    },
    scrollTopButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    dailyBreadFAB: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    fabInner: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
