import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Upload, CheckCircle, Clock, ScanFace, X, ShieldAlert, CheckCircle2 } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadFile } from '../api';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard, GlassButton, GlassInput, SectionTitle } from '../components/GlassComponents';

const { width } = Dimensions.get('window');

const MOCK_DOCS = [
    { id: '1', name: 'Aadhaar Card', status: 'Verified', date: '12 Jan 2024', size: '2.4 MB' },
    { id: '2', name: 'PAN Card', status: 'Verified', date: '10 Jan 2024', size: '1.1 MB' },
];

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function VerifyScreen({ onBack }: { onBack?: () => void }) {
    const [documents, setDocuments] = useState(MOCK_DOCS);
    const [processing, setProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState("Initializing Vision AI...");

    // Logic for Real Verification
    const [selectedType, setSelectedType] = useState<'aadhaar' | 'pan'>('aadhaar');
    const [tempFile, setTempFile] = useState<any>(null);
    const [inputModalVisible, setInputModalVisible] = useState(false);
    const [idNumber, setIdNumber] = useState('');

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
                copyToCacheDirectory: true
            });

            if (result.canceled) return;
            const file = result.assets[0];

            if (file.size && file.size > 5 * 1024 * 1024) {
                Alert.alert("File Too Large", "Max 5MB allowed.");
                return;
            }

            setTempFile(file);
            setInputModalVisible(true);

        } catch (err) {
            console.log('Error: ', err);
        }
    };

    const runVerification = () => {
        let isValid = false;
        let errorMessage = "";

        if (selectedType === 'aadhaar') {
            isValid = /^\d{12}$/.test(idNumber.trim());
            errorMessage = "Invalid Aadhaar Number. It must be exactly 12 digits.";
        } else {
            isValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(idNumber.trim().toUpperCase());
            errorMessage = "Invalid PAN format. Example: ABCDE1234F";
        }

        if (!isValid) {
            Alert.alert("Verification Failed ❌", errorMessage);
            return;
        }

        setInputModalVisible(false);
        setIdNumber("");
        startAISimulation();
    };

    const startAISimulation = async () => {
        setProcessing(true);
        setProcessingStep("Uploading to ArthikCloud...");

        try {
            // Mock steps for UX
            setTimeout(() => setProcessingStep("AI Vision Analysis..."), 1000);

            const docTypeLabel = selectedType === 'aadhaar' ? 'Aadhaar' : 'PAN Card';
            if (!tempFile) {
                throw new Error("No file selected");
            }

            const response = await uploadFile(tempFile.uri, tempFile.mimeType, tempFile.name, docTypeLabel);

            if (response.status === 'verified' || response.status === 'success') {
                const newDoc = {
                    id: Date.now().toString(),
                    name: docTypeLabel,
                    status: 'Verified',
                    date: new Date().toLocaleDateString(),
                    size: formatSize(tempFile.size || 0)
                };
                setDocuments(prev => [newDoc, ...prev]);
                Alert.alert("Verified ✅", `${docTypeLabel} Verified! Extracted ID: ${response.feature_extracted || response.extracted_id || 'N/A'}`);
            } else {
                Alert.alert("Verification Failed", response.message || "Could not verify document.");
            }

        } catch (error: any) {
            Alert.alert("Error", "Upload failed: " + error.message);
        } finally {
            setProcessing(false);
            setTempFile(null);
        }
    };

    return (
        <ScreenWrapper title="Verification Level 2" subtitle="KYC COMPLIANCE" showBack onBack={onBack}>

            {/* Status Card */}
            <GlassCard intensity={30} style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={styles.iconCircle}>
                        <ScanFace size={24} color="#f59e0b" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>KYC Status: <Text style={{ color: '#f59e0b' }}>Pending</Text></Text>
                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: '66%' }]} />
                        </View>
                        <Text style={styles.progressText}>2/3 Documents Verified</Text>
                    </View>
                </View>
            </GlassCard>

            <SectionTitle title="Select Document Type" />
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
                <TouchableOpacity
                    style={[styles.typeChip, selectedType === 'aadhaar' && styles.typeChipActive]}
                    onPress={() => setSelectedType('aadhaar')}
                >
                    <Text style={[styles.typeText, selectedType === 'aadhaar' && styles.typeTextActive]}>Aadhaar</Text>
                    {selectedType === 'aadhaar' && <CheckCircle2 size={16} color="#22d3ee" />}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.typeChip, selectedType === 'pan' && styles.typeChipActive]}
                    onPress={() => setSelectedType('pan')}
                >
                    <Text style={[styles.typeText, selectedType === 'pan' && styles.typeTextActive]}>PAN Card</Text>
                    {selectedType === 'pan' && <CheckCircle2 size={16} color="#22d3ee" />}
                </TouchableOpacity>
            </View>

            {/* Upload Area */}
            <TouchableOpacity onPress={pickDocument} disabled={processing}>
                <GlassCard intensity={10} style={styles.uploadArea}>
                    <View style={styles.uploadIconCircle}>
                        <Upload size={28} color="#22d3ee" />
                    </View>
                    <Text style={styles.uploadTitle}>Tap to Scanner</Text>
                    <Text style={styles.uploadSubtitle}>Upload {selectedType === 'aadhaar' ? 'Aadhaar' : 'PAN'} (Max 5MB)</Text>
                </GlassCard>
            </TouchableOpacity>

            <SectionTitle title="Verified Database" />
            <View style={{ gap: 12 }}>
                {documents.map((doc) => (
                    <GlassCard key={doc.id} intensity={15} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.docIcon, { backgroundColor: doc.status === 'Verified' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)' }]}>
                            {doc.status === 'Verified' ? <CheckCircle2 size={20} color="#34d399" /> : <Clock size={20} color="#fbbf24" />}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.docName}>{doc.name}</Text>
                            <Text style={styles.docMeta}>{doc.size} • {doc.date}</Text>
                        </View>
                        <Text style={{ color: '#34d399', fontSize: 10, fontWeight: 'bold' }}>VERIFIED</Text>
                    </GlassCard>
                ))}
            </View>

            {/* Input Modal */}
            <Modal visible={inputModalVisible} transparent animationType="slide">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackdrop}>
                    <GlassCard intensity={80} style={{ padding: 24 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Text style={styles.modalTitle}>Verify ID Number</Text>
                            <TouchableOpacity onPress={() => setInputModalVisible(false)}><X color="white" size={24} /></TouchableOpacity>
                        </View>
                        <Text style={{ color: '#94a3b8', marginBottom: 20 }}>Enter unique ID found on your document.</Text>

                        <GlassInput
                            placeholder={selectedType === 'aadhaar' ? "12 Digit Number" : "PAN (ABCDE1234F)"}
                            value={idNumber}
                            onChangeText={setIdNumber}
                            keyboardType={selectedType === 'aadhaar' ? 'numeric' : 'default'}
                            maxLength={selectedType === 'aadhaar' ? 12 : 10}
                            autoCapitalize="characters"
                            icon={<ShieldAlert size={18} color="#94a3b8" />}
                        />

                        <GlassButton title="VERIFY NOW" onPress={runVerification} variant="primary" />
                    </GlassCard>
                </KeyboardAvoidingView>
            </Modal>

            {/* Loading Modal */}
            <Modal visible={processing} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <GlassCard intensity={90} style={{ padding: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#22d3ee" />
                        <Text style={{ marginTop: 20, color: 'white', fontWeight: 'bold' }}>{processingStep}</Text>
                    </GlassCard>
                </View>
            </Modal>

        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(245, 158, 11, 0.1)', alignItems: 'center', justifyContent: 'center' },
    cardTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 6 },
    progressFill: { height: '100%', backgroundColor: '#f59e0b', borderRadius: 2 },
    progressText: { color: '#94a3b8', fontSize: 10, textAlign: 'right' },

    typeChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' },
    typeChipActive: { borderColor: '#22d3ee', backgroundColor: 'rgba(6, 182, 212, 0.1)' },
    typeText: { color: '#94a3b8', fontWeight: '600' },
    typeTextActive: { color: '#22d3ee' },

    uploadArea: { alignItems: 'center', justifyContent: 'center', padding: 32, borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(34, 211, 238, 0.3)' },
    uploadIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(34, 211, 238, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    uploadTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    uploadSubtitle: { color: '#64748b', fontSize: 12, marginTop: 4 },

    docIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    docName: { color: 'white', fontWeight: '600' },
    docMeta: { color: '#64748b', fontSize: 11 },

    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
    modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
