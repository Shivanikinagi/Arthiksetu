import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { ShoppingBag, Plane, FileText, Smartphone, DollarSign } from 'lucide-react-native';
import { CyberTheme } from '../constants/CyberTheme';
import { LinearGradient } from 'expo-linear-gradient';

const EXPENSES = [
    { id: '1', category: 'PayPal', amount: '-$80.23', date: 'Today', icon: ShoppingBag, color: CyberTheme.colors.secondary, percent: '20%' },
    { id: '2', category: 'Received', amount: '+$800.32', date: 'Yesterday', icon: DollarSign, color: CyberTheme.colors.success, percent: '65%' },
    { id: '3', category: 'Android Shopping', amount: '-$32.00', date: '12 Mar', icon: Smartphone, color: CyberTheme.colors.primary, percent: '10%' },
    { id: '4', category: 'Travel', amount: '-$20.00', date: '10 Mar', icon: Plane, color: CyberTheme.colors.accent, percent: '5%' },
];

export default function UnifiedScreen() {
    const R = 80; // Increased Radius
    const C = 2 * Math.PI * R;
    const strokeWidth = 24; // Thicker Stroke

    const val1 = C * 0.45; // Cyan
    const val2 = C * 0.30; // Purple
    const val3 = C * 0.25; // Pink

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <View style={styles.header}>
                <Text style={styles.title}>Spending Analysis</Text>
            </View>

            {/* DONUT CHART */}
            <View style={styles.chartContainer}>
                <View style={styles.chartWrapper}>
                    <Svg width="220" height="220" viewBox="0 0 220 220">
                        <G rotation="-90" origin="110, 110">
                            {/* Background */}
                            <Circle cx="110" cy="110" r={R} stroke={CyberTheme.colors.surfaceLight} strokeWidth={strokeWidth} fill="none" />

                            {/* Segments - Brighter Colors */}
                            <Circle
                                cx="110" cy="110" r={R}
                                stroke={CyberTheme.colors.secondary} strokeWidth={strokeWidth} fill="none"
                                strokeDasharray={`${val1} ${C}`} strokeLinecap="round"
                            />
                            <Circle
                                cx="110" cy="110" r={R}
                                stroke={CyberTheme.colors.primary} strokeWidth={strokeWidth} fill="none"
                                strokeDasharray={`${val2} ${C}`} strokeDashoffset={-val1} strokeLinecap="round"
                            />
                            <Circle
                                cx="110" cy="110" r={R}
                                stroke={CyberTheme.colors.accent} strokeWidth={strokeWidth} fill="none"
                                strokeDasharray={`${val3} ${C}`} strokeDashoffset={-(val1 + val2)} strokeLinecap="round"
                            />
                        </G>
                        {/* Center Text */}
                    </Svg>
                    {/* Inner Content Positioned Absolutely */}
                    <View style={styles.chartCenterOverlay}>
                        <View style={styles.chartCenterCircle} />
                    </View>
                </View>

                {/* Legend - Improved Visibility */}
                <View style={styles.legendContainer}>
                    <LegendItem color={CyberTheme.colors.secondary} label="Food" />
                    <LegendItem color={CyberTheme.colors.primary} label="Others" />
                    <LegendItem color={CyberTheme.colors.accent} label="Travel" />
                </View>
            </View>

            {/* TRANSACTIONS LIST */}
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeader}>Transactions</Text>
                <Text style={styles.filterText}>View All</Text>
            </View>

            <View style={styles.list}>
                {EXPENSES.map((item) => (
                    <View key={item.id} style={styles.txnItem}>
                        {/* Wrapper for Icon to give it a 'glow' box */}
                        <View style={[styles.iconBox, { borderColor: item.color, backgroundColor: item.color + '10' }]}>
                            <item.icon size={22} color={item.color} />
                        </View>

                        <View style={styles.txnInfo}>
                            <Text style={styles.txnCat}>{item.category}</Text>
                            <Text style={styles.txnDate}>{item.date}</Text>
                        </View>

                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[styles.txnAmount, { color: item.amount.startsWith('+') ? CyberTheme.colors.success : 'white' }]}>
                                {item.amount}
                            </Text>
                            {/* Percentage Badge */}
                            <View style={[styles.percentBadge, { backgroundColor: item.color + '20' }]}>
                                <Text style={[styles.percentText, { color: item.color }]}>{item.percent}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

        </ScrollView>
    );
}

const LegendItem = ({ color, label }: any) => (
    <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: color, shadowColor: color, shadowOpacity: 0.8, shadowRadius: 4 }]} />
        <Text style={styles.legendText}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: CyberTheme.colors.background },
    content: { padding: 24, paddingBottom: 100 },

    header: { alignItems: 'center', marginBottom: 40 },
    title: { color: 'white', fontSize: 24, fontWeight: 'bold' },

    chartContainer: { alignItems: 'center', marginBottom: 50 },
    chartWrapper: { position: 'relative', marginBottom: 30, alignItems: 'center', justifyContent: 'center' },
    chartCenterOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
    chartCenterCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: CyberTheme.colors.background, borderWidth: 4, borderColor: CyberTheme.colors.surface },

    legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 30 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    legendDot: { width: 10, height: 10, borderRadius: 5 }, // Larger dots
    legendText: { color: CyberTheme.colors.textSecondary, fontSize: 13, fontWeight: 'bold' },

    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionHeader: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    filterText: { color: CyberTheme.colors.textDim, fontSize: 12, fontWeight: '600' },

    list: { gap: 14 },
    txnItem: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: CyberTheme.colors.surface,
        padding: 18, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)'
    },
    iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1 },
    txnInfo: { flex: 1 },
    txnCat: { color: 'white', fontWeight: 'bold', fontSize: 15 },
    txnDate: { color: CyberTheme.colors.textDim, fontSize: 13, marginTop: 4 },

    txnAmount: { fontWeight: 'bold', fontSize: 15, marginBottom: 4, textAlign: 'right' },
    percentBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    percentText: { fontSize: 10, fontWeight: 'bold' }
});
