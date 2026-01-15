import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar, Dimensions, Modal, Alert, Animated, Easing, Platform } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
    Menu, Upload, TrendingUp, ScanFace,
    FileText, Lock, Bot, Calculator, ScrollText,
    LayoutDashboard, User, X, LogOut, Home, MessageSquare, ChevronRight, CheckCircle2
} from 'lucide-react-native';

// Import Screens (Make sure these export default or named correctly)
import VerifyScreen from './screens/VerifyScreen';
import SchemesScreen from './screens/SchemesScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import ProfileScreen from './screens/ProfileScreen';
import SMSAnalyzerScreen from './screens/SMSAnalyzerScreen';
import DecoderScreen from './screens/DecoderScreen';
import TaxScreen from './screens/TaxScreen';
import ReportsScreen from './screens/ReportsScreen';
import UnifiedScreen from './screens/UnifiedScreen';
import api from './api';

const { width, height } = Dimensions.get('window');

// List of all available "pages"
type PageType = 'dashboard' | 'verify' | 'sms_analyzer' | 'decoder' | 'schemes' | 'tax' | 'reports' | 'chatbot' | 'unified' | 'profile';


// Mock Data Removed - Using Real API


export default function App() {
    const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Animation Values
    const spinValue = useRef(new Animated.Value(0)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;

    // Total Earnings Animation (Count Up Sim)
    const [transactions, setTransactions] = useState<any[]>([]);
    const [targetEarnings, setTargetEarnings] = useState(0);
    const [displayEarnings, setDisplayEarnings] = useState(0);

    useEffect(() => {
        // 1. Start Animations
        Animated.loop(
            Animated.timing(spinValue, { toValue: 1, duration: 15000, easing: Easing.linear, useNativeDriver: true })
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseValue, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulseValue, { toValue: 1, duration: 2000, useNativeDriver: true })
            ])
        ).start();

        // 2. Fetch Real Data
        const fetchData = async () => {
            try {
                const data = await api.dashboard();
                if (data.status === 'success') {
                    setTargetEarnings(data.summary.total_earnings || 0);
                    const mapped = data.recent_entries.map((e: any) => ({
                        id: e.id,
                        name: e.platform,
                        amount: e.amount,
                        date: new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                        verified: true,
                        type: 'credit'
                    }));
                    setTransactions(mapped);
                }
            } catch (e) {
                // Offline Mode
                console.log("Offline mode, using mocks");
                setTargetEarnings(73520);
                setTransactions([
                    { id: 1, name: 'Swiggy', amount: 1250, date: 'Today, 2:30 PM', verified: true, type: 'credit' },
                    { id: 2, name: 'Zomato', amount: 840, date: 'Yesterday, 6:15 PM', verified: true, type: 'credit' },
                ]);
            }
        };
        fetchData();
    }, []);

    // 3. Count Up Effect when targetEarnings changes
    useEffect(() => {
        if (targetEarnings === 0) return;
        let start = 0;
        const duration = 2000;
        const steps = 60;
        const increment = targetEarnings / steps;
        const interval = setInterval(() => {
            start += increment;
            if (start >= targetEarnings) {
                setDisplayEarnings(targetEarnings);
                clearInterval(interval);
            } else {
                setDisplayEarnings(Math.floor(start));
            }
        }, duration / steps);
        return () => clearInterval(interval);
    }, [targetEarnings]);


    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const reverseSpin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['360deg', '0deg']
    });

    const navigateTo = (page: PageType) => {
        setCurrentPage(page);
        setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        setIsSidebarOpen(false);
        Alert.alert("Logged Out", "Redirecting to Login...");
    };

    const renderPage = () => {
        const commonProps = { onBack: () => navigateTo('dashboard') };
        switch (currentPage) {
            case 'verify': return <VerifyScreen {...commonProps} />;
            case 'schemes': return <SchemesScreen {...commonProps} earnings={targetEarnings} />;
            case 'chatbot': return <ChatbotScreen {...commonProps} />;
            case 'profile': return <ProfileScreen {...commonProps} />;
            case 'sms_analyzer': return <SMSAnalyzerScreen {...commonProps} />;
            case 'decoder': return <DecoderScreen {...commonProps} />;
            case 'tax': return <TaxScreen {...commonProps} />;
            case 'reports': return <ReportsScreen {...commonProps} />;
            case 'unified': return <UnifiedScreen {...commonProps} />;
            default: return null;
        }
    };

    return (
        <SafeAreaProvider>
            {currentPage !== 'dashboard' ? (
                /* Render Sub-Page Full Screen (It handles its own layout) */
                <View style={{ flex: 1, backgroundColor: '#020617' }}>
                    {renderPage()}
                </View>
            ) : (
                /* Dashboard Layout */
                <LinearGradient
                    colors={['#020617', '#0A1F44', '#111827']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.container}
                >
                    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

                    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>

                        {/* --- HEADER --- */}
                        <BlurView intensity={20} tint="dark" style={styles.glassHeader}>
                            <View style={styles.headerContent}>
                                <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.iconBtn}>
                                    <Menu color="#22d3ee" size={24} />
                                </TouchableOpacity>
                                <View>
                                    <Text style={styles.headerTitle}>ARTHIK SETU</Text>
                                    <Text style={styles.headerSubtitle}>GIG ECONOMY AI</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigateTo('profile')} style={styles.avatarContainer}>
                                    <LinearGradient colors={['#06b6d4', '#2563eb']} style={styles.avatarGradient}>
                                        <Text style={styles.avatarText}>RS</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </BlurView>

                        {/* --- MAIN CONTENT --- */}
                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                            {/* Greeting */}
                            <View style={styles.greetingSection}>
                                <Text style={styles.dateText}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
                                <Text style={styles.greetingText}>Hello, <Text style={styles.nameHighlight}>Rahul</Text></Text>
                            </View>

                            {/* HOLOGRAPHIC RING HERO */}
                            <View style={styles.heroSection}>
                                <View style={styles.ringContainer}>
                                    {/* Outer Rotating Ring */}
                                    <Animated.View style={[styles.ringOuter, { transform: [{ rotate: spin }] }]}>
                                        <View style={styles.ringKnob} />
                                    </Animated.View>

                                    {/* Inner Reverse Ring */}
                                    <Animated.View style={[styles.ringInner, { transform: [{ rotate: reverseSpin }] }]} />

                                    {/* Central Core */}
                                    <BlurView intensity={40} tint="dark" style={styles.coreGlass}>
                                        <Text style={styles.earningsLabel}>TOTAL EARNINGS</Text>
                                        <Text style={styles.earningsValue}>₹{displayEarnings.toLocaleString('en-IN')}</Text>
                                        <View style={styles.growthBadge}>
                                            <TrendingUp size={12} color="#34d399" />
                                            <Text style={styles.growthText}>+12.5%</Text>
                                        </View>
                                    </BlurView>
                                </View>
                            </View>

                            {/* ACTION GRID */}
                            <View style={styles.gridSection}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>AI Tools</Text>
                                    <TouchableOpacity onPress={() => { }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.seeAllText}>Customize</Text>
                                        <ChevronRight size={12} color="#22d3ee" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.grid}>
                                    <GlassCard label="Analyzer" icon={FileText} color="#c084fc" onPress={() => navigateTo('sms_analyzer')} />
                                    <GlassCard label="Decoder" icon={MessageSquare} color="#34d399" onPress={() => navigateTo('decoder')} />
                                    <GlassCard label="Schemes" icon={Lock} color="#fbbf24" onPress={() => navigateTo('schemes')} />
                                    <GlassCard label="Verify" icon={ScanFace} color="#60a5fa" onPress={() => navigateTo('verify')} />
                                    <GlassCard label="Tax" icon={Calculator} color="#f87171" onPress={() => navigateTo('tax')} />
                                    <GlassCard label="Ask AI" icon={Bot} color="#22d3ee" onPress={() => navigateTo('chatbot')} />
                                </View>
                            </View>

                            {/* QUICK UPLOAD CTA */}
                            <TouchableOpacity onPress={() => navigateTo('verify')} activeOpacity={0.9}>
                                <LinearGradient colors={['#06b6d4', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaGradient}>
                                    <View style={styles.ctaContent}>
                                        <View style={styles.ctaIconBox}>
                                            <Upload size={20} color="#22d3ee" />
                                        </View>
                                        <View>
                                            <Text style={styles.ctaTitle}>Quick Verify</Text>
                                            <Text style={styles.ctaDesc}>Upload proof instantly</Text>
                                        </View>
                                        <ChevronRight size={20} color="white" style={{ marginLeft: 'auto' }} />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* LIVE FEED */}
                            <View style={styles.feedSection}>
                                <Text style={styles.sectionTitle}>Live Stream</Text>
                                {transactions.map((tx, idx) => (
                                    <Animated.View key={tx.id} style={[styles.txCardContainer, { opacity: pulseValue }]}>
                                        <BlurView intensity={10} tint="light" style={styles.txCard}>
                                            <View style={styles.txLeft}>
                                                <View style={[styles.txIcon, { backgroundColor: tx.type === 'credit' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)' }]}>
                                                    <Text style={{ color: tx.type === 'credit' ? '#34d399' : '#f87171', fontWeight: 'bold' }}>{tx.name[0]}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.txName}>{tx.name}</Text>
                                                    <Text style={styles.txDate}>{tx.date}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.txRight}>
                                                <Text style={[styles.txAmount, { color: tx.type === 'credit' ? '#34d399' : 'white' }]}>
                                                    {tx.type === 'credit' ? '+' : '-'}₹{Math.abs(tx.amount)}
                                                </Text>
                                                {tx.verified && (
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                                        <CheckCircle2 size={10} color="#22d3ee" />
                                                        <Text style={styles.verifiedText}>Verified</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </BlurView>
                                    </Animated.View>
                                ))}
                            </View>

                            <View style={{ height: 100 }} />
                        </ScrollView>

                        {/* --- BOTTOM DOCK --- */}
                        <BlurView intensity={30} tint="dark" style={styles.dock}>
                            <DockItem icon={Home} label="Home" active={true} onPress={() => navigateTo('dashboard')} />
                            <DockItem icon={LayoutDashboard} label="Services" active={false} onPress={() => navigateTo('unified')} />
                            <DockItem icon={User} label="Profile" active={false} onPress={() => navigateTo('profile')} />
                        </BlurView>

                    </SafeAreaView>

                    {/* --- SIDEBAR --- */}
                    <Sidebar
                        visible={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        onNavigate={navigateTo}
                        current={currentPage}
                        onLogout={handleLogout}
                    />
                </LinearGradient>
            )}
        </SafeAreaProvider>
    );
}

