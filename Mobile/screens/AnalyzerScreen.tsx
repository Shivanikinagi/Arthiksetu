import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FileText, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function AnalyzerScreen() {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<null | { score: number, issues: string[] }>(null);
    const [fileName, setFileName] = useState('');

    const pickAndAnalyze = async () => {
        try {
            const doc = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            if (doc.canceled === false) {
                setFileName(doc.assets ? doc.assets[0].name : "Selected File");
                setAnalyzing(true);
                // Simulate analysis delay
                setTimeout(() => {
                    setAnalyzing(false);
                    setResult({
                        score: 72,
                        issues: ['Missing income proof for March', 'Tax deduction mismatch', 'Address blurred in ID proof']
                    });
                }, 2000);
            }
        } catch (e) {
            Alert.alert('Error', 'Could not pick file');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Document Analyzer</Text>
            <Text style={styles.subtitle}>Upload your financial documents to get an instant AI analysis score and find errors.</Text>

            <TouchableOpacity style={styles.uploadBox} onPress={pickAndAnalyze}>
                <FileText size={40} color="#2563EB" />
                <Text style={styles.uploadText}>{fileName || "Select PDF Document"}</Text>
                <Text style={styles.uploadHint}>Tap to browse files</Text>
            </TouchableOpacity>

            {analyzing && (
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={styles.loadingText}>AI is analyzing your document...</Text>
                </View>
            )}

            {result && !analyzing && (
                <View style={styles.resultBox}>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreLabel}>Health Score</Text>
                        <Text style={[styles.scoreValue, { color: result.score > 70 ? '#16A34A' : '#DC2626' }]}>{result.score}/100</Text>
                    </View>

                    <Text style={styles.issuesTitle}>Detected Issues:</Text>
                    {result.issues.map((issue, index) => (
                        <View key={index} style={styles.issueItem}>
                            <AlertTriangle size={16} color="#D97706" style={{ marginTop: 2 }} />
                            <Text style={styles.issueText}>{issue}</Text>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.fixBtn}>
                        <Text style={styles.fixBtnText}>View Detailed Report</Text>
                        <ArrowRight size={16} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#F8F9FA' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0A1F44' },
    subtitle: { color: '#6B7280', marginTop: 8, marginBottom: 24 },
    uploadBox: { backgroundColor: 'white', borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 16, alignItems: 'center', padding: 32, marginBottom: 24 },
    uploadText: { fontSize: 16, fontWeight: 'bold', color: '#0A1F44', marginTop: 12 },
    uploadHint: { color: '#9CA3AF', fontSize: 12, marginTop: 4 },
    loadingBox: { alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 12, color: '#2563EB', fontWeight: '500' },
    resultBox: { backgroundColor: 'white', padding: 20, borderRadius: 16, elevation: 2 },
    scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    scoreLabel: { fontSize: 16, fontWeight: 'bold', color: '#0A1F44' },
    scoreValue: { fontSize: 24, fontWeight: 'bold' },
    issuesTitle: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 12 },
    issueItem: { flexDirection: 'row', gap: 8, marginBottom: 8 },
    issueText: { flex: 1, color: '#1F2937', fontSize: 14 },
    fixBtn: { backgroundColor: '#0A1F44', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, marginTop: 16, gap: 8 },
    fixBtnText: { color: 'white', fontWeight: '600' }
});
