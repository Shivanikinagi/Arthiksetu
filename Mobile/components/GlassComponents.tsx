import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, TextInputProps } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
    children: React.ReactNode;
    style?: any;
    intensity?: number;
    onPress?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20, onPress }) => {
    const Container = onPress ? TouchableOpacity : View;
    return (
        <Container onPress={onPress} activeOpacity={0.8} style={[styles.cardContainer, style]}>
            <BlurView intensity={intensity} tint="dark" style={styles.cardBlur}>
                {children}
            </BlurView>
        </Container>
    );
};

interface GlassButtonProps {
    title: string;
    onPress: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    style?: any;
    disabled?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ title, onPress, icon, variant = 'primary', style, disabled }) => {
    const getBgColor = () => {
        if (variant === 'danger') return 'rgba(248, 113, 113, 0.2)';
        if (variant === 'secondary') return 'rgba(255, 255, 255, 0.1)';
        return 'rgba(6, 182, 212, 0.2)'; // Cyan defaults
    };

    const getBorderColor = () => {
        if (variant === 'danger') return '#f87171';
        if (variant === 'secondary') return 'rgba(255,255,255,0.2)';
        return '#22d3ee';
    };

    const getTextColor = () => {
        if (variant === 'danger') return '#fca5a5';
        if (variant === 'secondary') return 'white';
        return '#67e8f9';
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.button,
                { backgroundColor: getBgColor(), borderColor: getBorderColor(), opacity: disabled ? 0.5 : 1 },
                style
            ]}
        >
            {icon}
            <Text style={[styles.buttonText, { color: getTextColor() }]}>{title}</Text>
        </TouchableOpacity>
    );
};

export const GlassInput: React.FC<TextInputProps & { icon?: React.ReactNode }> = ({ icon, style, ...props }) => {
    return (
        <BlurView intensity={10} tint="dark" style={[styles.inputContainer, style]}>
            {icon && <View style={styles.inputIcon}>{icon}</View>}
            <TextInput
                placeholderTextColor="#64748b"
                style={styles.input}
                {...props}
            />
        </BlurView>
    );
};

export const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
);

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 16,
    },
    cardBlur: {
        padding: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 1,
        gap: 8,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    inputIcon: {
        paddingLeft: 16,
    },
    input: {
        flex: 1,
        color: 'white',
        padding: 16,
        fontSize: 15,
    },
    sectionTitle: {
        color: '#22d3ee',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginTop: 8,
    }
});
