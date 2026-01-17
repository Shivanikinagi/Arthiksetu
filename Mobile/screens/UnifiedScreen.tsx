import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { CheckCircle } from 'lucide-react-native';

export default function UnifiedScreen() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Unified Dashboard</Text>
            <Text style={styles.subtitle}>All your gig platforms in one place.</Text>

            <View style={styles.integrationRow}>
                <PlatformCard name="Swiggy" earnings="₹12,400" status="Connected" color="#FC8019" />
                <PlatformCard name="Zomato" earnings="₹8,550" status="Connected" color="#CB202D" />
                <PlatformCard name="Uber" earnings="₹15,200" status="Connected" color="black" />
                <PlatformCard name="Blinkit" earnings="₹1,200" status="Pending" color="#FACC15" />
            </View>

            <Text style={styles.sectionHeader}>Aggregate Stats</Text>
            <View style={styles.statsBox}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Trips</Text>
                    <Text style={styles.statValue}>142</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Hours Online</Text>
                    <Text style={styles.statValue}>86h</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Ratings</Text>
                    <Text style={styles.statValue}>4.8 ★</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const PlatformCard = ({ name, earnings, status, color }: any) => (
    <View style={styles.platCard}>
        <View style={[styles.platIcon, { backgroundColor: color }]}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{name[0]}</Text>
        </View>
        <View>
            <Text style={styles.platName}>{name}</Text>
            <Text style={styles.platEarn}>{earnings}</Text>
        </View>
        <View style={styles.badge}>
            <CheckCircle size={12} color={status === 'Connected' ? "#16A34A" : "#D97706"} />
            <Text style={[styles.badgeText, { color: status === 'Connected' ? "#16A34A" : "#D97706" }]}>{status}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#F8F9FA' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0A1F44' },
    subtitle: { color: '#6B7280', marginTop: 8, marginBottom: 24 },
    integrationRow: { gap: 12, marginBottom: 32 },
    platCard: { backgroundColor: 'white', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 1 },
    platIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    platName: { fontSize: 14, color: '#6B7280' },
    platEarn: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 10, fontWeight: '600' },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
    statsBox: { backgroundColor: '#0A1F44', borderRadius: 20, padding: 24, flexDirection: 'row', justifyContent: 'space-between' },
    statItem: { alignItems: 'center' },
    statLabel: { color: '#93C5FD', fontSize: 12, marginBottom: 4 },
    statValue: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }
});
