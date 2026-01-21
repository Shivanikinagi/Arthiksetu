import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard, SectionTitle } from '../components/GlassComponents';
import { CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react-native';

const PLATFORMS = [
    { id: 1, name: 'Swiggy', earnings: 12400, color: '#fc8019', percent: 35 },
    { id: 2, name: 'Zomato', earnings: 8350, color: '#cb202d', percent: 23 },
    { id: 3, name: 'Uber', earnings: 15200, color: '#22d3ee', percent: 42 },
];

const DonutChart = () => {
    const radius = 70;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;
    let startAngle = 0;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
            <Svg width={180} height={180} viewBox="0 0 180 180">
                <G rotation="-90" origin="90, 90">
                    {PLATFORMS.map((p, i) => {
                        const dash = (p.percent / 100) * circumference;
                        const angle = (p.percent / 100) * 360;
                        const currentStart = startAngle;
                        startAngle += angle;
                        return (
                            <Circle
                                key={p.id}
                                cx="90" cy="90" r={radius}
                                stroke={p.color}
                                strokeWidth={strokeWidth}
                                fill="transparent"
                                strokeDasharray={`${dash} ${circumference}`}
                                strokeDashoffset={-((currentStart / 360) * circumference)}
                                strokeLinecap="round"
                            />
                        );
                    })}
                </G>
            </Svg>
            <View style={{ position: 'absolute', alignItems: 'center' }}>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>Total</Text>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>₹35.9k</Text>
            </View>
        </View>
    );
};

export default function UnifiedScreen({ onBack }: { onBack?: () => void }) {
    const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

    return (
        <ScreenWrapper title="Unified View" subtitle="EARNINGS ANALYTICS" showBack onBack={onBack}>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 10 }}>
                <TouchableOpacity onPress={() => setViewMode('chart')} style={[styles.tab, viewMode === 'chart' && styles.activeTab]}>
                    <Text style={[styles.tabText, viewMode === 'chart' && styles.activeTabText]}>Analytics</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setViewMode('list')} style={[styles.tab, viewMode === 'list' && styles.activeTab]}>
                    <Text style={[styles.tabText, viewMode === 'list' && styles.activeTabText]}>Accounts</Text>
                </TouchableOpacity>
            </View>

            {viewMode === 'chart' ? (
                <>
                    <GlassCard intensity={15} style={{ alignItems: 'center', padding: 10 }}>
                        <Text style={{ color: '#94a3b8', marginBottom: 10 }}>Platform Diversification</Text>
                        <DonutChart />
                        <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
                            {PLATFORMS.map(p => (
                                <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: p.color }} />
                                    <Text style={{ color: '#cbd5e1', fontSize: 12 }}>{p.name}</Text>
                                </View>
                            ))}
                        </View>
                    </GlassCard>

                    <SectionTitle title="Insights" />
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <GlassCard intensity={20} style={{ flex: 1, padding: 16 }}>
                            <TrendingUp color="#34d399" size={20} style={{ marginBottom: 8 }} />
                            <Text style={styles.statLabel}>Growth</Text>
                            <Text style={styles.statValue}>+12%</Text>
                        </GlassCard>
                        <GlassCard intensity={20} style={{ flex: 1, padding: 16 }}>
                            <AlertTriangle color="#f59e0b" size={20} style={{ marginBottom: 8 }} />
                            <Text style={styles.statLabel}>Risk</Text>
                            <Text style={styles.statValue}>Low</Text>
                        </GlassCard>
                    </View>
                </>
            ) : (
                <View style={{ gap: 16 }}>
                    {PLATFORMS.map((p) => (
                        <GlassCard key={p.id} intensity={15} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                                <View style={[styles.logoPlaceholder, { borderColor: p.color }]}>
                                    <Text style={[styles.logoText, { color: p.color }]}>{p.name[0]}</Text>
                                </View>
                                <View>
                                    <Text style={styles.name}>{p.name}</Text>
                                    <Text style={styles.earnings}>₹{p.earnings.toLocaleString()}</Text>
                                </View>
                            </View>
                            <CheckCircle2 size={20} color="#34d399" />
                        </GlassCard>
                    ))}
                    <GlassCard intensity={10} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#475569' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            <View style={[styles.logoPlaceholder, { borderColor: '#475569' }]}>
                                <Text style={[styles.logoText, { color: '#475569' }]}>+</Text>
                            </View>
                            <View>
                                <Text style={[styles.name, { color: '#94a3b8' }]}>Add Platform</Text>
                                <Text style={styles.earnings}>Link Shadowfax, Dunzo...</Text>
                            </View>
                        </View>
                    </GlassCard>
                </View>
            )}

        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    logoPlaceholder: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    logoText: { fontSize: 18, fontWeight: 'bold' },
    name: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    earnings: { color: '#94a3b8', fontSize: 12 },
    tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
    activeTab: { backgroundColor: '#22d3ee' },
    tabText: { color: '#94a3b8', fontWeight: '600' },
    activeTabText: { color: '#0f172a', fontWeight: 'bold' },
    statLabel: { color: '#94a3b8', fontSize: 12 },
    statValue: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
