import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FileText, ArrowRight, Upload, AlertTriangle } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard, GlassButton, SectionTitle } from '../components/GlassComponents';

export default function AnalyzerScreen({ onBack }: { onBack?: () => void }) {
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
        <ScreenWrapper title="Document Analyzer" subtitle="AI HEALTH CHECK" showBack onBack={onBack}>
            <View style={{ marginBottom: 20 }}>
                <Text style={{ color: '#94a3b8', textAlign: 'center' }}>Upload financial documents for instant AI analysis.</Text>
            </View>

            <TouchableOpacity onPress={pickAndAnalyze} disabled={analyzing}>
                <GlassCard intensity={15} style={styles.uploadBox}>
                    <FileText size={40} color="#22d3ee" />
                    <Text style={styles.uploadText}>{fileName || "Select PDF Document"}</Text>
                    <Text style={styles.uploadHint}>Tap to browse files</Text>
                </GlassCard>
            </TouchableOpacity>

            {analyzing && (
                <GlassCard intensity={20} style={styles.loadingBox}>
                    <ActivityIndicator size="large" color="#22d3ee" />
                    <Text style={styles.loadingText}>AI is analyzing your document...</Text>
                </GlassCard>
            )}

            {result && !analyzing && (
                <View>
                    <GlassCard intensity={20} style={{ marginBottom: 20 }}>
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreLabel}>Health Score</Text>
                            <Text style={[styles.scoreValue, { color: result.score > 70 ? '#34d399' : '#f87171' }]}>{result.score}/100</Text>
                        </View>
                    </GlassCard>

                    <SectionTitle title="Detected Issues" />
                    <View style={{ gap: 12 }}>
                        {result.issues.map((issue, index) => (
                            <GlassCard key={index} intensity={10} style={{ flexDirection: 'row', gap: 12, padding: 16 }}>
                                <AlertTriangle size={16} color="#fbbf24" style={{ marginTop: 2 }} />
                                <Text style={styles.issueText}>{issue}</Text>
                            </GlassCard>
                        ))}
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <GlassButton title="VIEW DETAILED REPORT" onPress={() => { }} />
                    </View>
                </View>
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    uploadBox: { alignItems: 'center', padding: 32, borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(34, 211, 238, 0.3)', marginBottom: 24 },
    uploadText: { fontSize: 16, fontWeight: 'bold', color: 'white', marginTop: 12 },
    uploadHint: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
    loadingBox: { alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 12, color: '#22d3ee', fontWeight: '500' },
    scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    scoreLabel: { fontSize: 16, fontWeight: 'bold', color: 'white' },
    scoreValue: { fontSize: 24, fontWeight: 'bold' },
    issueText: { flex: 1, color: '#e2e8f0', fontSize: 14 }
});