// --- SUB COMPONENTS ---

const GlassCard = ({ label, icon: Icon, color, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={{ width: '31%', marginBottom: 12 }}>
        <BlurView intensity={10} tint="light" style={styles.glassCard}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                <Icon size={24} color={color} />
            </View>
            <Text style={styles.glassCardLabel}>{label}</Text>
        </BlurView>
    </TouchableOpacity>
);

const DockItem = ({ icon: Icon, label, active, onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.dockItem}>
        <View style={[styles.dockIconBox, active && { backgroundColor: 'rgba(34, 211, 238, 0.15)' }]}>
            <Icon size={24} color={active ? '#22d3ee' : '#94a3b8'} strokeWidth={active ? 2.5 : 2} />
        </View>
        <Text style={[styles.dockLabel, active && { color: '#22d3ee' }]}>{label}</Text>
    </TouchableOpacity>
);

const Sidebar = ({ visible, onClose, onNavigate, current, onLogout }: any) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <TouchableOpacity style={{ position: 'absolute', inset: 0 }} onPress={onClose} />
            <BlurView intensity={40} tint="dark" style={styles.drawerGlass}>
                <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
                    <View style={styles.drawerHeader}>
                        <LinearGradient colors={['#06b6d4', '#2563eb']} style={styles.drawerAvatar}>
                            <Text style={styles.avatarText}>RS</Text>
                        </LinearGradient>
                        <View>
                            <Text style={styles.drawerName}>Rahul Sharma</Text>
                            <TouchableOpacity onPress={() => onNavigate('profile')}>
                                <Text style={styles.drawerLink}>View Profile</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={onClose} style={{ marginLeft: 'auto', padding: 8 }}>
                            <X color="#94a3b8" size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ flex: 1, paddingVertical: 20 }}>
                        <DrawerRow label="Home" icon={Home} page="dashboard" current={current} nav={onNavigate} />
                        <DrawerRow label="Verify" icon={ScanFace} page="verify" current={current} nav={onNavigate} />
                        <DrawerRow label="Analyzer" icon={FileText} page="sms_analyzer" current={current} nav={onNavigate} />
                        <DrawerRow label="Schemes" icon={Lock} page="schemes" current={current} nav={onNavigate} />
                        <DrawerRow label="Tax Smart" icon={Calculator} page="tax" current={current} nav={onNavigate} />
                        <DrawerRow label="Chatbot" icon={Bot} page="chatbot" current={current} nav={onNavigate} />
                    </ScrollView>

                    <View style={styles.drawerFooter}>
                        <TouchableOpacity style={styles.logoutRow} onPress={onLogout}>
                            <LogOut size={20} color="#f87171" />
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>
                        <Text style={styles.versionText}>v2.0 • Holographic Build</Text>
                    </View>
                </SafeAreaView>
            </BlurView>
        </View>
    </Modal>
);

