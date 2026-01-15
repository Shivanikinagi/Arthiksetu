import { PermissionsAndroid, Platform, Alert, Modal, TextInput } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import api from '../api';
import { GlassInput } from '../components/GlassComponents';
import React, { useState } from 'react'; // Added React import
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FileText, ArrowRight } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard, GlassButton } from '../components/GlassComponents';

const MESSAGES = [
    { sender: 'BW-HDFCBK', body: 'A/c XX1234 Credited with INR 25000.00 on 12-MAR-24. Info: SALARY.', amount: 25000, type: 'credit' },
    { sender: 'JM-SWIGGY', body: 'Payment of INR 540.00 received for Order #8842.', amount: 540, type: 'credit' },
    { sender: 'AX-UPI', body: 'Debited INR 200.00 for UPI Ref 8492.', amount: 200, type: 'debit' },
];

export default function SMSAnalyzerScreen({ onBack }: { onBack?: () => void }) {
    const [messages, setMessages] = useState<any[]>(MESSAGES);
    const [loading, setLoading] = useState(false);
    const [manualModal, setManualModal] = useState(false);
    const [manualText, setManualText] = useState("");

    const handleSync = async () => {
        if (Platform.OS !== 'android') {
            setManualModal(true);
            return;
        }

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                {
                    title: "SMS Permission",
                    message: "ArthikSetu needs access to your SMS to track earnings.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setLoading(true);
                const filter = {
                    box: 'inbox',
                    maxCount: 50,
                };

                SmsAndroid.list(
                    JSON.stringify(filter),
                    (fail: any) => {
                        setLoading(false);
                        console.log('Failed to read SMS: ' + fail);
                        Alert.alert("Error", "Could not read SMS. Try manual entry.");
                        setManualModal(true);
                    },
                    async (count: any, smsList: string) => {
                        const arr = JSON.parse(smsList);
                        const financeKeywords = ['credited', 'debited', 'acct', 'a/c', 'upi', 'neft', 'imps', 'salary', 'received', 'sent'];
                        const relevant = arr.filter((m: any) => financeKeywords.some(k => m.body.toLowerCase().includes(k))).map((m: any) => m.body);

                        try {
                            const res = await api.uploadSMS(relevant);
                            const newMsgs = res.transactions.map((t: any) => ({
                                sender: 'Parsed',
                                body: t.raw.substring(0, 50) + '...',
                                amount: t.amount,
                                type: t.type
                            }));
                            setMessages(newMsgs);
                            Alert.alert("Sync Complete", `Found ${res.transactions.length} financial transactions.`);
                        } catch (e) {
                            Alert.alert("Backend Error", "Could not analyze SMS.");
                        } finally {
                            setLoading(false);
                        }
                    },
                );
            } else {
                setManualModal(true);
            }
        } catch (err) {
            setManualModal(true);
        }
    };

    const handleManualSubmit = async () => {
        if (!manualText) return;
        setLoading(true);
        try {
            const msgs = [manualText];
            const res = await api.uploadSMS(msgs);
            const newMsgs = res.transactions.map((t: any) => ({
                sender: 'Manual',
                body: t.raw,
                amount: t.amount,
                type: t.type
            }));
            setMessages(prev => [...newMsgs, ...prev]);
            setManualModal(false);
            setManualText("");
        } catch (e) {
            Alert.alert("Error", "Analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper title="SMS Analyzer" subtitle="AUTOMATED INCOME TRACKING" showBack onBack={onBack}>
            <View style={{ marginBottom: 20 }}>
                <Text style={{ color: '#94a3b8', textAlign: 'center', fontSize: 12 }}>
                    We scan transaction SMS to automate your income proof.
                </Text>
            </View>

            <View style={{ gap: 12 }}>
                {messages.map((msg, index) => (
                    <GlassCard key={index} intensity={15} style={{ flexDirection: 'row', gap: 16 }}>
                        <View style={[styles.iconBox, { backgroundColor: msg.type === 'credit' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)' }]}>
                            <FileText size={20} color={msg.type === 'credit' ? '#34d399' : '#f87171'} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={styles.sender}>{msg.sender}</Text>
                                <Text style={[styles.amount, { color: msg.type === 'credit' ? '#34d399' : '#f87171' }]}>
                                    {msg.type === 'credit' ? '+' : '-'}₹{msg.amount}
                                </Text>
                            </View>
                            <Text style={styles.body}>{msg.body}</Text>
                        </View>
                    </GlassCard>
                ))}
            </View>

            <View style={{ marginTop: 20 }}>
                <GlassButton title={loading ? "SYNCING..." : "SYNC SMS NOW"} onPress={handleSync} disabled={loading} />
            </View>

            <Modal visible={manualModal} transparent animationType="slide">
                <View style={styles.modalBackdrop}>
                    <GlassCard intensity={80} style={{ padding: 24 }}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Manual Entry</Text>
                        <Text style={{ color: '#94a3b8', marginBottom: 16 }}>We couldn't access SMS. Paste a transaction message here.</Text>

                        <GlassInput
                            value={manualText}
                            onChangeText={setManualText}
                            placeholder="e.g. A/c Credited with Rs 5000..."
                            multiline
                            numberOfLines={3}
                        />

                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                            <View style={{ flex: 1 }}><GlassButton title="CANCEL" onPress={() => setManualModal(false)} variant="secondary" /></View>
                            <View style={{ flex: 1 }}><GlassButton title="ANALYZE" onPress={handleManualSubmit} /></View>
                        </View>
                    </GlassCard>
                </View>
            </Modal>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    iconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    sender: { color: 'white', fontWeight: 'bold' },
    amount: { fontWeight: 'bold' },
    body: { color: '#94a3b8', fontSize: 12, lineHeight: 16 },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 }
});
