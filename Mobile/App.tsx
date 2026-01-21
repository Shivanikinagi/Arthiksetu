import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar, Dimensions, Modal, Alert, TextInput, Animated, Easing } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Menu, Search, Bell, Grid, FileText, Lock, ScanFace,
    MessageSquare, HelpCircle, User, LogOut, ChevronRight,
    Zap, Shield, BarChart2, Loader2, RefreshCw
} from 'lucide-react-native';

import { CyberTheme } from './constants/CyberTheme';

// Import Screens
import VerifyScreen from './screens/VerifyScreen';
import SchemesScreen from './screens/SchemesScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import ProfileScreen from './screens/ProfileScreen';
import SMSAnalyzerScreen from './screens/SMSAnalyzerScreen';
import DecoderScreen from './screens/DecoderScreen';
import TaxScreen from './screens/TaxScreen';
import ReportsScreen from './screens/ReportsScreen';
import UnifiedScreen from './screens/UnifiedScreen';
import { EarningsService } from './services/EarningsService';

// Page Types
type PageType = 'dashboard' | 'verify' | 'sms_analyzer' | 'decoder' | 'schemes' | 'tax' | 'reports' | 'chatbot' | 'unified' | 'profile';

export default function App() {
    const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Earnings Animation State
    const [isLoadingEarnings, setIsLoadingEarnings] = useState(true);
    const [displayEarnings, setDisplayEarnings] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(42600); // Default to 42600

    // Animation Values
    const spinValue = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        // 1. Start Spinning Animation
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // 2. Fetch Real Earnings
        const fetchEarnings = async () => {
            const real = await EarningsService.calculateMonthlyEarnings();
            if (real > 0) setTotalEarnings(real);

            // Delay for dramatic effect
            setTimeout(() => {
                setIsLoadingEarnings(false);
                startNumberReveal(real > 0 ? real : 42600);
            }, 2500);
        };
        fetchEarnings();

    }, []);

    const startNumberReveal = (finalValue: number) => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            })
        ]).start();

        let start = 0;
        const duration = 1000;
        const startTime = Date.now();

        const animateCounter = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const currentVal = Math.floor(easeOut * finalValue);
            setDisplayEarnings(currentVal);

            if (progress < 1) {
                requestAnimationFrame(animateCounter);
            }
        };
        animateCounter();
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const navigateTo = (page: PageType) => {
        setCurrentPage(page);
        setIsSidebarOpen(false);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['top', 'left', 'right']} style={styles.mainContainer}>
                <StatusBar barStyle="light-content" backgroundColor={CyberTheme.colors.background} />

                {/* --- HEADER --- */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.menuBtn}>
                            <Grid color={CyberTheme.colors.primary} size={28} />
                        </TouchableOpacity>
                        <Text style={styles.appName}>ArthikSetu</Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn} onPress={() => navigateTo('profile')}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>RS</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* --- MAIN CONTENT --- */}
                <View style={styles.contentContainer}>
                    {currentPage === 'dashboard' ? (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                            {/* 1. EARNINGS DISPLAY */}
                            <View style={styles.earningsSection}>
                                <Text style={styles.earningsLabel}>TOTAL MONTHLY EARNINGS</Text>

                                <View style={styles.earningsContent}>
                                    {isLoadingEarnings ? (
                                        <View style={styles.loadingContainer}>
                                            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                                <RefreshCw size={40} color={CyberTheme.colors.secondary} />
                                            </Animated.View>
                                            <Text style={styles.calculatingText}>Calculating...</Text>
                                        </View>
                                    ) : (
                                        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
                                            <Text style={styles.earningsValue}>
                                                ₹{displayEarnings.toLocaleString('en-IN')}
                                            </Text>
                                        </Animated.View>
                                    )}
                                </View>
                            </View>

                            {/* 2. SEARCH / ACTION BAR */}
                            <TouchableOpacity style={styles.searchBar} activeOpacity={0.8} onPress={() => navigateTo('verify')}>
                                <Search size={20} color={CyberTheme.colors.textDim} />
                                <Text style={styles.searchText}>Upload Document for Verification...</Text>
                                <View style={styles.micIcon}>
                                    <View style={styles.micDot} />
                                </View>
                            </TouchableOpacity>

                            {/* 3. NEON GRID MENU - Compact Layout */}
                            <View style={styles.gridMenu}>
                                <NeonCard label="Analyzer" icon={BarChart2} color={CyberTheme.colors.secondary} onPress={() => navigateTo('sms_analyzer')} />
                                <NeonCard label="Decoder" icon={FileText} color={CyberTheme.colors.primary} onPress={() => navigateTo('decoder')} />
                                <NeonCard label="Schemes" icon={Lock} color={CyberTheme.colors.accent} onPress={() => navigateTo('schemes')} />

                                <NeonCard label="Loan Offers" icon={Zap} color={CyberTheme.colors.secondary} onPress={() => navigateTo('schemes')} dimmed />
                                <NeonCard label="Verify" icon={Shield} color={CyberTheme.colors.success} onPress={() => navigateTo('verify')} />
                                <NeonCard label="Chatbot" icon={MessageSquare} color={CyberTheme.colors.textSecondary} onPress={() => navigateTo('chatbot')} dimmed />
                            </View>

                            {/* 4. SMS FOOTPRINT / STATS */}
                            <View style={styles.statsSection}>
                                <View style={styles.statsHeader}>
                                    <Text style={styles.statsTitle}>SMS Footprints</Text>
                                    <TouchableOpacity onPress={() => navigateTo('sms_analyzer')}>
                                        <Text style={styles.viewAll}>View All</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity onPress={() => navigateTo('sms_analyzer')} activeOpacity={0.8}>
                                    <View style={styles.statCard}>
                                        <View style={[styles.statIcon, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                                            <Shield size={24} color={CyberTheme.colors.primary} />
                                        </View>
                                        <View style={styles.statInfo}>
                                            <Text style={styles.statLabel}>Verified Sources: 4</Text>
                                            <Text style={styles.statSub}>Swiggy, Zomato, Uber...</Text>
                                        </View>
                                        <BarChart2 size={24} color={CyberTheme.colors.success} />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigateTo('schemes')} activeOpacity={0.8}>
                                    <View style={styles.statCard}>
                                        <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                                            <Zap size={24} color="#F59E0B" />
                                        </View>
                                        <View style={styles.statInfo}>
                                            <Text style={styles.statLabel}>Notifications</Text>
                                            <Text style={styles.statSub}>2 New Schemes Available</Text>
                                        </View>
                                        <Text style={[styles.percentText, { color: '#F59E0B' }]}>+2</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </ScrollView>
                    ) : (
                        // If not dashboard, render page container
                        <View style={styles.pageWrapper}>
                            {/* Back Button for sub-pages */}
                            <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentPage('dashboard')}>
                                <Text style={styles.backText}>← Back to Dashboard</Text>
                            </TouchableOpacity>

                            {/* Render Sub-Screen */}
                            <View style={{ flex: 1 }}>
                                {currentPage === 'verify' && <VerifyScreen />}
                                {currentPage === 'schemes' && <SchemesScreen earnings={totalEarnings} />}
                                {currentPage === 'chatbot' && <ChatbotScreen />}
                                {currentPage === 'profile' && <ProfileScreen />}
                                {currentPage === 'sms_analyzer' && <SMSAnalyzerScreen />}
                                {currentPage === 'decoder' && <DecoderScreen />}
                                {currentPage === 'tax' && <TaxScreen />}
                                {currentPage === 'reports' && <ReportsScreen />}
                                {currentPage === 'unified' && <UnifiedScreen />}
                            </View>
                        </View>
                    )}
                </View>

                {/* --- SIDEBAR MODAL --- */}
                <Sidebar visible={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={navigateTo} />

            </SafeAreaView>
        </SafeAreaProvider>
    );
}

