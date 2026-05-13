import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';
const GITHUB_API_URL = 'https://api.github.com/repos/gudimetlasanthosh16-png/bible-apk/releases/latest';
const CURRENT_APP_VERSION = '2.1.0'; // Hardcoded fallback match for app.json
let hasShownUpdateThisSession = false;

export const checkForUpdates = async () => {
    if (hasShownUpdateThisSession) return null;

    try {
        // Add cache buster timestamp to GitHub API call
        const response = await fetch(`${GITHUB_API_URL}?t=${Date.now()}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Bible-App-Update-Checker'
            }
        });
        
        if (!response.ok) {
            console.log("GitHub API returned non-OK status:", response.status);
            return null;
        }
        
        const data = await response.json();
        
        if (!data || !data.tag_name) return null;
        
        // GitHub uses tags like 'v2.1.1'
        const latestVersion = data.tag_name.replace('v', '').replace('V', '');
        
        // Use Constants but fallback to our hardcoded current version
        const currentVersion = Constants.expoConfig?.version || Constants.manifest?.version || CURRENT_APP_VERSION;

        console.log(`Update Logic: Client(${currentVersion}) vs Server(${latestVersion})`);

        if (isVersionHigher(latestVersion, currentVersion)) {
            hasShownUpdateThisSession = true;
            
            // Find APK asset in the release if present, otherwise use the release page URL
            const apkAsset = data.assets?.find(a => a.name.toLowerCase().endsWith('.apk'));
            
            return {
                latestVersion,
                message: data.body || "A new sacred update is available with improvements.",
                updateUrl: apkAsset ? apkAsset.browser_download_url : data.html_url
            };
        }
        return null;
    } catch (error) {
        console.warn("Auto-update check failed:", error);
        return null;
    }
};

/**
 * Simple version comparison
 * 2.1.1 > 2.1.0
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
