import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, StatusBar, Dimensions, Modal, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {
    Menu, Upload, CheckCircle, TrendingUp, ScanFace,
    FileText, Lock, Bot, Calculator, ScrollText,
    LayoutDashboard, User, X, LogOut, Home
} from 'lucide-react-native';

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

const { width } = Dimensions.get('window');

// List of all available "pages"
type PageType = 'dashboard' | 'verify' | 'sms_analyzer' | 'decoder' | 'schemes' | 'tax' | 'reports' | 'chatbot' | 'unified' | 'profile';

export default function App() {
    const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const totalEarnings = 73520;

    const navigateTo = (page: PageType) => {
        setCurrentPage(page);
        setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        setIsSidebarOpen(false);
        Alert.alert("Logged Out", "Redirecting to Login...");
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['top', 'left', 'right']} style={styles.mainContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

                {/* --- 1. PREMIUM HEADER CURVE --- */}
                <View style={styles.headerCurve}>
                    <View style={styles.headerTopBar}>
                        <TouchableOpacity onPress={() => setIsSidebarOpen(true)}>
                            <Menu color="white" size={28} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>ARTHIK SETU</Text>
                        <TouchableOpacity onPress={() => navigateTo('profile')}>
                            <View style={styles.headerAvatar}>
                                <Text style={styles.headerAvatarText}>RS</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- 2. MAIN CONTENT LAYER --- */}
                <View style={styles.mainContent}>

                    {/* DASHBOARD */}
                    {currentPage === 'dashboard' && (
                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                            {/* Floating Earnings Card */}
                            <View style={styles.earningsCard}>
                                <View>
                                    <Text style={styles.earningsLabel}>Total Earnings</Text>
                                    <Text style={styles.earningsValue}>₹{totalEarnings.toLocaleString('en-IN')}</Text>
                                    <View style={styles.growthTag}>
                                        <TrendingUp size={12} color="#10B981" />
                                        <Text style={styles.growthText}>+12% this week</Text>
                                    </View>
                                </View>
                                <View style={styles.walletIcon}>
                                    <LayoutDashboard size={24} color="#7C3AED" />
                                </View>
                            </View>

                            {/* Verification/Upload CTA */}
                            <TouchableOpacity style={styles.uploadCta} onPress={() => navigateTo('verify')}>
                                <View style={styles.uploadCtaContent}>
                                    <Text style={styles.uploadCtaTitle}>Verify Income</Text>
                                    <Text style={styles.uploadCtaDesc}>Upload proof to unlock loans</Text>
                                </View>
                                <View style={styles.uploadCtaBtn}>
                                    <Upload size={16} color="white" />
                                </View>
                            </TouchableOpacity>

                            {/* Feature Grid */}
                            <Text style={styles.sectionTitle}>Explore Features</Text>
                            <View style={styles.gridContainer}>
                                <FeatureCard label="SMS Analyzer" icon={FileText} color="#7C3AED" onPress={() => navigateTo('sms_analyzer')} />
                                <FeatureCard label="Govt Schemes" icon={Lock} color="#10B981" onPress={() => navigateTo('schemes')} />
                                <FeatureCard label="Verify Docs" icon={ScanFace} color="#F59E0B" onPress={() => navigateTo('verify')} />
                                <FeatureCard label="Tax Saver" icon={Calculator} color="#EF4444" onPress={() => navigateTo('tax')} />
                                <FeatureCard label="AI Chatbot" icon={Bot} color="#3B82F6" onPress={() => navigateTo('chatbot')} />
                                <FeatureCard label="Decoder" icon={ScrollText} color="#6366F1" onPress={() => navigateTo('decoder')} />
                            </View>

                        </ScrollView>
                    )}

                    {/* SUB-PAGES RENDERER */}
                    {currentPage !== 'dashboard' && (
                        <View style={styles.subPageWrapper}>
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
                    )}

                </View>

                {/* --- 3. FLOATING BOTTOM BAR --- */}
                <View style={styles.bottomNavContainer}>
                    <View style={styles.bottomNav}>
                        <NavTab icon={Home} label="Home" active={currentPage === 'dashboard'} onPress={() => navigateTo('dashboard')} />
                        <NavTab icon={LayoutDashboard} label="Services" active={currentPage === 'unified'} onPress={() => navigateTo('unified')} />
                        <NavTab icon={User} label="Profile" active={currentPage === 'profile'} onPress={() => navigateTo('profile')} />
                    </View>
                </View>

                {/* --- 4. SIDEBAR MODAL --- */}
                <Sidebar
                    visible={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onNavigate={navigateTo}
                    current={currentPage}
                    onLogout={() => {
                        Alert.alert(
                            "Log Out",
                            "Are you sure you want to log out?",
                            [
                                { text: "Cancel", style: "cancel" },
                                { text: "Log Out", style: "destructive", onPress: handleLogout }
                            ]
                        );
                    }}
                />

            </SafeAreaView>
        </SafeAreaProvider>
    );
}

// --- NEW SUB COMPONENTS ---

const FeatureCard = ({ label, icon: Icon, color, onPress }: any) => (
    <TouchableOpacity style={styles.featureCard} onPress={onPress}>
        <View style={[styles.featureIconBox, { backgroundColor: color + '20' }]}>
            <Icon size={24} color={color} />
        </View>
        <Text style={styles.featureLabel}>{label}</Text>
    </TouchableOpacity>
);

const NavTab = ({ icon: Icon, label, active, onPress }: any) => (
    <TouchableOpacity style={[styles.navTab, active && styles.navTabActive]} onPress={onPress}>
        <Icon size={20} color={active ? '#7C3AED' : '#9CA3AF'} />
        {active && <Text style={styles.navTextActive}>{label}</Text>}
    </TouchableOpacity>
);


