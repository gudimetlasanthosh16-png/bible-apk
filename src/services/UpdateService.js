import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';

// Replace this with your actual JSON file URL (e.g., GitHub Gist, Firebase Storage, or your website)
// Example JSON content: { "latestVersion": "1.0.1", "updateUrl": "https://example.com/bible.apk", "message": "New features: Background music, more stories!" }
const UPDATE_CONFIG_URL = 'https://raw.githubusercontent.com/your-username/your-repo/main/update.json';

export const checkForUpdates = async () => {
    try {
        const response = await fetch(UPDATE_CONFIG_URL);
        const data = await response.json();

        // Get current version from app.json / Constants
        const currentVersion = Constants.expoConfig?.version || '1.0.0';

        if (isVersionHigher(data.latestVersion, currentVersion)) {
            return data;
        }
        return null;
    } catch (error) {
        console.warn("Update check skipped (likely offline or host down)");
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
