import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard, SectionTitle, GlassButton } from '../components/GlassComponents';
import { AlertTriangle, TrendingDown, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react-native';

export default function ReportsScreen({ onBack }: { onBack?: () => void }) {
    // Mock Risk Data - ideally fetched from backend
    const riskLevel = 'Medium';
    const trend = 'declining';

    return (
        <ScreenWrapper title="Risk Analysis" subtitle="INCOME PREDICTION AI" showBack onBack={onBack}>

            {/* RISK METER */}
            <GlassCard intensity={20} style={{ alignItems: 'center', padding: 30, marginBottom: 20, borderColor: '#f59e0b', borderWidth: 1 }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(245, 158, 11, 0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <AlertTriangle size={40} color="#f59e0b" />
                </View>
                <Text style={{ color: '#94a3b8', fontSize: 14, letterSpacing: 1 }}>CURRENT RISK LEVEL</Text>
                <Text style={{ color: '#f59e0b', fontSize: 32, fontWeight: 'bold', marginVertical: 4 }}>MEDIUM</Text>
                <Text style={{ color: '#cbd5e1', textAlign: 'center', paddingHorizontal: 20 }}>
                    Your income volatility is higher than usual this month.
                </Text>
            </GlassCard>

            <SectionTitle title="Trend Analysis" />
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                <GlassCard intensity={15} style={{ flex: 1, padding: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <TrendingDown color="#f87171" size={20} />
                        <Text style={styles.cardTitle}>Stability</Text>
                    </View>
                    <Text style={styles.cardValue}>-8.5%</Text>
                    <Text style={styles.cardSub}>vs Last Month</Text>
                </GlassCard>
                <GlassCard intensity={15} style={{ flex: 1, padding: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <ShieldCheck color="#34d399" size={20} />
                        <Text style={styles.cardTitle}>Safety Net</Text>
                    </View>
                    <Text style={styles.cardValue}>12 Days</Text>
                    <Text style={styles.cardSub}>Survival Runway</Text>
                </GlassCard>
            </View>

            <SectionTitle title="AI Suggestions" />
            <View style={{ gap: 12 }}>
                <SuggestionCard
                    title="Diversify Platforms"
                    desc="Your reliability on Swiggy is 85%. Try adding Zomato or Uber for 2 hours daily."
                    impact="High Impact"
                />
                <SuggestionCard
                    title="Weekend Boost"
                    desc="Working Sunday evenings (6-10 PM) can offset your weekday dip."
                    impact="Medium Impact"
                />
            </View>

            <View style={{ marginTop: 30 }}>
                <GlassButton title="DOWNLOAD DETAILED REPORT" icon={<ArrowRight size={18} color="white" />} />
            </View>

        </ScreenWrapper>
    );
}

const SuggestionCard = ({ title, desc, impact }: any) => (
    <GlassCard intensity={10} style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>{title}</Text>
            <Text style={{ color: impact.includes('High') ? '#f87171' : '#f59e0b', fontSize: 10, fontWeight: 'bold' }}>{impact}</Text>
        </View>
        <Text style={{ color: '#94a3b8', fontSize: 13, lineHeight: 18 }}>{desc}</Text>
    </GlassCard>
);

const styles = StyleSheet.create({
    cardTitle: { color: '#cbd5e1', fontSize: 12 },
    cardValue: { color: 'white', fontSize: 20, fontWeight: 'bold', marginVertical: 2 },
    cardSub: { color: '#64748b', fontSize: 11 }
});
