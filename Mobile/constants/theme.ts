export const theme = {
    colors: {
        // Brand Identity
        primary: '#1e3a5f',       // Deep Blue (Web Header)
        primaryDark: '#0A1F44',   // Darker Blue (Gradients)
        accent: '#ff8c42',        // Bright Orange (CTA)
        accentGradientStruct: ['#c2410c', '#ea580c', '#f97316'], // Orange Gradient

        // Semantic Colors
        success: '#10B981',       // Green-500
        danger: '#EF4444',        // Red-500
        warning: '#F59E0B',       // Amber-500
        info: '#3B82F6',          // Blue-500

        // Backgrounds
        background: '#f8fafc',    // Slate-50
        surface: '#ffffff',
        surfaceHighlight: '#eff6ff', // Blue-50

        // Text
        textPrimary: '#0f172a',   // Slate-900
        textSecondary: '#64748b', // Slate-500
        textLight: '#ffffff',

        // Borders
        border: '#e2e8f0',        // Slate-200
    },
    shadows: {
        small: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 2,
        },
        medium: {
            shadowColor: "#1e3a5f",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        },
        large: {
            shadowColor: "#1e3a5f",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
        }
    },
    layout: {
        radius: 16,
        padding: 20,
        headerHeight: 180,
    }
};
