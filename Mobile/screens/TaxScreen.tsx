import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Calculator, DollarSign, PieChart } from 'lucide-react-native';

export default function TaxScreen() {
    const [income, setIncome] = useState('');
    const [tax, setTax] = useState<null | number>(null);

    const calculateTax = () => {
        const amount = parseFloat(income);
        if (!amount) return;
        // Simple mock calculation (New Regime-ish)
        let taxAmount = 0;
        if (amount > 700000) {
            taxAmount = (amount - 300000) * 0.10; // Simplified logic
        }
        setTax(taxAmount);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Tax & ITR Calculator</Text>
            <Text style={styles.subtitle}>Estimate your tax liability for the FY 2024-25.</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Annual Income (₹)</Text>
                <View style={styles.inputWrapper}>
                    <DollarSign size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 850000"
                        keyboardType="numeric"
                        value={income}
                        onChangeText={setIncome}
                    />
                </View>
                <TouchableOpacity style={styles.calcBtn} onPress={calculateTax}>
                    <Calculator size={20} color="white" />
                    <Text style={styles.btnText}>Calculate Tax</Text>
                </TouchableOpacity>
            </View>

            {tax !== null && (
                <View style={styles.resultCard}>
                    <Text style={styles.resultTitle}>Estimated Tax</Text>
                    <Text style={styles.taxAmount}>₹{tax.toLocaleString('en-IN')}</Text>
                    <View style={styles.infoRow}>
                        <PieChart size={16} color="#2563EB" />
                        <Text style={styles.infoText}>Based on New Tax Regime</Text>
                    </View>
                    <Text style={styles.disclaimer}>* This is an estimate. Consult a CA for accurate filing.</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#F8F9FA' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0A1F44' },
    subtitle: { color: '#6B7280', marginTop: 8, marginBottom: 24 },
    card: { backgroundColor: 'white', padding: 24, borderRadius: 16, elevation: 1 },
    label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, height: 50, marginBottom: 24, backgroundColor: '#F9FAFB' },
    input: { flex: 1, marginLeft: 8, fontSize: 16, color: '#1F2937' },
    calcBtn: { backgroundColor: '#0A1F44', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 8, gap: 8 },
    btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    resultCard: { marginTop: 24, padding: 24, backgroundColor: '#EFF6FF', borderRadius: 16, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#BFDBFE' },
    resultTitle: { fontSize: 16, color: '#1E40AF', fontWeight: '600' },
    taxAmount: { fontSize: 40, fontWeight: 'bold', color: '#1E3A8A', marginVertical: 8 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
    infoText: { fontSize: 12, color: '#2563EB' },
    disclaimer: { fontSize: 10, color: '#9CA3AF', textAlign: 'center' }
});
