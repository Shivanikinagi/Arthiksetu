import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassInput, GlassButton, GlassCard } from '../components/GlassComponents';
import { Sparkles } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';
import api from '../api';

export default function DecoderScreen({ onBack }: { onBack?: () => void }) {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<string | null>(null);


    const [loading, setLoading] = useState(false);

    const handleDecode = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const data = await api.decoder(input);
            setResult(data.decoded || "Could not decode message. Try again.");
        } catch (e) {
            setResult("Error: Backend is offline.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper title="Message Decoder" subtitle="SIMPLIFY BANK ALERTS" showBack onBack={onBack}>
            <GlassInput
                placeholder="Paste confusing bank SMS here..."
                multiline
                numberOfLines={4}
                value={input}
                onChangeText={setInput}
                style={{ height: 100, textAlignVertical: 'top' }}
            />

            {loading ? (
                <View style={{ marginBottom: 30, alignItems: 'center' }}>
                    <ActivityIndicator color="#22d3ee" />
                </View>
            ) : (
                <GlassButton title="DECODE MESSAGE" onPress={handleDecode} style={{ marginBottom: 30 }} />
            )}

            {result && (
                <GlassCard intensity={25} style={{ borderColor: '#22d3ee', borderWidth: 1 }}>
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                        <Sparkles size={20} color="#22d3ee" />
                        <Text style={{ color: '#22d3ee', fontWeight: 'bold' }}>AI Explanation</Text>
                    </View>
                    <Text style={{ color: 'white', lineHeight: 22 }}>{result}</Text>
                </GlassCard>
            )}
        </ScreenWrapper>
    );
}
