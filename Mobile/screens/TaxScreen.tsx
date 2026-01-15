import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../api';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard, SectionTitle } from '../components/GlassComponents';
import { DollarSign, PieChart } from 'lucide-react-native';

export default function TaxScreen({ onBack }: { onBack?: () => void }) {
    const [taxData, setTaxData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTax = async () => {
            try {
                const data = await api.getTax();
                setTaxData(data);
            } catch (e) {
                console.log("Tax fetch error");
            } finally {
                setLoading(false);
            }
        };
        fetchTax();
    }, []);

    const taxAmount = taxData?.tax_payable || 0;
    const isExempt = taxAmount === 0;

    return (
        <ScreenWrapper title="Tax Smart" subtitle="OPTIMIZE YOUR RETURNS" showBack onBack={onBack}>
            <GlassCard intensity={20} style={{ padding: 24, alignItems: 'center', marginBottom: 24 }}>
                <Text style={{ color: '#94a3b8', marginBottom: 8 }}>Estimated Tax Liability</Text>
                {loading ? <ActivityIndicator color="#22d3ee" /> : (
                    <>
                        <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>₹{taxAmount.toLocaleString('en-IN')}</Text>
                        <Text style={{ color: isExempt ? '#34d399' : '#f87171', fontSize: 12, marginTop: 4 }}>
                            {isExempt ? "You are in the exempt bracket!" : "Tax payable based on verified income."}
                        </Text>
                        <Text style={{ color: '#64748b', fontSize: 10, marginTop: 8 }}>
                            Total Annual Income: ₹{taxData?.annual_income?.toLocaleString('en-IN') || 0}
                        </Text>
                    </>
                )}
            </GlassCard>

            <SectionTitle title="Recommended Actions" />
            <View style={{ gap: 12 }}>
                <GlassCard intensity={10} style={{ padding: 16 }}>
                    <Text style={styles.actionTitle}>File Nil ITR</Text>
                    <Text style={styles.actionDesc}>Even with ₹0 tax, filing ITR helps in loan approvals.</Text>
                </GlassCard>
                <GlassCard intensity={10} style={{ padding: 16 }}>
                    <Text style={styles.actionTitle}>Record Expenses</Text>
                    <Text style={styles.actionDesc}>Upload fuel and maintenance bills to reduce taxable income.</Text>
                </GlassCard>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    actionTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
    actionDesc: { color: '#94a3b8', fontSize: 12 }
});
