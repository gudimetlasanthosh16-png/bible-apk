import React, { useContext, useEffect } from 'react';
import AppNavigator, { navigationRef } from './src/navigation/AppNavigator';
import { BibleProvider, BibleContext } from './src/context/BibleContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Image, Text } from 'react-native';
import DailyWordModal from './src/components/DailyWordModal';
import UpdateModal from './src/components/UpdateModal';
import * as Notifications from 'expo-notifications';
import { requestNotificationPermissions, scheduleDailyNotifications } from './src/services/NotificationService';

function AppContent() {
  const { loading } = useContext(BibleContext);

  useEffect(() => {
    async function setupNotifications() {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleDailyNotifications();
      }
    }
    setupNotifications();

    // Listener for notification clicks
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { screen, id } = response.notification.request.content.data;
      if (screen && navigationRef.isReady()) {
        navigationRef.navigate(screen, { id });
      }
    });

    return () => subscription.remove();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style="dark" />

        {/* Divine Gold Telugu Title - Top */}
        <View style={{ position: 'absolute', top: '18%', alignItems: 'center' }}>
          <Text style={{
            fontSize: 42,
            fontWeight: '900',
            color: '#D4AF37',
            textAlign: 'center',
            textShadowColor: 'rgba(212, 175, 55, 0.2)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4
          }}>
            పరిశుద్ధ గ్రంథం
          </Text>
          <View style={{ width: 100, height: 3, backgroundColor: '#D4AF37', marginTop: 15, borderRadius: 2 }} />
        </View>

        {/* Sacred Logo - Plain Centered */}
        <Image
          source={require('./assets/holy_bible_logo.jpg')}
          style={{ width: 240, height: 240 }}
          resizeMode="contain"
        />

        {/* Bottom Branding */}
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={{
            marginTop: 20,
            color: '#D4AF37',
            fontWeight: '900',
            letterSpacing: 6,
            fontSize: 18,
            textTransform: 'uppercase'
          }}>
            Holy Bible
          </Text>
        </View>

        {/* Minimalist Footer */}
        <View style={{ position: 'absolute', bottom: 40 }}>
          <Text style={{ fontSize: 11, color: '#A0A0A0', fontWeight: 'bold', letterSpacing: 2 }}>
            SACRED EDITION
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <DailyWordModal />
      <UpdateModal />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <BibleProvider>
        <AppContent />
      </BibleProvider>
    </SafeAreaProvider>
  );
}
