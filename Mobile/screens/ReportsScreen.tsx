import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FileDown, FileText } from 'lucide-react-native';

const REPORTS = [
    { id: '1', title: 'Monthly Earnings Report', date: 'Dec 2024', size: '1.2 MB' },
    { id: '2', title: 'Tax Deduction Statement', date: 'FY 2023-24', size: '850 KB' },
    { id: '3', title: 'Verification Certificate', date: 'Issued Jan 10', size: '2.5 MB' },
];

export default function ReportsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Reports</Text>
            <Text style={styles.subtitle}>Download your financial statements and certificates.</Text>

            <FlatList
                data={REPORTS}
                keyExtractor={item => item.id}
                contentContainerStyle={{ gap: 12 }}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.reportItem}>
                        <View style={styles.iconBox}>
                            <FileText size={24} color="#0A1F44" />
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemMeta}>{item.date} • {item.size}</Text>
                        </View>
                        <TouchableOpacity style={styles.downloadBtn}>
                            <FileDown size={20} color="#2563EB" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#F8F9FA' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0A1F44' },
    subtitle: { color: '#6B7280', marginTop: 8, marginBottom: 24 },
    reportItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 12, elevation: 1 },
    iconBox: { width: 48, height: 48, backgroundColor: '#F3F4F6', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1, marginLeft: 16 },
    itemTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
    itemMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
    downloadBtn: { padding: 8, backgroundColor: '#EFF6FF', borderRadius: 8 }
});
