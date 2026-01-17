import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { Send, Bot, User, Sparkles, Zap } from 'lucide-react-native';

// --- CONFIGURATION ---
// To use a real LLM (Gemini/OpenAI), set this to true and add your API Key.
// --- CONFIGURATION ---
// 1. Get a free API Key here: https://aistudio.google.com/app/apikey
// 2. Paste it below inside the quotes.
const API_KEY = "AIzaSyBOmRJQ8Q21Ln5FvpHx8sglC6CsyeTqcPA";
const SYSTEM_PROMPT = "You are ArthikSetu, an expert financial assistant for Indian Gig workers. Answer queries like 'What is GST?', 'How to save tax?', 'Best SIP'. Output concise, accurate Indian context answers. Avoid generic advice.";

// --- CLOUD INTELLIGENCE (Google Gemini) ---
const callGeminiAPI = async (query: string): Promise<string | null> => {
    if (!API_KEY) return null;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + query }]
                }]
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        }
        return null;
    } catch (error) {
        console.log("LLM Error:", error);
        return null;
    }
};

const USE_REAL_API = true;

const INITIAL_MESSAGES = [
    { id: '1', text: 'Namaste! Main ArthikSetu AI hoon. 🤖\n\nI can answer ANY financial question using my LLM Brain.\n\nTry asking: "How do I invest ₹500 in stocks?" or "Explain GST rates".', sender: 'bot' },
];

const QUICK_PROMPTS = [
    "Tax save kaise kare?",
    "Verify my documents",
    "Explain 'Lien' amount",
    "Eligible schemes?"
];

// --- LOCAL INTELLIGENCE ENGINE (Advanced NLP) ---
const getLocalAIResponse = (query: string): string => {
    const text = query.toLowerCase();

    // --- 1. PERSONALITY & GREETINGS ---
    if (text.match(/hello|hi |hey|namaste/)) return "Namaste! 🙏\n\nI am ready to help you with your finances. Ask me anything!";
    if (text.match(/how are you|how r u/)) return "I am functioning at 100% capacity! 🚀 Ready to calculate your taxes or find schemes.";
    if (text.match(/who are you|your name/)) return "I am **ArthikSetu AI**, your personal financial assistant designed for the Gig Economy.";
    if (text.match(/thank/)) return "You're welcome! Happy to help. 😊";
    if (text.match(/morning|evening|night/)) return "Good " + (text.match(/morning|evening|night/) || ["day"])[0] + "! Hope you have a productive day ahead.";
    if (text.match(/joke|funny/)) return "Why did the banker break up with his calculator? \n\nBecause he couldn't count on it anymore! 😂";

    // --- 2. APP USAGE & ONBOARDING (Meta Queries) ---
    if (text.match(/use this app|how to use|guide|help|tutorial|what to do|features|work/)) {
        return "Here is your quick guide to **ArthikSetu**: \n\n" +
            "1. 🏠 **Dashboard**: Track your daily earnings from Swiggy/Zomato.\n" +
            "2. ✅ **Verify**: Upload Aadhaar/PAN to get a Blue Tick.\n" +
            "3. 📜 **Schemes**: Find govt benefits you are eligible for.\n" +
            "4. 🤖 **SMS AI**: Auto-track expenses without typing.\n" +
            "5. 💬 **Chat**: Ask me anything about Tax or Loans!";
    }

    // --- 3. APP FEATURES (Deep Linking Guidance) - REMOVED ---
    // Removed to allow Real LLM to handle "tax", "gst", "money" queries intelligently.
    // The bot will now only give app-specific help if strictly asked about "app features" logic (covered in section 2).

    // --- 4. GENERAL FINANCIAL KNOWLEDGE (OFFLINE FALLBACK) ---
    // This only runs if the Real Cloud API fails (returns null).
    // It ensures the user gets *some* answer instead of just an error message.
    if (text.includes('gst')) return "GST (Goods and Services Tax) is a single tax on the supply of goods and services. For Gig workers, it's usually not required unless income > ₹20 Lakhs/year.";
    if (text.includes('tax') || text.includes('it return')) return "Income Tax is applicable if you earn > ₹3 Lakhs (Old Regime) or > ₹7 Lakhs (New Regime). You can save tax using 80C (PPF/ELSS).";
    if (text.includes('kyc') || text.includes('verify')) return "KYC (Know Your Customer) requires your Aadhaar and PAN. You can upload them in the 'Verify' tab of this app.";
    if (text.includes('scheme') || text.includes('yojana')) return "Government Schemes like PM Mudra and E-Shram are great for gig workers. Check the 'Schemes' tab for details.";
    if (text.includes('liens') || text.includes('hold')) return "A 'Lien' means the bank has temporarily frozen some amount on your account, usually due to a dispute or unpaid dues.";

    // --- 5. SMART FALLBACK ---
    return "I am currently in **Offline Mode** 🔌 and couldn't reach Google Gemini.\n\nHowever, I can still help you with:\n- **GST Rules**\n- **Tax Limits**\n- **App Navigation**";
};


