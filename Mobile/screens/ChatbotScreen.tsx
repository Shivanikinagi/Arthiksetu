import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassInput } from '../components/GlassComponents';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../api';


export default function ChatbotScreen({ onBack }: { onBack?: () => void }) {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello Rahul! I'm ArthikSetu AI. How can I help you regarding loans, tax, or your savings today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            // Prepare history for API
            const history = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                content: m.text
            }));

            const data = await api.chatbot(userMsg.text, history);

            const botMsg = {
                id: Date.now() + 1,
                text: data.response || "I'm having trouble connecting to the server.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = {
                id: Date.now() + 1,
                text: "Network Error: Could not reach ArthikSetu Brain.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages]);

    return (
        <ScreenWrapper title="Arthik AI" subtitle="FINANCIAL ASSISTANT" scrollable={false} showBack onBack={onBack}>
            <View style={{ flex: 1 }}>
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                >
                    {messages.map((msg) => (
                        <View key={msg.id} style={[
                            styles.msgRow,
                            msg.sender === 'user' ? styles.msgRowUser : styles.msgRowBot
                        ]}>
                            {msg.sender === 'bot' && (
                                <View style={styles.botAvatar}>
                                    <Bot size={16} color="#22d3ee" />
                                </View>
                            )}

                            <LinearGradient
                                colors={msg.sender === 'user' ? ['#06b6d4', '#2563eb'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']}
                                style={[styles.bubble, msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot]}
                            >
                                <Text style={styles.msgText}>{msg.text}</Text>
                            </LinearGradient>
                        </View>
                    ))}

                    {isLoading && (
                        <View style={[styles.msgRow, styles.msgRowBot]}>
                            <View style={styles.botAvatar}>
                                <Bot size={16} color="#22d3ee" />
                            </View>
                            <LinearGradient colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']} style={[styles.bubble, styles.bubbleBot]}>
                                <Text style={[styles.msgText, { fontStyle: 'italic', color: '#94a3b8' }]}>Thinking...</Text>
                            </LinearGradient>
                        </View>
                    )}
                </ScrollView>


                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
                    <BlurView intensity={30} tint="dark" style={styles.inputArea}>
                        <GlassInput
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Ask about loans..."
                            style={{ flex: 1, marginBottom: 0, borderRadius: 25 }}
                        />
                        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
                            <LinearGradient colors={['#06b6d4', '#2563eb']} style={styles.sendGradient}>
                                <Send size={20} color="white" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </BlurView>
                </KeyboardAvoidingView>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    msgRow: { flexDirection: 'row', marginBottom: 20, maxWidth: '85%' },
    msgRowUser: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
    msgRowBot: { alignSelf: 'flex-start' },

    botAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(34, 211, 238, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 8, marginTop: -8 },

    bubble: { padding: 14, borderRadius: 20 },
    bubbleUser: { borderBottomRightRadius: 4 },
    bubbleBot: { borderTopLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },

    msgText: { color: 'white', lineHeight: 22 },

    inputArea: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
    sendBtn: { marginTop: -16 }, // Offset the glass input margin
    sendGradient: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }
});
