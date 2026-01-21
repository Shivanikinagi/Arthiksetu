import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, TextInput, Alert } from 'react-native';
import { Shield, ChevronRight, ExternalLink, Filter, Wallet } from 'lucide-react-native';
import { CyberTheme } from '../constants/CyberTheme';
import { LinearGradient } from 'expo-linear-gradient';

const ALL_SCHEMES = [
    {
        id: '1', name: 'Ayushman Bharat Yojana',
        desc: 'Health insurance coverage of up to ₹5 Lakhs per family per year.',
        amount: '₹5 Lakh Cover', maxIncome: 25000, url: 'https://nha.gov.in/'
    },
    {
        id: '2', name: 'E-Shram Card',
        desc: 'National Database of Unorganized Workers. Accidental insurance cover.',
        amount: '₹2 Lakh Cover', maxIncome: 15000, url: 'https://eshram.gov.in/'
    },
    {
        id: '3', name: 'PM Swanidhi Yojana',
        desc: 'Special micro-credit facility for street vendors. Collateral-free.',
        amount: 'Loan up to ₹50k', maxIncome: 50000, url: 'https://pmsvanidhi.mohua.gov.in/'
    },
    {
        id: '4', name: 'Atal Pension Yojana',
        desc: 'Pension scheme for citizens of India, focused on unorganized sector.',
        amount: 'Pension ₹5k/mo', maxIncome: 1000000, url: 'https://npscra.nsdl.co.in/'
    }
];

const LOAN_OFFERS = [
    {
        id: 'l1', name: 'HDFC Personal Loan',
        desc: 'Instant personal loan for gig workers with minimal documentation.',
        amount: 'Interest: 10.5%', url: 'https://leads.hdfcbank.com/applications/new_web/personal-loan/index.html'
    },
    {
        id: 'l2', name: 'SBI Xpress Credit',
        desc: 'Quick approval loan for verified income sources.',
        amount: 'Interest: 11.2%', url: 'https://sbi.co.in/web/personal-banking/loans/personal-loans/xpress-credit-personal-loan'
    },
    {
        id: 'l3', name: 'PM Mudra Loan (Shishu)',
        desc: 'Government backed loan for small businesses up to ₹50,000.',
        amount: 'Collateral Free', url: 'https://www.mudra.org.in/'
    },
    {
        id: 'l4', name: 'Bajaj Finserv EMI',
        desc: 'No Cost EMI card for electronics and daily needs.',
        amount: 'Limit up to ₹2L', url: 'https://www.bajajfinserv.in/emi-network-emi-card-apply-online'
    }
];

