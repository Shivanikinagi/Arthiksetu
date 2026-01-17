import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Languages, Volume2, ArrowRight } from 'lucide-react-native';

export default function DecoderScreen() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleDecode = () => {
        if (!input.trim()) return;
        // Mock decoding logic
        setOutput(`Simplified: "${input}" \n\nExplanation: This legal term means that you are required to pay the specified amount before the deadline to avoid penalties.`);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Jargon Decoder</Text>
            <Text style={styles.subtitle}>Enter complex financial or legal terms, and we'll translate them into simple language.</Text>

            <View style={styles.inputCard}>
                <TextInput
                    style={styles.inputArea}
                    placeholder="Paste complex text here (e.g., 'Force Majeure clause')..."
                    multiline
                    numberOfLines={4}
                    value={input}
                    onChangeText={setInput}
                    textAlignVertical="top"
                />
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.languageBtn}>
                        <Languages size={16} color="#4B5563" />
                        <Text style={styles.langText}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.decodeBtn} onPress={handleDecode}>
                        <Text style={styles.decodeText}>Simplify</Text>
                        <ArrowRight size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {output ? (
                <View style={styles.outputCard}>
                    <View style={styles.outputHeader}>
                        <Text style={styles.outputTitle}>Simplified Explanation</Text>
                        <TouchableOpacity>
                            <Volume2 size={20} color="#2563EB" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.outputText}>{output}</Text>
                </View>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#F8F9FA' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0A1F44' },
    subtitle: { color: '#6B7280', marginTop: 8, marginBottom: 24 },
    inputCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, elevation: 1, marginBottom: 24 },
    inputArea: { minHeight: 100, fontSize: 16, color: '#1F2937' },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16 },
    languageBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, backgroundColor: '#F3F4F6', borderRadius: 8 },
    langText: { fontSize: 12, fontWeight: '500', color: '#4B5563' },
    decodeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0A1F44', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    decodeText: { color: 'white', fontWeight: 'bold' },
    outputCard: { backgroundColor: '#EFF6FF', padding: 20, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#2563EB' },
    outputHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    outputTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E3A8A' },
    outputText: { fontSize: 16, lineHeight: 24, color: '#1E3A8A' }
});
