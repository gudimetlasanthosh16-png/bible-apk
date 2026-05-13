export const COLORS = {
    light: {
        background: '#F8F9FA', // Modern ultra-light grey/white
        headerBackground: '#FFFFFF',
        text: '#111827', // Crisp dark gray
        secondaryText: '#6B7280', // Tailwind gray-500
        highlight: '#EEF2FF', // Soft indigo highlight
        accent: '#4F46E5', // Vibrant Indigo
        card: '#FFFFFF',
        border: '#E5E7EB', // Soft border
        verseNumber: '#4F46E5', 
        shadow: 'rgba(79, 70, 229, 0.15)',
        headerTitle: '#111827',
        gradientStart: '#4F46E5',
        gradientEnd: '#7C3AED',
    },
    dark: {
        background: '#0B0F19', // Deep modern midnight
        headerBackground: '#111827',
        text: '#F9FAFB', 
        secondaryText: '#9CA3AF', 
        highlight: '#1F2937', 
        accent: '#D4AF37', // Premium Royal Gold
        card: '#1F2937',
        border: '#374151',
        verseNumber: '#D4AF37',
        shadow: 'rgba(0, 0, 0, 0.6)',
        headerTitle: '#D4AF37',
        gradientStart: '#111827',
        gradientEnd: '#0B0F19',
    }
};

export const SHADOWS = {
    light: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
    },
    dark: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
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
    sm: 10,
    md: 18,
    lg: 28,
    full: 9999,
};

/* 
 * Design System Notes:
 * - Premium aesthetics inspired by modern iOS and glassmorphism.
 * - Deep dark mode with gold accents for a sacred feel.
 * - Light mode with crisp vibrant indigo for a highly readable, modern feel.
 */
