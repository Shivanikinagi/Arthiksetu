export const CyberTheme = {
    colors: {
        background: '#0B1121', // Deep Dark Blue/Black
        surface: '#151F32',    // Slightly lighter dark for cards
        surfaceLight: '#1E293B', // For borders/highlights

        // Neon Accents
        primary: '#8B5CF6',    // Electric Purple
        secondary: '#06B6D4',  // Cyan/Electric Blue
        accent: '#D946EF',     // Neon Pink
        success: '#10B981',    // Bright Green

        // Text
        textPrimary: '#FFFFFF',
        textSecondary: '#94A3B8', // Slate-400
        textDim: '#64748B',

        // Gradients
        gradientPrimary: ['#8B5CF6', '#3B82F6'], // Purple to Blue
        gradientAccent: ['#D946EF', '#8B5CF6'],  // Pink to Purple
        gradientCyan: ['#06B6D4', '#3B82F6'],    // Cyan to Blue
        gradientDark: ['#1E293B', '#0F172A'],    // Card Backgrounds
    },
    shadows: {
        neon: {
            shadowColor: '#8B5CF6',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 10,
            elevation: 10,
        },
        soft: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
        }
    },
    borders: {
        neonBorder: {
            borderWidth: 1,
            borderColor: 'rgba(139, 92, 246, 0.5)', // Transparent Purple
        }
    }
};
