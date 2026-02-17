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

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: SPACING.md }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Search')}
                        style={[styles.hBtn, { backgroundColor: colors.highlight, marginRight: 10 }]}
                    >
                        <Text style={{ fontSize: 20 }}>🔍</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => switchLanguage(language === 'en' ? 'te' : 'en')}
                        style={[styles.hBtn, { backgroundColor: colors.highlight }]}
                    >
                        <Text style={[styles.hBtnText, { color: colors.accent }]}>
                            {language === 'en' ? 'EN ⇄ TE' : 'TE ⇄ EN'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsMenuVisible(true)}
                        style={[styles.hBtn, { backgroundColor: colors.highlight, marginLeft: 10 }]}
                    >
                        <Text style={{ fontSize: 24, color: colors.text }}>☰</Text>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, colors, language]);

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

        return (
            <TouchableOpacity
                style={[styles.mediaCard, { backgroundColor: colors.card, borderColor: colors.border }, cardShadow]}
                onPress={() => navigation.navigate('StoryDetail', { story: item })}
                activeOpacity={0.8}
            >
                <View style={styles.mediaIconLarge}>
                    <Text style={{ fontSize: 32 }}>📖</Text>
                </View>
                <View style={styles.mediaContent}>
                    <Text style={[styles.mediaTitle, { color: colors.text }]}>{title}</Text>
                    <View style={[styles.mediaBadge, { backgroundColor: colors.highlight }]}>
                        <Text style={[styles.mediaBadgeText, { color: colors.accent }]}>READ STORY</Text>
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
    }

    return (
        <SafeAreaView style={[styles.hContainer, { backgroundColor: colors.background }]} edges={['right', 'left']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />

            <View style={[styles.hTabs, { backgroundColor: colors.headerBackground, borderBottomColor: colors.border }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                    {['Old Testament', 'New Testament', 'Children Stories', 'Songs'].map(tab => {
                        const title = tab === 'Old Testament' ? oldTestamentTitle :
                            tab === 'New Testament' ? newTestamentTitle :
                                tab === 'Children Stories' ? childrenStoriesTitle :
                                    (language === 'en' ? 'Songs' : 'పాటలు');
                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.hTab, activeTab === tab && { borderBottomColor: colors.accent }]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[styles.hTabText, { color: activeTab === tab ? colors.accent : colors.secondaryText }]}>
                                    {title}
                                </Text>
                                {activeTab === tab && <View style={[styles.hTabDot, { backgroundColor: colors.accent }]} />}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
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
                                style={[styles.devotionalCard, { backgroundColor: colors.card, borderColor: colors.accent }, theme === 'light' ? SHADOWS.light : SHADOWS.dark]}
                                onPress={() => navigation.navigate('DailyBread')}
                                activeOpacity={0.9}
                            >
                                <View style={[styles.devotionalAccent, { backgroundColor: colors.accent }]} />
                                <View style={styles.devotionalInner}>
                                    <View style={[styles.devotionalIcon, { backgroundColor: colors.highlight }]}>
                                        <Text style={{ fontSize: 24 }}>🍞</Text>
                                    </View>
                                    <View style={styles.devotionalTextContainer}>
                                        <Text style={[styles.devotionalTitle, { color: colors.accent }]}>
                                            {language === 'en' ? 'Daily Bread' : 'నేటి ఆహారం'}
                                        </Text>
                                        <Text style={[styles.devotionalSub, { color: colors.text }]}>
                                            {language === 'en' ? 'Start your day with a blessing' : 'ఈ రోజు ఆశీర్వాదంతో ప్రారంభించండి'}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 20, color: colors.accent }}>→</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <Text style={[styles.hListLabel, { color: colors.accent }]}>EXPLORE THE WORD</Text>
                        <Text style={[styles.hListTitle, { color: colors.text }]}>{activeTab}</Text>

                        {activeTab === 'Songs' && (
                            <View style={[styles.searchContainer, { backgroundColor: colors.highlight, borderColor: colors.accent, borderWidth: 1.5, shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }]}>
                                <Text style={{ fontSize: 20, marginRight: 12 }}>🔍</Text>
                                <TextInput
                                    style={[styles.searchInput, { color: colors.text }]}
                                    placeholder={language === 'en' ? "Search hymn number or and part of lyrics..." : "కీర్తన సంఖ్య లేదా సాహిత్యం వెతకండి..."}
                                    placeholderTextColor={colors.secondaryText}
                                    value={searchQuery}
                                    onChangeText={(text) => {
                                        setSearchQuery(text);
                                        listRef.current?.scrollToOffset({ offset: 0, animated: false });
                                    }}
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                                        <Text style={{ color: colors.secondaryText, fontSize: 18, fontWeight: '900' }}>✕</Text>
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
                            <TouchableOpacity onPress={() => setIsMenuVisible(false)} style={styles.drawerClose}>
                                <Text style={{ fontSize: 20, color: colors.secondaryText }}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.drawerDivider, { backgroundColor: colors.border }]} />

                        <ScrollView showsVerticalScrollIndicator={false}>
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
                                icon="🖼️"
                                title={language === 'en' ? 'Sacred Wallpapers' : 'వాల్‌పేపర్లు'}
                                onPress={() => { setIsMenuVisible(false); navigation.navigate('Wallpaper'); }}
                                colors={colors}
                            />

                            <View style={[styles.drawerDivider, { backgroundColor: colors.border, marginVertical: 32 }]} />

                            <View style={styles.drawerOption}>
                                <View style={styles.drawerOptionLeft}>
                                    <View style={[styles.drawerIconBox, { backgroundColor: colors.highlight }]}>
                                        <Text style={{ fontSize: 20 }}>{theme === 'light' ? '☀️' : '🌙'}</Text>
                                    </View>
                                    <View>
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
                            <Text style={[styles.vText, { color: colors.secondaryText }]}>Version 2.0.0 • Holy Bible Edition</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const DrawerItem = ({ icon, title, onPress, colors }) => (
    <TouchableOpacity style={styles.dItem} onPress={onPress} activeOpacity={0.6}>
        <View style={[styles.drawerIconBox, { backgroundColor: colors.highlight }]}>
            <Text style={{ fontSize: 20 }}>{icon}</Text>
        </View>
        <Text style={[styles.dItemText, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    hContainer: {
        flex: 1,
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
    hTabs: {
        flexDirection: 'row',
        height: 60,
        borderBottomWidth: 1,
    },
    hTab: {
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginRight: 8,
    },
    hTabText: {
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    hTabDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        position: 'absolute',
        bottom: 12,
    },
    hList: {
        padding: 20,
        paddingBottom: 40,
    },
    hListHead: {
        padding: 20,
        paddingTop: 10,
    },
    devotionalCard: {
        borderRadius: 20,
        borderWidth: 1.5,
        marginBottom: 30,
        overflow: 'hidden',
    },
    devotionalAccent: {
        height: 6,
        width: '100%',
    },
    devotionalInner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    devotionalIcon: {
        width: 54,
        height: 54,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    devotionalTextContainer: {
        flex: 1,
    },
    devotionalTitle: {
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    devotionalSub: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
        opacity: 0.7,
    },
    hListLabel: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 4,
    },
    hListTitle: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
    },
    bookCard: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    cardAccent: {
        position: 'absolute',
        left: 0,
        top: 20,
        bottom: 20,
        width: 3,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
    },
    bookInner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookNumBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    bookNum: {
        fontSize: 18,
        fontWeight: '900',
    },
    bookInfo: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    bookSub: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
    },
    bookChevron: {
        fontSize: 22,
        fontWeight: '300',
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
        width: 70,
        height: 70,
        borderRadius: 20,
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
        marginBottom: 12,
    },
    mediaBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    mediaBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    drawerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    drawerBox: {
        width: '85%',
        height: '100%',
        padding: 32,
        paddingTop: 64,
    },
    drawerHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    drawerBrand: {
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1.5,
    },
    drawerDivider: {
        height: 1,
        opacity: 0.1,
    },
    dItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    drawerIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18,
    },
    dItemText: {
        fontSize: 18,
        fontWeight: '800',
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
        fontSize: 12,
        fontWeight: '500',
        marginTop: 2,
    },
    drawerFoot: {
        marginTop: 'auto',
        alignItems: 'center',
        paddingBottom: 20,
    },
    vText: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
        opacity: 0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 24,
        marginTop: 20,
        marginBottom: 12,
        borderWidth: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        padding: 0,
    },
    clearButton: {
        padding: 4,
    },
    scrollTopButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    }
});
