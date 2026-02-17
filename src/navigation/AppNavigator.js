import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { BibleContext } from '../context/BibleContext';
import HomeScreen from '../screens/HomeScreen';
import ChapterSelectionScreen from '../screens/ChapterSelectionScreen';
import ReadingScreen from '../screens/ReadingScreen';
import StoryDetailScreen from '../screens/StoryDetailScreen';
import SongDetailScreen from '../screens/SongDetailScreen';
import UserModeScreen from '../screens/UserModeScreen';
import WallpaperScreen from '../screens/WallpaperScreen';
import WallpaperCreatorScreen from '../screens/WallpaperCreatorScreen';
import SearchScreen from '../screens/SearchScreen';
import DailyBreadScreen from '../screens/DailyBreadScreen';
import AIChatScreen from '../screens/AIChatScreen';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

const HeaderRight = ({ navigation, toggleMenu }) => {
    const { language, switchLanguage, theme, toggleTheme, colors } = useContext(BibleContext);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={() => {
                    // This will be handled by the parent component or a global state 
                    // But for now, let's keep it simple. 
                    // Ideally, we'd use a Drawer or a Modal for the menu.
                    // For this implementation, we will pass a callback if needed, 
                    // or just keep the existing toggles and ADD a Menu button if requested.
                    // Since the user asked to REPLACE the dark mode toggle with a menu toggle,
                    // we will modify this. But the user said "beside dark mode toggle", 
                    // actually "Not beside holy bible, there will be dark mode toggle, beside dark mode toggle make 3 bar menu"
                    // So we KEEP dark mode and ADD menu.

                    // However, we can't easily open a "Drawer" without installing @react-navigation/drawer
                    // So we will simulate a menu or just navigate to a "Menu" screen if simple.
                    // Let's stick to the request: "3 bar menu toggle".
                    // We'll implementation an onPress that could open a modal or drawer.
                    // For now, let's just log it or show an alert, OR implement a simple Modal in HomeScreen.

                    if (toggleMenu) toggleMenu();
                }}
                style={[styles.button, { marginRight: 8 }]}
            >
                <Text style={{ fontSize: 24, color: colors.text }}>☰</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={toggleTheme}
                style={[styles.button, { backgroundColor: colors.highlight, marginRight: 8 }]}
            >
                <Text style={{ fontSize: 18 }}>{theme === 'light' ? '🌙' : '☀️'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => switchLanguage(language === 'en' ? 'te' : 'en')}
                style={[styles.button, { backgroundColor: colors.highlight }]}
            >
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.accent }}>
                    {language === 'en' ? 'EN' : 'TE'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const MainStack = () => {
    const { colors, theme } = useContext(BibleContext);

    const screenOptions = {
        headerStyle: {
            backgroundColor: colors.headerBackground,
        },
        headerTintColor: colors.headerTitle,
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerShadowVisible: false,
        contentStyle: {
            backgroundColor: colors.background,
        },
    };

    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: colors.background,
            card: colors.headerBackground,
            text: colors.text,
            border: colors.border,
        },
    };

    return (
        <NavigationContainer ref={navigationRef} theme={theme === 'dark' ? DarkTheme : MyTheme}>
            <Stack.Navigator screenOptions={screenOptions}>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                        title: 'Holy Bible',
                        headerRight: () => (
                            // We need a way to communicate with HomeScreen to open the menu.
                            // Since we can't pass props down easily to the header from the screen without setOptions,
                            // we'll leave the onPress empty here and handle it inside HomeScreen using setOptions
                            null
                        )
                    })}
                />
                <Stack.Screen
                    name="ChapterSelection"
                    component={ChapterSelectionScreen}
                    options={({ route }) => ({ title: route.params.bookName })}
                />
                <Stack.Screen
                    name="Reading"
                    component={ReadingScreen}
                    options={({ route }) => ({ title: `${route.params.bookName} ${route.params.chapterIndex + 1}` })}
                />
                <Stack.Screen
                    name="StoryDetail"
                    component={StoryDetailScreen}
                    options={{ title: 'Children Bible Story' }}
                />
                <Stack.Screen
                    name="SongDetail"
                    component={SongDetailScreen}
                    options={{ title: 'Christian Hymn' }}
                />
                <Stack.Screen
                    name="UserMode"
                    component={UserModeScreen}
                    options={{ title: 'User Mode' }}
                />
                <Stack.Screen
                    name="Wallpaper"
                    component={WallpaperScreen}
                    options={{ title: 'Bible Wallpapers' }}
                />
                <Stack.Screen
                    name="WallpaperCreator"
                    component={WallpaperCreatorScreen}
                    options={{ title: 'Create Wallpaper' }}
                />
                <Stack.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="DailyBread"
                    component={DailyBreadScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AIChat"
                    component={AIChatScreen}
                    options={{ title: 'Divine Assistant' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function AppNavigator() {
    return <MainStack />;
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        borderRadius: 20,
        minWidth: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
