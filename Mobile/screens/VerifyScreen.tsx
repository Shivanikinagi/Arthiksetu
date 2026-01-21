import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Upload, CheckCircle, Clock, Shield, ScanFace } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import { CyberTheme } from '../constants/CyberTheme';
import { GeminiService } from '../services/Gemini';

const MOCK_DOCS = [
    { id: '1', name: 'Aadhaar Card', status: 'Verified', date: '12 Jan 2024', size: '2.4 MB' },
    { id: '2', name: 'PAN Card', status: 'Verified', date: '10 Jan 2024', size: '1.1 MB' },
];

export default function VerifyScreen() {
    const [documents, setDocuments] = useState(MOCK_DOCS);
    const [processing, setProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState("Initializing AI...");
    const [selectedType, setSelectedType] = useState<'aadhaar' | 'pan'>('aadhaar');
    const [verificationResult, setVerificationResult] = useState<string | null>(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: ['image/jpeg', 'image/png'], copyToCacheDirectory: true });

            if (result.canceled) return;

            const file = result.assets[0];

            // Check size (Gemini has limits, keep it reasonable approx < 4MB)
            if (file.size && file.size > 4 * 1024 * 1024) {
                Alert.alert("File too large", "Please upload an image smaller than 4MB");
                return;
            }

            processDocument(file.uri, selectedType);

        } catch (err) {
            console.log(err);
            Alert.alert("Error", "Could not pick document");
        }
    };

    const processDocument = async (uri: string, type: string) => {
        setProcessing(true);
        setVerificationResult(null);

        try {
            setProcessingStep(`Reading ${type.toUpperCase()}...`);

            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

            setProcessingStep("Verifying Details with AI...");

            const prompt = `
                Analyze this image. Is this a valid Indian ${type === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card'}?
                Extract the Name and ID Number if visible.
                
                Return ONLY a JSON string like:
                { "isValid": true, "name": "John Doe", "id": "XXXX-XXXX", "reason": "Clear document" }
                
                If not valid or unclear, set isValid: false.
            `;

            const aiResponse = await GeminiService.analyzeImage(base64, prompt);

            setProcessing(false);

            if (aiResponse) {
                // Parse AI Response
                // Simple parsing logic since AI might wrap in markdown
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[0]);
                    if (data.isValid) {
                        const newDoc = {
                            id: Date.now().toString(),
                            name: `${type === 'aadhaar' ? 'Aadhaar' : 'PAN'} - ${data.name || 'User'}`,
                            status: 'Verified',
                            date: 'Just Now',
                            size: 'Image'
                        };
                        setDocuments(prev => [newDoc, ...prev]);
                        Alert.alert("Verified!", `Successfully verified ${type.toUpperCase()}.\nName: ${data.name}`);
                    } else {
                        Alert.alert("Verification Failed", data.reason || "Document unclear or invalid.");
                    }
                } else {
                    Alert.alert("AI Error", "Could not verify document details.");
                }
            } else {
                Alert.alert("Server Error", "Could not reach Verification Server.");
            }

        } catch (err) {
            console.log(err);
            setProcessing(false);
            Alert.alert("Error", "Failed to process image.");
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <Text style={styles.pageTitle}>Verification Center</Text>

            {/* STATUS CARD */}
            <LinearGradient colors={CyberTheme.colors.gradientCyan} style={styles.statusCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconBox}><Shield size={28} color="white" /></View>
                    <View>
                        <Text style={styles.cardTitle}>KYC Status: Pending</Text>
                        <Text style={styles.cardSub}>Upload 1 more doc to unlock loans</Text>
                    </View>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={styles.progressBarFill} />
                </View>
                <Text style={styles.progressText}>{documents.length}/3 Documents Verified</Text>
            </LinearGradient>

            <Text style={styles.sectionHeader}>Select Document Type</Text>
            <View style={styles.typeRow}>
                {['aadhaar', 'pan'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[styles.typeChip, selectedType === type && styles.typeChipActive]}
                        onPress={() => setSelectedType(type as any)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.typeText, selectedType === type && styles.typeTextActive]}>
                            {type === 'aadhaar' ? 'Aadhaar' : 'PAN Card'}
                        </Text>
                        {selectedType === type && <CheckCircle size={16} color={CyberTheme.colors.success} />}
                    </TouchableOpacity>
                ))}
            </View>

            {/* UPLOAD AREA */}
            <TouchableOpacity style={styles.uploadArea} onPress={pickDocument} disabled={processing}>
                <View style={[styles.uploadIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Upload size={36} color={CyberTheme.colors.success} />
                </View>
                <Text style={styles.uploadText}>Tap to Scan {selectedType === 'aadhaar' ? 'Aadhaar' : 'PAN'}</Text>
                <Text style={styles.uploadSub}>We use AI to extract details automatically.</Text>
            </TouchableOpacity>

            {/* RECENT DOCS */}
            <Text style={styles.sectionHeader}>Verified Documents</Text>
            <View style={styles.docList}>
                {documents.map((doc) => (
                    <View key={doc.id} style={styles.docItem}>
                        <View style={[styles.docIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                            <CheckCircle size={22} color={CyberTheme.colors.success} />
                        </View>
                        <View style={styles.docInfo}>
                            <Text style={styles.docName}>{doc.name}</Text>
                            <Text style={styles.docMeta}>{doc.date} • {doc.size}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{doc.status}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <Modal visible={processing} transparent>
                <View style={styles.modalBackdrop}>
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color={CyberTheme.colors.primary} />
                        <Text style={styles.loadingText}>{processingStep}</Text>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: CyberTheme.colors.background },
    content: { padding: 24, paddingBottom: 100 },

    pageTitle: { fontSize: 26, fontWeight: 'bold', color: 'white', marginBottom: 24 },

    statusCard: { padding: 24, borderRadius: 24, marginBottom: 32 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
    iconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
    cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    cardSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
    progressBarBg: { height: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, marginBottom: 10 },
    progressBarFill: { width: '66%', height: '100%', backgroundColor: 'white', borderRadius: 4 },
    progressText: { color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'right' },

    sectionHeader: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },

    typeRow: { flexDirection: 'row', gap: 16, marginBottom: 28 },
    typeChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16, backgroundColor: CyberTheme.colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    typeChipActive: { borderColor: CyberTheme.colors.success, backgroundColor: 'rgba(16, 185, 129, 0.15)' },
    typeText: { color: CyberTheme.colors.textSecondary, fontWeight: '600', fontSize: 15 },
    typeTextActive: { color: 'white', fontWeight: 'bold' },

    uploadArea: { backgroundColor: CyberTheme.colors.surface, borderRadius: 24, borderStyle: 'dashed', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', padding: 40, marginBottom: 32 },
    uploadIconCircle: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    uploadText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
    uploadSub: { color: CyberTheme.colors.textSecondary, fontSize: 13 },

    docList: { gap: 16 },
    docItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: CyberTheme.colors.surface, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    docIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    docInfo: { flex: 1 },
    docName: { color: 'white', fontWeight: 'bold', fontSize: 15 },
    docMeta: { color: CyberTheme.colors.textSecondary, fontSize: 13, marginTop: 2 },
    statusBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    statusText: { color: CyberTheme.colors.success, fontSize: 11, fontWeight: 'bold' },

    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 24 },
    loadingCard: { backgroundColor: CyberTheme.colors.surface, padding: 40, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    loadingText: { color: 'white', marginTop: 20, fontSize: 16, fontWeight: '600' }
});
