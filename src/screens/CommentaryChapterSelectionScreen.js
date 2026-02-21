import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BibleContext } from '../context/BibleContext';
import { SPACING } from '../constants/theme';

export default function CommentaryChapterSelectionScreen({ route, navigation }) {
    const { book, commentaryId } = route.params;
    const { colors } = useContext(BibleContext);

    const chapters = Array.from({ length: book.numberOfChapters }, (_, i) => i + 1);

    const renderChapter = ({ item }) => (
        <TouchableOpacity
            style={[styles.chapterBox, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('CommentaryDisplay', {
                commentaryId,
                bookId: book.id,
                chapterNumber: item,
                bookName: book.name
            })}
        >
            <Text style={[styles.chapterText, { color: colors.text }]}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>{book.name}</Text>
                <Text style={[styles.sub, { color: colors.secondaryText }]}>Select Chapter</Text>
            </View>
            <FlatList
                data={chapters}
                renderItem={renderChapter}
                keyExtractor={(item) => item.toString()}
                numColumns={5}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
    },
    sub: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 5,
    },
    list: {
        padding: 10,
    },
    chapterBox: {
        width: '18%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: '1%',
        borderRadius: 12,
        borderWidth: 1,
    },
    chapterText: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});