// --- COMPONENTS ---

const NeonCard = ({ label, icon: Icon, color, onPress, dimmed }: any) => (
    <TouchableOpacity
        style={[styles.neonCard, dimmed && { opacity: 0.8 }]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <LinearGradient
            colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
            style={styles.neonCardGradient}
        >
            <View style={[styles.iconBox, { borderColor: color, shadowColor: color }]}>
                {/* Reduced Icon Size to 26 */}
                <Icon size={26} color={color} style={{ opacity: 1 }} />
            </View>
            <Text style={[styles.cardLabel, { color: 'white' }]}>{label}</Text>

            <View style={[styles.glowLine, { backgroundColor: color }]} />
        </LinearGradient>
    </TouchableOpacity>
);

const Sidebar = ({ visible, onClose, onNavigate }: any) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} />
            <LinearGradient
                colors={[CyberTheme.colors.surface, CyberTheme.colors.background]}
                style={styles.drawer}
            >
                <View style={styles.drawerHeader}>
                    <Text style={styles.drawerTitle}>Arthik<Text style={{ color: CyberTheme.colors.secondary }}>Setu</Text></Text>
                </View>

                <ScrollView style={styles.drawerBody}>
                    <DrawerItem label="Dashboard" icon={Grid} onPress={() => onNavigate('dashboard')} active />
                    <DrawerItem label="SMS Analyzer" icon={BarChart2} onPress={() => onNavigate('sms_analyzer')} />
                    <DrawerItem label="Unified View" icon={FileText} onPress={() => onNavigate('unified')} />
                    <DrawerItem label="Verify Docs" icon={Shield} onPress={() => onNavigate('verify')} />
                    <DrawerItem label="Schemes" icon={Lock} onPress={() => onNavigate('schemes')} />
                    <DrawerItem label="Profile" icon={User} onPress={() => onNavigate('profile')} />
                </ScrollView>

                <TouchableOpacity style={styles.logoutBtn} onPress={onClose}>
                    <LogOut size={20} color={CyberTheme.colors.accent} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    </Modal>
);