export default function ChatbotScreen() {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now().toString(), text: text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // AI PROCESSING
        try {
            // 1. Try Real Cloud LLM First
            const cloudResponse = await callGeminiAPI(text);

            // 2. Fallback to Local Brain if Cloud fails or no key
            const finalResponse = cloudResponse || getLocalAIResponse(text);

            const botMsg = { id: (Date.now() + 1).toString(), text: finalResponse, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = { id: (Date.now() + 1).toString(), text: "System Error. Falling back to local mode.", sender: 'bot' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages, isTyping]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <View style={styles.botIconCircle}>
                        <Sparkles size={20} color="white" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>ArthikSetu Assistant</Text>
                        <Text style={styles.headerSubtitle}>Powered by Custom LLM</Text>
                    </View>
                </View>
                {USE_REAL_API && <View style={styles.liveBadge}><Text style={styles.liveText}>LIVE</Text></View>}
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.chatContainer}
                ListFooterComponent={isTyping ? (
                    <View style={styles.typingBubble}>
                        <ActivityIndicator size="small" color="#6B7280" />
                        <Text style={styles.typingText}>ArthikSetu AI is thinking...</Text>
                    </View>
                ) : null}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageBubble,
                        item.sender === 'user' ? styles.userBubble : styles.botBubble
                    ]}>
                        {item.sender === 'bot' && (
                            <View style={styles.avatar}>
                                <Bot size={16} color="white" />
                            </View>
                        )}
                        <View style={[styles.bubbleContent, item.sender === 'user' ? styles.userContent : styles.botContent]}>
                            <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.botText]}>
                                {item.text}
                            </Text>
                        </View>
                    </View>
                )}
            />

            {/* Quick Prompts */}
            <View style={styles.promptsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
                    {QUICK_PROMPTS.map((prompt, idx) => (
                        <TouchableOpacity key={idx} style={styles.promptChip} onPress={() => sendMessage(prompt)}>
                            <Text style={styles.promptText}>{prompt}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask anything about your finances..."
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={() => sendMessage(inputText)}
                />
                <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(inputText)}>
                    <Send size={20} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5' },
    header: { padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingTop: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    botIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    headerSubtitle: { fontSize: 12, color: '#6B7280' },
    liveBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    liveText: { fontSize: 10, color: '#16A34A', fontWeight: 'bold' },

    chatContainer: { padding: 16, gap: 16, paddingBottom: 20 },
    messageBubble: { flexDirection: 'row', maxWidth: '85%', gap: 8 },
    userBubble: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
    botBubble: { alignSelf: 'flex-start' },

    avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center', marginTop: 4 },

    bubbleContent: { padding: 12, borderRadius: 16, elevation: 1 },
    userContent: { backgroundColor: '#7C3AED', borderBottomRightRadius: 4 },
    botContent: { backgroundColor: 'white', borderTopLeftRadius: 4 },

    messageText: { fontSize: 15, lineHeight: 22 },
    userText: { color: 'white' },
    botText: { color: '#1F2937' },

    typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 36, marginBottom: 12 },
    typingText: { fontSize: 12, color: '#6B7280', fontStyle: 'italic' },

    promptsContainer: { paddingVertical: 12, backgroundColor: '#F9FAFB' },
    promptChip: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
    promptText: { fontSize: 12, color: '#4B5563', fontWeight: '500' },

    inputContainer: { padding: 16, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
    input: { flex: 1, height: 48, backgroundColor: '#F3F4F6', borderRadius: 24, paddingHorizontal: 20, fontSize: 16, color: '#1F2937' },
    sendButton: { width: 48, height: 48, backgroundColor: '#7C3AED', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }
});
