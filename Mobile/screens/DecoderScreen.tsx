import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { Languages, Volume2, ArrowRight, Zap, RefreshCw } from 'lucide-react-native';
import { CyberTheme } from '../constants/CyberTheme';
import { GeminiService } from '../services/Gemini';

export default function DecoderScreen() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDecode = async () => {
        if (!input.trim()) return;
        Keyboard.dismiss();
        setLoading(true);
        setOutput(''); // Clear previous output

        const prompt = `
            You are a Financial jargon simplification expert for Indian gig workers.
            Simplify the following financial, legal, or banking text into easy-to-understand 'Hinglish' (Hindi + English mix) or simple English.
            Focus on what it means for the user's money.
            
            Text to decode: "${input}"
            
            Format:
            🌟 *Meaning:* [Simple explanation]
            ⚠️ *Action:* [What the user needs to do, if anything]
        `;

        const response = await GeminiService.generateText(prompt);

        if (response) {
            setOutput(response);
        } else {
            Alert.alert("Error", "Could not decode text. Please check your internet.");
        }
        setLoading(false);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.title}>Financial Decoder</Text>
                <Text style={styles.subtitle}>Paste confusing bank SMS or policies below. We'll translate them into plain Hinglish.</Text>
            </View>

            <View style={styles.inputCard}>
                <TextInput
                    style={styles.inputArea}
                    placeholder="Paste text here (e.g. 'Your account is under lien for amount 5000')..."
                    placeholderTextColor={CyberTheme.colors.textDim}
                    multiline
                    numberOfLines={4}
                    value={input}
                    onChangeText={setInput}
                    textAlignVertical="top"
                />

                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.languageBtn}>
                        <Languages size={18} color={CyberTheme.colors.textSecondary} />
                        <Text style={styles.langText}>Hinglish Mode</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.decodeBtn, (!input.trim() || loading) && { opacity: 0.5 }]}
                        onPress={handleDecode}
                        disabled={loading || !input.trim()}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <>
                                <Text style={styles.decodeText}>Simplify</Text>
                                <Zap size={18} color="white" fill="white" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {output ? (
                <View style={styles.outputCard}>
                    <View style={styles.outputHeader}>
                        <Text style={styles.outputTitle}>Simplified Explanation</Text>
                        <Volume2 size={24} color={CyberTheme.colors.success} />
                    </View>
                    <Text style={styles.outputText}>{output}</Text>
                </View>
            ) : null}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: CyberTheme.colors.background },
    content: { padding: 24 },

    header: { marginBottom: 30 },
    title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 12 },
    subtitle: { color: CyberTheme.colors.textSecondary, fontSize: 16, lineHeight: 24 },

    inputCard: { backgroundColor: CyberTheme.colors.surface, borderRadius: 24, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    inputArea: { minHeight: 120, fontSize: 16, color: 'white', textAlignVertical: 'top' },

    actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },

    languageBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
    langText: { fontSize: 13, fontWeight: '600', color: CyberTheme.colors.textSecondary },

    decodeBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: CyberTheme.colors.primary, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16, shadowColor: CyberTheme.colors.primary, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
    decodeText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    outputCard: { backgroundColor: CyberTheme.colors.surface, padding: 24, borderRadius: 24, borderLeftWidth: 4, borderLeftColor: CyberTheme.colors.success, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    outputHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    outputTitle: { fontSize: 18, fontWeight: 'bold', color: CyberTheme.colors.success },
    outputText: { fontSize: 16, lineHeight: 26, color: 'white' }
});
