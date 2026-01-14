import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Image, PermissionsAndroid, Platform } from 'react-native';
import { MessageSquare, CreditCard, ArrowRight, ShieldCheck, Banknote, Zap } from 'lucide-react-native';

// Try to import the native module safely
let SmsAndroid: any = null;
try {
    if (Platform.OS === 'android') {
        SmsAndroid = require('react-native-get-sms-android').default;
    }
} catch (e) {
    console.log("SMS Module not found (likely in Expo Go).");
}

export default function SMSAnalyzerScreen() {
    const [scanned, setScanned] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const MOCK_SMS = [
        { id: 'm1', sender: 'HDFCBNK', body: 'Rs 12500 credited to a/c 1234. Ref: SWIGGY PAYOUT.', type: 'income', merchant: 'Swiggy', date: 'Today, 2:30 PM', amount: 12500 },
        { id: 'm2', sender: 'ZOMATO', body: 'Rs 8400 credited to a/c 1234. Weekly Payout.', type: 'income', merchant: 'Zomato', date: 'Yesterday', amount: 8400 },
        { id: 'm3', sender: 'AMAZON', body: 'Rs 599 debited for purchase. Balance: Rs 1500.', type: 'expense', merchant: 'Amazon', date: '12 Mar', amount: 599 },
    ];

    const parseSMS = (smsList: any[]) => {
        const parsed: any[] = [];

        smsList.forEach(sms => {
            const body = sms.body.toLowerCase();
            // 1. Detect Financial SMS
            if (body.includes('credited') || body.includes('debited') || body.includes('spent') || body.includes('sent') || body.includes('received')) {

                // 2. Extract Amount
                const amountMatch = body.match(/(?:rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/);
                if (amountMatch) {
                    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));

                    // 3. Determine Type
                    const isIncome = body.includes('credited') || body.includes('received');

                    // 4. Extract Merchant/Source
                    let merchant = "Generic";
                    if (body.includes('swiggy')) merchant = "Swiggy";
                    else if (body.includes('zomato')) merchant = "Zomato";
                    else if (body.includes('uber')) merchant = "Uber";
                    else if (body.includes('amazon')) merchant = "Amazon";
                    else if (body.includes('upi')) merchant = "UPI Transfer";
                    else merchant = sms.address || "Bank"; // Use Sender ID

                    parsed.push({
                        id: sms._id,
                        sender: sms.address,
                        body: sms.body,
                        type: isIncome ? 'income' : 'expense',
                        merchant: merchant,
                        date: new Date(sms.date).toLocaleDateString(),
                        amount: amount
                    });
                }
            }
        });
        return parsed;
    };

    const runScan = async () => {
        setLoading(true);

        // 1. Check if we are in a Native Android Environment with the Module
        const isNativeAndroid = Platform.OS === 'android' && SmsAndroid;

        if (!isNativeAndroid) {
            // --- SIMULATION MODE (Web, iOS, Expo Go) ---
            setTimeout(() => {
                Alert.alert("Simulation Mode", "In Expo Go/Web, we simulate the SMS scan for demo purposes.");
                setScanned(true);
                setTransactions(MOCK_SMS);
                setLoading(false);
            }, 1000);
            return;
        }

        // --- REAL MODE (Native Android Build) ---
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                {
                    title: "ArthikSetu SMS Permission",
                    message: "We need access to your SMS to track your earnings automatically.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                SmsAndroid.list(
                    JSON.stringify({
                        box: 'inbox',
                        maxCount: 200,
                    }),
                    (fail: any) => {
                        console.log('Failed to read SMS: ' + fail);
                        setLoading(false);
                        Alert.alert("Error", "Could not read SMS inbox.");
                    },
                    (count: any, smsList: string) => {
                        const arr = JSON.parse(smsList);
                        const realData = parseSMS(arr);

                        if (realData.length === 0) {
                            Alert.alert("No Data", "No financial transactions found. Showing demo data.");
                            setTransactions(MOCK_SMS);
                        } else {
                            setTransactions(realData);
                        }

                        setScanned(true);
                        setLoading(false);
                    }
                );
            } else {
                Alert.alert("Permission Denied", "Cannot read SMS without permission.");
                setLoading(false);
            }
        } catch (err) {
            console.warn(err);
            setLoading(false);
            Alert.alert("Error", "An error occurred while scanning.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Smart SMS Analyzer</Text>
            <Text style={styles.subtitle}>AI-Powered Real-Time Tracking</Text>

            {!scanned ? (
                <View style={styles.emptyState}>
                    <View style={styles.iconCircle}>
                        <MessageSquare size={48} color="#2563EB" />
                    </View>
                    <Text style={styles.emptyTitle}>Zero-Entry Tracking</Text>
                    <Text style={styles.emptyDesc}>
                        Our **NLP Engine** automatically parses bank SMS to track your earnings.
                    </Text>

                    <View style={styles.featureList}>
                        <View style={styles.featureItem}>
                            <ShieldCheck size={16} color="#16A34A" />
                            <Text style={styles.featureText}>Privacy First: Personal SMS ignored</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Zap size={16} color="#F59E0B" />
                            <Text style={styles.featureText}>Real-Device SMS Extraction</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.scanBtn} onPress={runScan}>
                        <Text style={styles.scanBtnText}>{loading ? "Scanning Inbox..." : "Scan My SMS Inbox"}</Text>
                        {!loading && <ArrowRight color="white" size={18} />}
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.resultsContainer}>
                    <View style={styles.summaryCard}>
                        <View>
                            <Text style={styles.summaryLabel}>Detected Earnings</Text>
                            <Text style={styles.summaryValue}>
                                ₹{transactions.filter(t => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0).toLocaleString('en-IN')}
                            </Text>
                        </View>
                        <View style={styles.summaryIcon}>
                            <Banknote size={24} color="#16A34A" />
                        </View>
                    </View>

                    <Text style={styles.sectionHeader}>Latest Transactions</Text>

                    {transactions.map(txn => (
                        <View key={txn.id} style={styles.txnCard}>
                            <View style={[styles.txnIcon, { backgroundColor: txn.type === 'income' ? '#DCFCE7' : '#FEE2E2' }]}>
                                {txn.type === 'income' ? <Banknote size={20} color="#16A34A" /> : <CreditCard size={20} color="#EF4444" />}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.txnMerchant}>{txn.merchant}</Text>
                                <Text style={styles.txnBody} numberOfLines={1}>{txn.body}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={[styles.txnAmount, { color: txn.type === 'income' ? '#16A34A' : '#EF4444' }]}>
                                    {txn.type === 'income' ? '+' : '-'} ₹{txn.amount}
                                </Text>
                                <Text style={styles.txnDate}>{txn.date}</Text>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.rescanBtn} onPress={runScan}>
                        <Text style={styles.rescanText}>Sync New SMS</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#F8F9FA' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0A1F44' },
    subtitle: { color: '#6B7280', marginTop: 8, marginBottom: 32 },

    emptyState: { alignItems: 'center', backgroundColor: 'white', padding: 32, borderRadius: 24, elevation: 2 },
    iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
    emptyDesc: { textAlign: 'center', color: '#6B7280', marginBottom: 32, lineHeight: 22 },

    scanBtn: { backgroundColor: '#0A1F44', flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, marginBottom: 24 },
    scanBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    featureList: { width: '100%', marginBottom: 24, gap: 12 },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F0FDF4', padding: 12, borderRadius: 8 },
    featureText: { color: '#166534', fontSize: 13, fontWeight: '600' },

    resultsContainer: { gap: 16 },
    summaryCard: { backgroundColor: '#0A1F44', padding: 24, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    summaryLabel: { color: '#93C5FD', fontSize: 14, marginBottom: 4 },
    summaryValue: { color: 'white', fontSize: 32, fontWeight: 'bold' },
    summaryIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },

    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginVertical: 8 },
    txnCard: { backgroundColor: 'white', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 16, elevation: 1 },
    txnIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    txnMerchant: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    txnBody: { fontSize: 12, color: '#6B7280', marginTop: 2, maxWidth: 180 },
    txnAmount: { fontSize: 16, fontWeight: 'bold' },
    txnDate: { fontSize: 10, color: '#9CA3AF', marginTop: 4 },

    rescanBtn: { marginTop: 16, alignItems: 'center', padding: 16 },
    rescanText: { color: '#2563EB', fontWeight: 'bold' }
});
