import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Modal, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { SHADOWS, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 24;

const SAMPLE_WALLPAPERS = [
    { id: '1', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', verse: 'The heavens declare the glory of God.' },
    { id: '2', url: 'https://images.unsplash.com/photo-1501854140801-50d01674aa3e?auto=format&fit=crop&w=800&q=80', verse: 'Be still and know that I am God.' },
    { id: '3', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', verse: 'Great is thy faithfulness.' },
    { id: '4', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80', verse: 'The Lord is my shepherd.' },
    { id: '5', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', verse: 'I can do all things through Christ.' },
    { id: '6', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80', verse: 'God is love.' },
    { id: '7', url: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c1a?auto=format&fit=crop&w=800&q=80', verse: 'Trust in the LORD with all thine heart.' },
    { id: '8', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', verse: 'The LORD is my light and my salvation.' },
    { id: '9', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80', verse: 'Thy word is a lamp unto my feet.' },
    { id: '10', url: 'https://images.unsplash.com/photo-1433086566608-bc710c3bc4db?auto=format&fit=crop&w=800&q=80', verse: 'Everything beautiful in its time.' },
    { id: '11', url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=800&q=80', verse: 'Blessed are the peacemakers.' },
    { id: '12', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80', verse: 'Under the shadow of His wings.' },
    { id: '13', url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=800&q=80', verse: 'Peace I leave with you.' },
    { id: '14', url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=800&q=80', verse: 'Faith can move mountains.' },
    { id: '15', url: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=800&q=80', verse: 'The joy of the LORD is your strength.' },
];

export default function WallpaperScreen({ navigation }) {
    const { colors, theme } = useContext(BibleContext);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleDownload = async (imageUrl) => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Storage permission is required to save the wallpaper.');
                return;
            }

            const fileName = imageUrl.split('/').pop().split('?')[0] + '.jpg';
            const fileUri = FileSystem.documentDirectory + fileName;

            const downloadResumable = FileSystem.createDownloadResumable(imageUrl, fileUri);
            const { uri } = await downloadResumable.downloadAsync();

            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync('Holy Bible Wallpapers', asset, false);

            Alert.alert('Success', 'Wallpaper saved to your gallery!');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to download wallpaper.');
        }
    };

    const renderItem = ({ item }) => {
        const cardShadow = theme === 'light' ? SHADOWS.light : SHADOWS.dark;
        return (
            <TouchableOpacity
                style={[styles.wallItem, { backgroundColor: colors.card, borderColor: colors.border }, cardShadow]}
                onPress={() => setSelectedImage(item)}
                activeOpacity={0.9}
            >
                <Image source={{ uri: item.url }} style={styles.wallThumb} />
                <View style={styles.wallOverlay}>
                    <Text style={[styles.wallVerseShort, { color: '#FFF' }]} numberOfLines={2}>
                        {item.verse}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.wallContainer, { backgroundColor: colors.background }]} edges={['bottom']}>
            <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBackground} />

            <View style={[styles.wallHeader, { borderBottomColor: colors.border }]}>
                <View>
                    <Text style={[styles.wallSub, { color: colors.accent }]}>SACRED ART</Text>
                    <Text style={[styles.wallTitle, { color: colors.text }]}>Wallpapers</Text>
                </View>
                <TouchableOpacity
                    style={[styles.wallCreateBtn, { backgroundColor: colors.accent }]}
                    onPress={() => navigation.navigate('WallpaperCreator')}
                >
                    <Text style={styles.wallCreateBtnText}>CREATE</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={SAMPLE_WALLPAPERS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.wallGrid}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.wallRow}
            />

            <Modal
                visible={!!selectedImage}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedImage(null)}
            >
                <View style={styles.previewOverlay}>
                    {selectedImage && (
                        <View style={[styles.previewContent, { backgroundColor: colors.card }]}>
                            <Image source={{ uri: selectedImage.url }} style={styles.previewImg} />

                            <View style={styles.previewMeta}>
                                <Text style={[styles.previewVerse, { color: colors.text }]}>{selectedImage.verse}</Text>

                                <View style={styles.previewBtns}>
                                    <TouchableOpacity
                                        style={[styles.pBtn, { backgroundColor: colors.highlight }]}
                                        onPress={() => setSelectedImage(null)}
                                    >
                                        <Text style={[styles.pBtnText, { color: colors.text }]}>BACK</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.pBtn, { backgroundColor: colors.accent }]}
                                        onPress={() => handleDownload(selectedImage.url)}
                                    >
                                        <Text style={[styles.pBtnText, { color: '#fff' }]}>SAVE TO GALLERY</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wallContainer: {
        flex: 1,
    },
    wallHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 16,
    },
    wallSub: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 2,
    },
    wallTitle: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    wallCreateBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    wallCreateBtnText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 1,
    },
    wallGrid: {
        padding: 16,
    },
    wallRow: {
        justifyContent: 'space-between',
    },
    wallItem: {
        width: width / 2 - 24,
        height: 240,
        marginBottom: 16,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
    wallThumb: {
        width: '100%',
        height: '100%',
    },
    wallOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    wallVerseShort: {
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 16,
    },
    previewOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    previewContent: {
        width: '100%',
        borderRadius: 32,
        overflow: 'hidden',
    },
    previewImg: {
        width: '100%',
        height: 450,
    },
    previewMeta: {
        padding: 32,
        alignItems: 'center',
    },
    previewVerse: {
        fontSize: 22,
        fontWeight: '900',
        textAlign: 'center',
        lineHeight: 30,
        marginBottom: 32,
    },
    previewBtns: {
        flexDirection: 'row',
        gap: 12,
    },
    pBtn: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pBtnText: {
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 1,
    }
});
