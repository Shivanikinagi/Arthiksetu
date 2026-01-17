import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChevronLeft } from 'lucide-react-native';

interface ScreenWrapperProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    scrollable?: boolean;
    floatingAction?: React.ReactNode;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    title,
    subtitle,
    showBack = false,
    onBack,
    scrollable = true,
    floatingAction
}) => {
    const ContentContainer = scrollable ? ScrollView : View;
    const contentProps = scrollable ? {
        contentContainerStyle: { paddingBottom: 100 },
        showsVerticalScrollIndicator: false
    } : { flex: 1 };

    return (
        <LinearGradient
            colors={['#020617', '#0A1F44', '#111827']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>

                {/* Glass Header */}
                <BlurView intensity={20} tint="dark" style={styles.header}>
                    <View style={styles.headerRow}>
                        {showBack && (
                            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                                <ChevronLeft color="#22d3ee" size={24} />
                            </TouchableOpacity>
                        )}
                        <View style={{ flex: 1, marginLeft: showBack ? 12 : 0 }}>
                            <Text style={styles.title}>{title}</Text>
                            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                        </View>
                    </View>
                </BlurView>

                {/* Content */}
                {scrollable ? (
                    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                        {children}
                    </ScrollView>
                ) : (
                    <View style={{ flex: 1, padding: 20 }}>
                        {children}
                    </View>
                )}

                {floatingAction}

            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 2,
    },
});