const DrawerRow = ({ label, icon: Icon, page, current, nav }: any) => (
    <TouchableOpacity
        style={[styles.drawerRow, current === page && { backgroundColor: 'rgba(34, 211, 238, 0.1)', borderLeftColor: '#22d3ee' }]}
        onPress={() => nav(page)}
    >
        <Icon size={20} color={current === page ? '#22d3ee' : '#94a3b8'} />
        <Text style={[styles.drawerRowText, current === page && { color: '#22d3ee', fontWeight: 'bold' }]}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    glassHeader: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    iconBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 },
    headerTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
    headerSubtitle: { color: '#22d3ee', fontSize: 10, letterSpacing: 3, textAlign: 'center' },
    avatarContainer: { padding: 2 },
    avatarGradient: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    avatarText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    greetingSection: { marginTop: 20, marginBottom: 20 },
    dateText: { color: '#94a3b8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
    greetingText: { color: 'white', fontSize: 24, fontWeight: '300' },
    nameHighlight: { fontWeight: 'bold', color: '#22d3ee' },

    heroSection: { alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
    ringContainer: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },
    ringOuter: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 1, borderColor: 'rgba(34, 211, 238, 0.3)', borderStyle: 'dashed' },
    ringKnob: { width: 8, height: 8, backgroundColor: '#22d3ee', borderRadius: 4, position: 'absolute', top: 5, left: '50%' },
    ringInner: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 2, borderColor: 'rgba(34, 211, 238, 0.1)', borderStyle: 'dotted' },
    coreGlass: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    earningsLabel: { color: '#22d3ee', fontSize: 10, letterSpacing: 1, marginBottom: 4 },
    earningsValue: { color: 'white', fontSize: 22, fontWeight: 'bold' },
    growthBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(52, 211, 153, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 4 },
    growthText: { color: '#34d399', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { color: 'white', fontSize: 16, fontWeight: '600' },
    seeAllText: { color: '#22d3ee', fontSize: 12, marginRight: 2 },
    gridSection: { marginBottom: 24 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    glassCard: { borderRadius: 20, padding: 16, alignItems: 'center', gap: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', height: 110, justifyContent: 'center' },
    iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    glassCardLabel: { color: '#cbd5e1', fontSize: 12, fontWeight: '500' },

    ctaGradient: { borderRadius: 20, padding: 1, marginBottom: 24 },
    ctaContent: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'rgba(2, 6, 23, 0.6)', borderRadius: 19, gap: 12 },
    ctaIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(34, 211, 238, 0.1)', alignItems: 'center', justifyContent: 'center' },
    ctaTitle: { color: 'white', fontWeight: '600', fontSize: 14 },
    ctaDesc: { color: '#94a3b8', fontSize: 11 },

    feedSection: { marginBottom: 20 },
    txCardContainer: { marginBottom: 10 },
    txCard: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    txLeft: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    txIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    txName: { color: 'white', fontWeight: '500', fontSize: 14 },
    txDate: { color: '#64748b', fontSize: 11 },
    txRight: { alignItems: 'flex-end' },
    txAmount: { fontWeight: 'bold', fontSize: 14 },
    verifiedText: { color: '#22d3ee', fontSize: 10, marginLeft: 2 },

    dock: { position: 'absolute', bottom: 20, left: 20, right: 20, borderRadius: 30, padding: 8, flexDirection: 'row', justifyContent: 'space-around', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    dockItem: { alignItems: 'center', width: 60 },
    dockIconBox: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginBottom: 2 },
    dockLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },

    drawerGlass: { flex: 1, width: '80%', maxWidth: 300, backgroundColor: 'rgba(2, 6, 23, 0.95)' },
    drawerHeader: { padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', alignItems: 'center', gap: 12 },
    drawerAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    drawerName: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    drawerLink: { color: '#22d3ee', fontSize: 12 },
    drawerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingLeft: 24, gap: 16, borderLeftWidth: 3, borderLeftColor: 'transparent' },
    drawerRowText: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },
    drawerFooter: { padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    logoutRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    logoutText: { color: '#f87171', fontWeight: '600', marginLeft: 12 },
    versionText: { color: '#475569', fontSize: 10, textAlign: 'center' },

    pageContainer: { flex: 1, backgroundColor: 'white', margin: 10, borderRadius: 20, overflow: 'hidden' }
});
