import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Linking, ActivityIndicator } from 'react-native';
import { Gift, ChevronRight, Lock, CheckCircle2 } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard, GlassButton } from '../components/GlassComponents';
import api from '../api';

const SCHEMES = [
    {
        id: '1',
        name: 'PM Vishwakarma Yojana',
        benefits: 'Collateral-free loans up to ₹3 Lakhs at 5% interest.',
        eligible: true,
        category: 'Central Govt',
        match: '98% Match'
    },
    {
        id: '2',
        name: 'Ayushman Bharat',
        benefits: 'Free health coverage up to ₹5 Lakhs per family.',
        eligible: true,
        category: 'Health',
        match: '95% Match'
    },
    {
        id: '3',
        name: 'e-Shram Card',
        benefits: 'Pension of ₹3,000/month after age 60.',
        eligible: true,
        category: 'Social Security',
        match: '92% Match'
    },
    {
        id: '4',
        name: 'PM Awas Yojana',
        benefits: 'Subsidy on home loans for first-time buyers.',
        eligible: false,
        category: 'Housing',
        match: '40% Match'
    }
];

export default function SchemesScreen({ earnings = 0, onBack }: { earnings?: number, onBack?: () => void }) {

    const [schemes, setSchemes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchSchemes = async () => {
            try {
                // Default Profile or fetch from Profile Screen state later
                const profile = { age: 30, income: earnings * 12, occupation: 'vendor', category: 'General' };
                const res = await api.getSchemes(profile);
                if (res.schemes) {
                    setSchemes(res.schemes);
                }
            } catch (e) {
                // Fallback
                console.log("Error fetching schemes");
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, [earnings]);

    const handleApply = (url: string) => {
        if (url) Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <ScreenWrapper title="Govt Schemes" subtitle="AI RECOMMENDATIONS" showBack onBack={onBack}>
            {/* Status Header */}
            <GlassCard intensity={20} style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(16, 185, 129, 0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 color="#34d399" size={24} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>You are Eligible!</Text>
                    <Text style={{ color: '#d1fae5', fontSize: 12 }}>Based on your annualized earnings of ₹{(earnings * 12).toLocaleString('en-IN')}</Text>
                </View>
            </GlassCard>

            <View style={{ gap: 16 }}>
                {loading ? <ActivityIndicator size="large" color="#22d3ee" /> : schemes.map((scheme) => (
                    <GlassCard key={scheme.id} intensity={15} style={{ padding: 0 }}>
                        <View style={{ padding: 16 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{scheme.category}</Text>
                                </View>
                                <Text style={{ color: scheme.status === 'eligible' ? '#34d399' : '#94a3b8', fontWeight: 'bold', fontSize: 12 }}>
                                    {scheme.status === 'eligible' ? '98% Match' : 'Locked'}
                                </Text>
                            </View>

                            <Text style={styles.schemeName}>{scheme.name}</Text>
                            <Text style={styles.schemeBenefit}>{scheme.benefit}</Text>
                            <Text style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>{scheme.description}</Text>
                        </View>

                        <View style={styles.footer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Lock size={14} color={scheme.status === 'eligible' ? "#34d399" : "#64748b"} />
                                <Text style={{ color: scheme.status === 'eligible' ? "#d1fae5" : "#64748b", fontSize: 12 }}>
                                    {scheme.status === 'eligible' ? 'Unlocked' : 'Criteria not met'}
                                </Text>
                            </View>
                            {scheme.status === 'eligible' && (
                                <GlassButton
                                    title="APPLY"
                                    onPress={() => handleApply(scheme.url)}
                                    style={{ paddingVertical: 8, paddingHorizontal: 16, height: 36, borderRadius: 10 }}
                                />
                            )}
                        </View>
                    </GlassCard>
                ))}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    schemeName: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    schemeBenefit: { color: '#94a3b8', fontSize: 13, lineHeight: 20 },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'flex-start' },
    badgeText: { color: '#e2e8f0', fontSize: 10, fontWeight: '600' },
    footer: { padding: 12, backgroundColor: 'rgba(0,0,0,0.2)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});