// --- SIDEBAR (Kept same logic, just styled) ---
const Sidebar = ({ visible, onClose, onNavigate, current, onLogout }: any) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} />
            <View style={styles.drawer}>
                <View style={styles.drawerHeader}>
                    <View style={styles.drawerUserRow}>
                        <View style={styles.headerAvatar}><Text style={styles.headerAvatarText}>RS</Text></View>
                        <View>
                            <Text style={styles.drawerName}>Rahul Sharma</Text>
                            <Text style={styles.drawerLink}>View Profile</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onClose}><X color="#9CA3AF" size={24} /></TouchableOpacity>
                </View>
                <ScrollView style={styles.drawerBody}>
                    <DrawerRow label="Home" icon={Home} page="dashboard" current={current} nav={onNavigate} />
                    <DrawerRow label="Verify" icon={ScanFace} page="verify" current={current} nav={onNavigate} />
                    <DrawerRow label="Analyzer" icon={FileText} page="sms_analyzer" current={current} nav={onNavigate} />
                    <DrawerRow label="Decoder" icon={FileText} page="decoder" current={current} nav={onNavigate} />
                    <DrawerRow label="Schemes" icon={Lock} page="schemes" current={current} nav={onNavigate} />
                    <DrawerRow label="Tax & ITR" icon={Calculator} page="tax" current={current} nav={onNavigate} />
                    <DrawerRow label="Reports" icon={ScrollText} page="reports" current={current} nav={onNavigate} />
                    <DrawerRow label="Chatbot" icon={Bot} page="chatbot" current={current} nav={onNavigate} />
                    <DrawerRow label="Unified View" icon={LayoutDashboard} page="unified" current={current} nav={onNavigate} />
                    <DrawerRow label="Profile" icon={User} page="profile" current={current} nav={onNavigate} />
                </ScrollView>
                <View style={styles.drawerFooter}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                        <LogOut size={20} color="#EF4444" />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                    <Text style={styles.version}>v1.2.0</Text>
                </View>
            </View>
        </View>
    </Modal>
);

const DrawerRow = ({ label, icon: Icon, page, current, nav }: any) => (
    <TouchableOpacity style={[styles.drawerRow, current === page && styles.drawerRowActive]} onPress={() => nav(page)}>
        <Icon size={20} color={current === page ? '#7C3AED' : '#4B5563'} />
        <Text style={[styles.drawerRowText, current === page && styles.drawerRowTextActive]}>{label}</Text>
    </TouchableOpacity>
);

// --- PREMIUM STYLES ---

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#F9FAFB' },

    // Header Curve
    headerCurve: {
        height: 180,
        backgroundColor: '#1F2937',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 10,
        alignItems: 'center',
        zIndex: 1
    },
    headerTopBar: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginTop: 10 },
    headerTitle: { color: 'white', fontSize: 14, fontWeight: 'bold', letterSpacing: 2 },
    headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#374151', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#6B7280' },
    headerAvatarText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

    // Main Content
    mainContent: { flex: 1, marginTop: -90, zIndex: 2 }, // Pull up to overlap header
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    subPageWrapper: { flex: 1, backgroundColor: 'white', marginHorizontal: 16, borderRadius: 24, padding: 4, elevation: 5, paddingBottom: 80, minHeight: 600 },

    // Earnings Card
    earningsCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 20
    },
    earningsLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' },
    earningsValue: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginVertical: 4 },
    growthTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    growthText: { color: '#10B981', fontSize: 10, fontWeight: 'bold' },
    walletIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center' },

    // Upload CTA
    uploadCta: { backgroundColor: '#10B981', borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, elevation: 5 },
    uploadCtaContent: { flex: 1 },
    uploadCtaTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    uploadCtaDesc: { color: '#D1FAE5', fontSize: 12, marginTop: 2 },
    uploadCtaBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

    // Grid
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
    featureCard: { width: '48%', backgroundColor: 'white', padding: 16, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 12, elevation: 2, marginBottom: 12 },
    featureIconBox: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
    featureLabel: { fontSize: 14, fontWeight: '600', color: '#374151' },

    // Bottom Nav
    bottomNavContainer: { position: 'absolute', bottom: 20, left: 20, right: 20, alignItems: 'center' },
    bottomNav: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 30, padding: 8, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
    navTab: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 20 },
    navTabActive: { backgroundColor: '#F3E8FF' },
    navTextActive: { marginLeft: 8, fontSize: 14, fontWeight: 'bold', color: '#7C3AED' },

    // Sidebar
    modalContainer: { flex: 1, flexDirection: 'row' },
    modalBackdrop: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' },
    drawer: { width: '80%', maxWidth: 320, backgroundColor: 'white', height: '100%' },
    drawerHeader: { padding: 24, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    drawerUserRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    drawerName: { fontWeight: 'bold', fontSize: 16, color: '#1F2937' },
    drawerLink: { fontSize: 12, color: '#7C3AED', fontWeight: '500' },
    drawerBody: { flex: 1, paddingVertical: 10 },
    drawerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingLeft: 24, gap: 16, borderLeftWidth: 4, borderLeftColor: 'transparent' },
    drawerRowActive: { backgroundColor: '#F3E8FF', borderLeftColor: '#7C3AED' },
    drawerRowText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
    drawerRowTextActive: { color: '#7C3AED', fontWeight: 'bold' },
    drawerFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    logoutText: { color: '#EF4444', fontWeight: '600', marginLeft: 12 },
    version: { textAlign: 'center', fontSize: 12, color: '#9CA3AF' }
});
