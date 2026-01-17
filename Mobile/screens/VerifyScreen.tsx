import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Upload, CheckCircle, FileText, Clock, ScanFace, X, ShieldAlert, ChevronLeft } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native'; // Mocking useNavigation in Expo Router context if needed, or stick to simple prop

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

export default function VerifyScreen() {
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

    const startAISimulation = () => {
        setProcessing(true);
        setProcessingStep("Scanning Document Edges...");
        setTimeout(() => setProcessingStep("Reading " + (selectedType === 'aadhaar' ? "UIDAI Number" : "Permanent Account Number") + "..."), 1500);
        setTimeout(() => setProcessingStep("Cross-referencing with Gov Database..."), 3000);
        setTimeout(() => setProcessingStep("Verifying Hologram & Seal..."), 4500);

        setTimeout(() => {
            const newDoc = {
                id: Date.now().toString(),
                name: selectedType === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card',
                status: 'Verified',
                date: 'Just Now',
                size: formatSize(tempFile.size || 0)
            };
            setDocuments(prev => [newDoc, ...prev]);
            setProcessing(false);
            Alert.alert("Verified ✅", `Your ${selectedType === 'aadhaar' ? 'Aadhaar' : 'PAN'} has been successfully verified!`);
        }, 6000);
    };

    return (
        <View style={styles.container}>
            {/* 1. CURVED HEADER */}
            <View style={styles.headerCurve}>
                <View style={styles.headerTopBar}>
                    <Text style={styles.headerTitle}>VERIFICATION CENTER</Text>
                </View>
            </View>

            {/* 2. FLOATING CARD (Status / Instructions) */}
            <View style={styles.floatingCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconCircle}>
                        <ScanFace size={24} color="#F59E0B" />
                    </View>
                    <View>
                        <Text style={styles.cardTitle}>KYC Status</Text>
                        <Text style={styles.cardSubtitle}>Get Verified for Loans</Text>
                    </View>
                </View>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '66%' }]} />
                    </View>
                    <Text style={styles.progressText}>2/3 Documents Verified</Text>
                </View>
            </View>

            {/* 3. MAIN CONTENT */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <Text style={styles.sectionHeader}>Select Document Type</Text>
                <View style={styles.typeRow}>
                    <TouchableOpacity
                        style={[styles.typeChip, selectedType === 'aadhaar' && styles.typeChipActive]}
                        onPress={() => setSelectedType('aadhaar')}
                    >
                        <Text style={[styles.typeText, selectedType === 'aadhaar' && styles.typeTextActive]}>Aadhaar</Text>
                        {selectedType === 'aadhaar' && <CheckCircle size={14} color="#10B981" />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeChip, selectedType === 'pan' && styles.typeChipActive]}
                        onPress={() => setSelectedType('pan')}
                    >
                        <Text style={[styles.typeText, selectedType === 'pan' && styles.typeTextActive]}>PAN Card</Text>
                        {selectedType === 'pan' && <CheckCircle size={14} color="#10B981" />}
                    </TouchableOpacity>
                </View>

                {/* Upload Area */}
                <TouchableOpacity style={styles.uploadArea} onPress={pickDocument} disabled={processing}>
                    <View style={styles.uploadIconCircle}>
                        <Upload size={28} color="#10B981" />
                    </View>
                    <Text style={styles.uploadText}>Tap to Upload {selectedType === 'aadhaar' ? 'Aadhaar' : 'PAN'}</Text>
                    <Text style={styles.uploadSubText}>Supports JPG, PNG, PDF (Max 5MB)</Text>
                </TouchableOpacity>

                {/* Recent Docs */}
                <Text style={styles.sectionHeader}>Verified Documents</Text>
                <View style={styles.docsList}>
                    {documents.map((doc) => (
                        <View key={doc.id} style={styles.docItem}>
                            <View style={[styles.docIconBox, { backgroundColor: doc.status === 'Verified' ? '#ECFDF5' : '#FEF3C7' }]}>
                                {doc.status === 'Verified' ? <CheckCircle size={20} color="#10B981" /> : <Clock size={20} color="#F59E0B" />}
                            </View>
                            <View style={styles.docInfo}>
                                <Text style={styles.docName}>{doc.name}</Text>
                                <Text style={styles.docMeta}>{doc.size} • {doc.date}</Text>
                            </View>
                            <View style={styles.statusTag}>
                                <Text style={[styles.statusTagText, { color: doc.status === 'Verified' ? '#10B981' : '#F59E0B' }]}>
                                    {doc.status.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>

            {/* MODALS (Kept same logic, just styled inputs) */}
            <Modal visible={inputModalVisible} transparent animationType="slide">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBackdrop}>
                    <View style={styles.inputCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.inputTitle}>Verify ID Number</Text>
                            <TouchableOpacity onPress={() => setInputModalVisible(false)}><X size={24} color="#6B7280" /></TouchableOpacity>
                        </View>
                        <Text style={styles.inputDesc}>Enter the unique number found on your document.</Text>
                        <TextInput
                            style={styles.inputField}
                            placeholder={selectedType === 'aadhaar' ? "12 Digit Number" : "Pan Number (ABCDE...)"}
                            value={idNumber}
                            onChangeText={setIdNumber}
                            keyboardType={selectedType === 'aadhaar' ? 'numeric' : 'default'}
                            maxLength={selectedType === 'aadhaar' ? 12 : 10}
                            autoCapitalize="characters"
                        />
                        <TouchableOpacity style={styles.verifyBtn} onPress={runVerification}>
                            <Text style={styles.verifyBtnText}>VERIFY NOW</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal visible={processing} transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color="#10B981" />
                        <Text style={styles.loadingText}>{processingStep}</Text>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },

    // Header Curve
    headerCurve: {
        height: 150,
        backgroundColor: '#1F2937',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 40,
        alignItems: 'center',
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1
    },
    headerTopBar: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerTitle: { color: 'white', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },

    // Floating Card
    floatingCard: {
        marginTop: 100, // Push down to overlap
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 8,
        zIndex: 2,
        marginBottom: 20
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
    iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    cardSubtitle: { fontSize: 12, color: '#6B7280' },
    progressContainer: { marginTop: 4 },
    progressBar: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 3 },
    progressText: { fontSize: 10, color: '#6B7280', fontWeight: 'bold', textAlign: 'right' },

    // Content
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 10 },
    sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },

    typeRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    typeChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB' },
    typeChipActive: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
    typeText: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
    typeTextActive: { color: '#10B981' },

    uploadArea: { backgroundColor: 'white', borderRadius: 24, borderStyle: 'dashed', borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', padding: 32, marginBottom: 32 },
    uploadIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    uploadText: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
    uploadSubText: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },

    // Docs List
    docsList: { gap: 12 },
    docItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, elevation: 1 },
    docIconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    docInfo: { flex: 1 },
    docName: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
    docMeta: { fontSize: 12, color: '#9CA3AF' },
    statusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#F3F4F6' },
    statusTagText: { fontSize: 10, fontWeight: 'bold' },

    // Modal
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    inputCard: { backgroundColor: 'white', borderRadius: 24, padding: 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    inputTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    inputDesc: { fontSize: 12, color: '#6B7280', marginBottom: 20 },
    inputField: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, fontSize: 18, fontWeight: 'bold', color: '#1F2937', letterSpacing: 2, marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB' },
    verifyBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center' },
    verifyBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },

    loadingCard: { backgroundColor: 'white', borderRadius: 24, padding: 32, alignItems: 'center', margin: 40 },
    loadingText: { marginTop: 16, fontSize: 14, fontWeight: '600', color: '#374151' }
});
