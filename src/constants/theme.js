export const COLORS = {
    light: {
        background: '#FFFBFA', // Soft ivory/white
        headerBackground: '#FFFFFF',
        text: '#2C1810', // Deep warm charcoal
        secondaryText: '#5D4037', // Darker for better contrast (was #7A6B65)
        highlight: '#FFF9E6', // Very soft gold highlight
        accent: '#D4AF37', // Premium Gold
        card: '#FFFFFF',
        border: '#F1E9E6',
        verseNumber: '#A08020', // Aged gold
        shadow: 'rgba(212, 175, 55, 0.1)',
        headerTitle: '#2C1810',
    },
    dark: {
        background: '#0F0F0F', // Midnight
        headerBackground: '#1A1A1A',
        text: '#F5F5DC', // Creamy white
        secondaryText: '#C1B4AC', // Lighter for better contrast in dark mode (was #A09990)
        highlight: '#2A261F', // Deep warm highlight
        accent: '#FFD700', // Bright Gold
        card: '#1A1A1A',
        border: '#2C2621',
        verseNumber: '#D4AF37',
        shadow: 'rgba(0, 0, 0, 0.5)',
        headerTitle: '#FFD700',
    }
};

export const SHADOWS = {
    light: {
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    dark: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    }
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const BORDER_RADIUS = {
    sm: 8,
    md: 16,
    lg: 24,
    full: 9999,
};

/* 
 * Design System Notes:
 * - Font Family: System Default (San Francisco on iOS, Roboto on Android) for native feel.
 * - Corner Radius: 12px for cards/buttons (modern rounded look).
 * - Spacing: 16px (1rem equiv) for standard padding.
 * - Shadow: Soft, diffuse shadows for depth (iOS) / Elevation for Android.
 */