const DrawerItem = ({ label, icon: Icon, onPress, active }: any) => (
    <TouchableOpacity style={[styles.drawerItem, active && styles.drawerItemActive]} onPress={onPress}>
        <Icon size={24} color={active ? CyberTheme.colors.secondary : CyberTheme.colors.textSecondary} />
        <Text style={[styles.drawerItemText, active && styles.drawerItemTextActive]}>{label}</Text>
        {active && <View style={styles.activeDot} />}
    </TouchableOpacity>
);

// --- STYLES ---

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: CyberTheme.colors.background },

    // Header
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 24 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    menuBtn: { padding: 4 },
    appName: { fontSize: 22, fontWeight: 'bold', color: 'white', letterSpacing: 1 },
    profileBtn: {},
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: CyberTheme.colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CyberTheme.colors.primary },
    avatarText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

    contentContainer: { flex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },

    // Earnings
    earningsSection: { marginBottom: 32, marginTop: 10, minHeight: 80 },
    earningsLabel: { fontSize: 13, color: CyberTheme.colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' },
    earningsContent: { flexDirection: 'row', alignItems: 'center' },
    earningsValue: { fontSize: 48, fontWeight: 'bold', color: 'white', letterSpacing: -1 },

    // Loading State
    loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    calculatingText: { color: CyberTheme.colors.secondary, fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },

    // Search Bar
    searchBar: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: CyberTheme.colors.surface,
        paddingHorizontal: 20, paddingVertical: 18, borderRadius: 20, marginBottom: 32,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)'
    },
    searchText: { flex: 1, marginLeft: 16, color: 'white', fontSize: 15, fontWeight: '500' },
    micIcon: { padding: 4 },
    micDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: CyberTheme.colors.secondary },

    // Grid Menu - UPDATED for tighter spacing
    gridMenu: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 32 }, // Reduced gap from 16 to 10
    neonCard: { width: '31%', aspectRatio: 1, borderRadius: 22, overflow: 'hidden' }, // Slightly rounded, keeps width to fit 3 in row
    neonCardGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: CyberTheme.colors.surface, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    iconBox: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, marginBottom: 8, borderWidth: 0 },
    cardLabel: { fontSize: 12, fontWeight: '600', color: 'white', letterSpacing: 0.3 }, // Slightly smaller font
    glowLine: { position: 'absolute', bottom: 0, width: '40%', height: 3, borderRadius: 2, opacity: 1, shadowRadius: 8 },

    // Stats
    statsSection: {},
    statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    statsTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    viewAll: { color: CyberTheme.colors.textDim, fontSize: 13, fontWeight: '600' },

    statCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: CyberTheme.colors.surface, padding: 20, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    statIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    statInfo: { flex: 1 },
    statLabel: { color: 'white', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
    statSub: { color: CyberTheme.colors.textDim, fontSize: 13 },
    percentText: { fontSize: 14, fontWeight: 'bold' },

    // Page Wrapper
    pageWrapper: { flex: 1, backgroundColor: CyberTheme.colors.background },
    backBtn: { padding: 16, backgroundColor: CyberTheme.colors.surface, marginBottom: 2 },
    backText: { color: CyberTheme.colors.textSecondary, fontSize: 14, fontWeight: 'bold' },

    // Drawer
    modalOverlay: { flex: 1, flexDirection: 'row' },
    modalBackdrop: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)' },
    drawer: { width: '80%', height: '100%', paddingVertical: 50, paddingHorizontal: 28, borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)' },
    drawerHeader: { marginBottom: 40 },
    drawerTitle: { fontSize: 26, fontWeight: 'bold', color: 'white' },
    drawerBody: { flex: 1 },
    drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
    drawerItemActive: { backgroundColor: 'rgba(139, 92, 246, 0.15)', borderRadius: 16, paddingHorizontal: 16, borderBottomWidth: 0 },
    drawerItemText: { color: CyberTheme.colors.textSecondary, marginLeft: 16, fontSize: 16, fontWeight: '500' },
    drawerItemTextActive: { color: CyberTheme.colors.secondary, fontWeight: 'bold' },
    activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: CyberTheme.colors.secondary, marginLeft: 'auto' },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
    logoutText: { color: CyberTheme.colors.accent, marginLeft: 12, fontWeight: 'bold', fontSize: 16 }

});
