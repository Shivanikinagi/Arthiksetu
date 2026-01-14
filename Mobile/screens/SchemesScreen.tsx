import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, TextInput, Alert } from 'react-native';
import { Shield, ChevronRight, ExternalLink, Filter } from 'lucide-react-native';

const ALL_SCHEMES = [
    {
        id: '1',
        name: 'Ayushman Bharat Yojana',
        desc: 'Health insurance coverage of up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization.',
        amount: '₹5 Lakh Cover',
        maxIncome: 25000,
        minIncome: 0,
        url: 'https://nha.gov.in/'
    },
    {
        id: '2',
        name: 'E-Shram Card',
        desc: 'National Database of Unorganized Workers. Provides accidental insurance cover of ₹2 Lakhs.',
        amount: '₹2 Lakh Accident Cover',
        maxIncome: 15000,
        minIncome: 0,
        url: 'https://eshram.gov.in/'
    },
    {
        id: '3',
        name: 'Pradhan Mantri Mudra Yojana',
        desc: 'Loans up to ₹10 Lakhs for non-corporate, non-farm small/micro enterprises (Shishu, Kishore, Tarun).',
        amount: 'Loan up to ₹10 Lakh',
        maxIncome: 1000000, // High limit, business based
        minIncome: 0,
        url: 'https://www.mudra.org.in/'
    },
    {
        id: '4',
        name: 'Atal Pension Yojana',
        desc: 'Pension scheme for citizens of India, focused on unorganized sector workers.',
        amount: 'Pension ₹1k-5k/mo',
        maxIncome: 1000000, // Broad eligibility (not tax payer)
        minIncome: 0,
        url: 'https://npscra.nsdl.co.in/scheme-details.php'
    },
    {
        id: '5',
        name: 'PM Swanidhi Yojana',
        desc: 'Special micro-credit facility for street vendors. Collateral-free working capital loan.',
        amount: 'Loan ₹10k - ₹50k',
        maxIncome: 50000, // Targeted at lower income vendors
        minIncome: 0,
        url: 'https://pmsvanidhi.mohua.gov.in/'
    },
    {
        id: '6',
        name: 'Pradhan Mantri Jeevan Jyoti Bima',
        desc: 'Life insurance scheme renewable from year to year, offering coverage for death due to any reason.',
        amount: '₹2 Lakh Life Cover',
        maxIncome: 10000000, // Open to all with bank account
        minIncome: 0,
        url: 'https://financialservices.gov.in/'
    }
];

export default function SchemesScreen({ earnings = 0 }: { earnings?: number }) {
    const [inputIncome, setInputIncome] = useState(earnings.toString());
    const [filteredSchemes, setFilteredSchemes] = useState(ALL_SCHEMES);

    useEffect(() => {
        filterSchemes(earnings.toString());
    }, [earnings]);

    const filterSchemes = (text: string) => {
        setInputIncome(text);
        const incomeVal = parseFloat(text) || 0;

        const eligible = ALL_SCHEMES.filter(scheme => {
            // Check if income is within range (if maxIncome is defined)
            return incomeVal <= scheme.maxIncome;
        });
        setFilteredSchemes(eligible);
    };

    const handleApply = (url: string) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert("Error", "Cannot open this link: " + url);
            }
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>Government Schemes</Text>
            <Text style={styles.subTitle}>Check eligibility based on your monthly income.</Text>

            {/* Income Filter */}
            <View style={styles.filterCard}>
                <Text style={styles.filterLabel}>Your Monthly Income (₹)</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.incomeInput}
                        value={inputIncome}
                        onChangeText={filterSchemes}
                        keyboardType="numeric"
                    />
                    <Filter size={20} color="#6B7280" />
                </View>
                <Text style={styles.filterHint}>Adjust income to see different schemes</Text>
            </View>

            <Text style={styles.sectionHeader}>Eligible Schemes ({filteredSchemes.length})</Text>

            <View style={styles.listContainer}>
                {filteredSchemes.map((scheme) => (
                    <View key={scheme.id} style={styles.schemeCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.iconContainer}>
                                <Shield size={24} color="#2563EB" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.schemeName}>{scheme.name}</Text>
                                <Text style={styles.schemeAmount}>{scheme.amount}</Text>
                            </View>
                        </View>

                        <Text style={styles.schemeDesc}>{scheme.desc}</Text>

                        <View style={styles.cardFooter}>
                            <View style={styles.criteriaBadge}>
                                <Text style={styles.criteriaText}>Max Income: ₹{(scheme.maxIncome / 1000).toFixed(0)}k</Text>
                            </View>
                            <TouchableOpacity style={styles.applyBtn} onPress={() => handleApply(scheme.url)}>
                                <Text style={styles.applyText}>Apply Now</Text>
                                <ExternalLink size={14} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                {filteredSchemes.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No schemes found for this income range.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#F8F9FA',
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
    subTitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },

    filterCard: {
        backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 24,
        borderWidth: 1, borderColor: '#E5E7EB'
    },
    filterLabel: { fontSize: 12, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
    inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 12 },
    incomeInput: { flex: 1, height: 44, fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    filterHint: { fontSize: 10, color: '#9CA3AF', marginTop: 8 },

    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
    listContainer: { gap: 16, paddingBottom: 40 },

    schemeCard: {
        backgroundColor: 'white', borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: '#E5E7EB', elevation: 2
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    schemeName: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    schemeAmount: { fontSize: 12, fontWeight: 'bold', color: '#16A34A', marginTop: 2 },
    schemeDesc: { fontSize: 13, color: '#6B7280', lineHeight: 20, marginBottom: 16 },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16 },
    criteriaBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    criteriaText: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
    applyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, gap: 6 },
    applyText: { color: 'white', fontWeight: '600', fontSize: 12 },

    emptyState: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#9CA3AF' }
});
