import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';
const UPDATE_CONFIG_URL = 'https://raw.githubusercontent.com/gudimetlasanthosh16-png/bible-apk/refs/heads/main/update.json';
let hasShownUpdateThisSession = false;

export const checkForUpdates = async () => {
    if (hasShownUpdateThisSession) return null;

    try {
        const response = await fetch(UPDATE_CONFIG_URL + '?t=' + Date.now());
        const data = await response.json();

        // Get current version from app.json / Constants
        const currentVersion = Constants.expoConfig?.version || Constants.manifest?.version || '1.0.1';

        console.log(`Checking version: App(${currentVersion}) vs Server(${data.latestVersion})`);

        if (isVersionHigher(data.latestVersion, currentVersion)) {
            hasShownUpdateThisSession = true;
            return data;
        }
        return null;
    } catch (error) {
        return null;
    }
};

/**
 * Simple version comparison
 * 1.0.1 > 1.0.0
 */
function isVersionHigher(latest, current) {
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number);

    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
        const latestPart = latestParts[i] || 0;
        const currentPart = currentParts[i] || 0;
        if (latestPart > currentPart) return true;
        if (latestPart < currentPart) return false;
    }
    return false;
}