export default function SchemesScreen({ earnings = 0 }: { earnings?: number }) {
    const [inputIncome, setInputIncome] = useState(earnings.toString());
    const [filteredSchemes, setFilteredSchemes] = useState(ALL_SCHEMES);
    const [activeTab, setActiveTab] = useState<'schemes' | 'loans'>('schemes');

    useEffect(() => { filterSchemes(earnings.toString()); }, [earnings]);

    const filterSchemes = (text: string) => {
        setInputIncome(text);
        const val = parseFloat(text) || 0;
        setFilteredSchemes(ALL_SCHEMES.filter(s => val <= s.maxIncome));
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.pageTitle}>Explore Opportunities</Text>

            {/* TABS */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'schemes' && styles.activeTab]}
                    onPress={() => setActiveTab('schemes')}
                >
                    <Text style={[styles.tabText, activeTab === 'schemes' && styles.activeTabText]}>Govt Schemes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'loans' && styles.activeTab]}
                    onPress={() => setActiveTab('loans')}
                >
                    <Text style={[styles.tabText, activeTab === 'loans' && styles.activeTabText]}>Loan Offers</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'schemes' ? (
                <>
                    <View style={styles.filterCard}>
                        <Text style={styles.label}>Monthly Income (₹)</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                value={inputIncome} onChangeText={filterSchemes}
                                keyboardType="numeric"
                                placeholderTextColor={CyberTheme.colors.textDim}
                            />
                            <Filter size={20} color={CyberTheme.colors.secondary} />
                        </View>
                    </View>

                    <Text style={styles.sectionHeader}>Eligible Schemes ({filteredSchemes.length})</Text>

                    <View style={styles.list}>
                        {filteredSchemes.map((s) => (
                            <TouchableOpacity key={s.id} activeOpacity={0.8} onPress={() => Linking.openURL(s.url)}>
                                <LinearGradient
                                    colors={CyberTheme.colors.gradientDark}
                                    style={styles.card}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                >
                                    <View style={styles.cardTop}>
                                        <View style={styles.iconBox}><Shield size={20} color={CyberTheme.colors.accent} /></View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cardName}>{s.name}</Text>
                                            <Text style={styles.cardAmt}>{s.amount}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.cardDesc}>{s.desc}</Text>
                                    <View style={styles.cardFooter}>
                                        <Text style={styles.incomeBadge}>Max: {(s.maxIncome / 1000).toFixed(0)}k</Text>
                                        <View style={styles.applyBtn}>
                                            <Text style={styles.applyText}>Apply</Text>
                                            <ExternalLink size={12} color="white" />
                                        </View>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            ) : (
                /* LOANS TAB */
                <View style={styles.list}>
                    {LOAN_OFFERS.map((l) => (
                        <TouchableOpacity key={l.id} activeOpacity={0.8} onPress={() => Linking.openURL(l.url)}>
                            <LinearGradient
                                colors={['rgba(21, 31, 50, 0.8)', 'rgba(11, 17, 33, 0.9)']}
                                style={styles.card}
                            >
                                <View style={styles.cardTop}>
                                    <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                                        <Wallet size={20} color={CyberTheme.colors.success} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.cardName}>{l.name}</Text>
                                        <Text style={[styles.cardAmt, { color: CyberTheme.colors.success }]}>{l.amount}</Text>
                                    </View>
                                </View>
                                <Text style={styles.cardDesc}>{l.desc}</Text>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.incomeBadge}>Instant Approval</Text>
                                    <View style={[styles.applyBtn, { backgroundColor: CyberTheme.colors.success }]}>
                                        <Text style={styles.applyText}>View Offer</Text>
                                        <ChevronRight size={14} color="white" />
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: CyberTheme.colors.background },
    content: { padding: 24, paddingBottom: 100 },
    pageTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

    tabContainer: { flexDirection: 'row', backgroundColor: CyberTheme.colors.surface, borderRadius: 12, padding: 4, marginBottom: 24 },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
    activeTab: { backgroundColor: CyberTheme.colors.primary },
    tabText: { color: CyberTheme.colors.textSecondary, fontWeight: '600', fontSize: 14 },
    activeTabText: { color: 'white', fontWeight: 'bold' },

    filterCard: { backgroundColor: CyberTheme.colors.surface, padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    label: { color: CyberTheme.colors.textSecondary, fontSize: 12, marginBottom: 8, textTransform: 'uppercase' },
    inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: CyberTheme.colors.background, paddingHorizontal: 16, borderRadius: 12 },
    input: { flex: 1, color: 'white', fontSize: 16, fontWeight: 'bold', height: 48 },

    sectionHeader: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
    list: { gap: 16 },

    card: { padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    cardTop: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(217, 70, 239, 0.1)', alignItems: 'center', justifyContent: 'center' },
    cardName: { color: 'white', fontWeight: 'bold', fontSize: 15 },
    cardAmt: { color: CyberTheme.colors.secondary, fontSize: 12, marginTop: 2, fontWeight: 'bold' },
    cardDesc: { color: CyberTheme.colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 16 },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    incomeBadge: { color: CyberTheme.colors.textDim, fontSize: 12, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    applyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: CyberTheme.colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    applyText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});
