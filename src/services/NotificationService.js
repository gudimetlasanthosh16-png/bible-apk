import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications should be handled when the app is running
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const requestNotificationPermissions = async () => {
    if (!Device.isDevice) return false;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') return false;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-bread', {
            name: 'Daily Bread',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#D4AF37',
        });

        await Notifications.setNotificationChannelAsync('app-updates', {
            name: 'App Updates',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 500, 250, 500],
            lightColor: '#D4AF37',
        });
    }

    return true;
};

export const scheduleDailyNotifications = async () => {
    // Clear existing to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule 5:00 AM Notification
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🌅 Daily Bread",
            body: "Your morning blessing is ready. Click to read today's word.",
            data: { screen: 'DailyBread', id: Math.floor(Math.random() * 3 + 1).toString() },
            categoryIdentifier: 'daily-bread',
        },
        trigger: {
            hour: 5,
            minute: 0,
            repeats: true,
        },
    });

    // Schedule 6:00 PM Notification
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🌙 Evening Blessing",
            body: "Take a moment with God before the day ends. Read your daily bread.",
            data: { screen: 'DailyBread', id: Math.floor(Math.random() * 3 + 1).toString() },
            categoryIdentifier: 'daily-bread',
        },
        trigger: {
            hour: 18,
            minute: 0,
            repeats: true,
        },
    });

    console.log("Daily notifications scheduled for 5 AM and 6 PM");
};

export const showUpdateNotification = async (version) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "✨ Sacred Update Available",
            body: `Version v${version} is now ready for your spiritual journey. Click to download the latest edition.`,
            data: { screen: 'Update', version }, // In-app handling can use this data
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            channelId: 'app-updates',
        },
        trigger: null, // Display immediately
    });
};
