import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard, SectionTitle } from '../components/GlassComponents';
import { CheckCircle2 } from 'lucide-react-native';

const PLATFORMS = [
    { id: 1, name: 'Swiggy', earnings: '₹12,400', status: 'Linked', color: '#fc8019' },
    { id: 2, name: 'Zomato', earnings: '₹8,350', status: 'Linked', color: '#cb202d' },
    { id: 3, name: 'Uber', earnings: '₹15,200', status: 'Linked', color: 'white' },
    { id: 4, name: 'Shadowfax', earnings: 'Connect', status: 'Pending', color: '#fbbf24' },
];

export default function UnifiedScreen({ onBack }: { onBack?: () => void }) {
    return (
        <ScreenWrapper title="Unified View" subtitle="ALL ACCOUNTS" showBack onBack={onBack}>
            <View style={{ gap: 16 }}>
                {PLATFORMS.map((p) => (
                    <GlassCard key={p.id} intensity={15} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            <View style={[styles.logoPlaceholder, { borderColor: p.color }]}>
                                <Text style={[styles.logoText, { color: p.color }]}>{p.name[0]}</Text>
                            </View>
                            <View>
                                <Text style={styles.name}>{p.name}</Text>
                                <Text style={styles.earnings}>{p.earnings}</Text>
                            </View>
                        </View>
                        {p.status === 'Linked' ? (
                            <CheckCircle2 size={20} color="#34d399" />
                        ) : (
                            <Text style={styles.linkText}>Link</Text>
                        )}
                    </GlassCard>
                ))}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    logoPlaceholder: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    logoText: { fontSize: 18, fontWeight: 'bold' },
    name: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    earnings: { color: '#94a3b8', fontSize: 12 },
    linkText: { color: '#22d3ee', fontWeight: 'bold' }
});
