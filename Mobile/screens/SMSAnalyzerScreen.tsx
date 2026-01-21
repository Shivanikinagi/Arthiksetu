import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, PermissionsAndroid, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Banknote, CreditCard, Smartphone, RefreshCw, BarChart2 } from 'lucide-react-native';
import { CyberTheme } from '../constants/CyberTheme';

// Import Native SMS Module safely
let SmsAndroid: any = null;
if (Platform.OS === 'android') {
    try {
        SmsAndroid = require('react-native-get-sms-android').default;
    } catch (e) {
        console.log("SMS Module missing (likely Expo Go)");
    }
}

export default function SMSAnalyzerScreen() {
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const runScan = async () => {
        setLoading(true);
        setErrorMsg(null);

        if (Platform.OS !== 'android') {
            setLoading(false);
            Alert.alert("Not Supported", "SMS Analysis works only on Android devices.");
            return;
        }

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS,
                {
                    title: "SMS Access Required",
                    message: "ArthikSetu needs access to your SMS to track daily earnings automatically.",
                    buttonPositive: "OK"
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                fetchSMS();
            } else {
                setLoading(false);
                Alert.alert("Permission Denied", "Cannot analyze earnings without SMS permission.");
            }
        } catch (err) {
            console.warn(err);
            setLoading(false);
        }
    };

    const fetchSMS = () => {
        if (!SmsAndroid) {
            // Fallback for Simulator/Expo Go
            setErrorMsg("SMS Module not active in this environment. Using simulation.");
            simulateScan();
            return;
        }

        const filter = {
            box: 'inbox',
            maxCount: 100, // Read last 100 SMS
        };

        SmsAndroid.list(
            JSON.stringify(filter),
            (fail: any) => {
                setLoading(false);
                Alert.alert("Error", "Failed to read SMS: " + fail);
            },
            (count: number, smsList: string) => {
                const arr = JSON.parse(smsList);
                processSMS(arr);
            }
        );
    };

    const processSMS = (smsArray: any[]) => {
        const foundTxns: any[] = [];

        // Simple Regex for Money Detection (Real Logic)
        const moneyRegex = /(?:rs\.?|inr)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)|(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:rs\.?|inr)/i;

        smsArray.forEach((sms) => {
            const body = sms.body.toLowerCase();
            const sender = sms.address.toLowerCase();

            // Filter for Banking/Gig Keywords
            if (body.match(/credited|debited|spent|paid|received|txn|acct|bank|swiggy|zomato|uber/)) {

                const amountMatch = body.match(moneyRegex);
                if (amountMatch) {
                    const amount = amountMatch[1] || amountMatch[2];

                    let type = 'expense';
                    if (body.includes('credited') || body.includes('received') || body.includes('refund')) {
                        type = 'income';
                    }

                    // Attempt to extract Merchant
                    let merchant = "Unknown";
                    if (sender.includes('hdfc')) merchant = "HDFC Bank";
                    else if (sender.includes('sbi')) merchant = "SBI";
                    else if (sender.includes('paytm')) merchant = "Paytm";
                    else if (body.includes('swiggy')) merchant = "Swiggy";
                    else if (body.includes('zomato')) merchant = "Zomato";
                    else if (body.includes('uber')) merchant = "Uber";
                    else merchant = sender; // Fallback

                    foundTxns.push({
                        id: sms._id,
                        sender: sms.address,
                        body: sms.body,
                        type,
                        merchant,
                        date: new Date(sms.date).toLocaleDateString(),
                        amount: amount.replace(/,/g, '') // Clean amount
                    });
                }
            }
        });

        setTransactions(foundTxns);
        setScanned(true);
        setLoading(false);
        if (foundTxns.length === 0) {
            Alert.alert("Analysis Complete", "No financial transactions found in the last 100 messages.");
        }
    };

    // Keep simulation as a strictly explicit fallback if module is missing
    const simulateScan = () => {
        setTimeout(() => {
            const MOCK_SMS_REALISTIC = [
                { id: 'm1', sender: 'HDFCBNK', type: 'income', merchant: 'Swiggy', date: 'Today', amount: 12500 },
                { id: 'm2', sender: 'ZOMATO', type: 'income', merchant: 'Zomato', date: 'Yesterday', amount: 8400 },
            ];
            setTransactions(MOCK_SMS_REALISTIC);
            setScanned(true);
            setLoading(false);
        }, 1500);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

            <View style={styles.visualizerContainer}>
                <Text style={styles.headerTitle}>Scan My SMS Inbox</Text>

                <View style={styles.waveContainer}>
                    {[...Array(19)].map((_, i) => (
                        <LinearGradient
                            key={i}
                            colors={loading ? CyberTheme.colors.gradientAccent : i % 3 === 0 ? CyberTheme.colors.gradientCyan : CyberTheme.colors.gradientPrimary}
                            style={[
                                styles.waveBar,
                                {
                                    height: loading ? Math.random() * 80 + 20 : 40 + Math.sin(i / 2) * 20,
                                    opacity: loading ? 1 : 0.6
                                }
                            ]}
                        />
                    ))}
                </View>

                {!scanned || loading ? (
                    <TouchableOpacity onPress={runScan} disabled={loading} activeOpacity={0.8} style={{ width: '100%', alignItems: 'center' }}>
                        <LinearGradient
                            colors={CyberTheme.colors.gradientPrimary}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.scanBtn}
                        >
                            <View style={styles.fingerprintIcon}>
                                {loading ? <ActivityIndicator size="small" color="white" /> : <Smartphone size={28} color="white" />}
                            </View>
                            <Text style={styles.scanBtnText}>{loading ? "Analyzing Inbox..." : "Start Real Scan"}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.summaryBadge}>
                        <BarChart2 size={20} color={CyberTheme.colors.success} />
                        <Text style={styles.summaryText}>Scan Complete • {transactions.length} Found</Text>
                    </View>
                )}

                {errorMsg && <Text style={{ color: 'orange', marginTop: 10 }}>{errorMsg}</Text>}
            </View>

            <View style={styles.resultsSection}>
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeader}>Verified Sources</Text>
                </View>

                {!scanned ? (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>Tap scan to find real transactions in your inbox.</Text>
                        <Text style={styles.placeholderSub}>We respect your privacy. Processing happens locally.</Text>
                    </View>
                ) : (
                    transactions.map((txn, index) => (
                        <View key={txn.id} style={styles.txnCard}>
                            <View style={[styles.txnIconBox, { backgroundColor: txn.type === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
                                {txn.type === 'income' ? <Banknote size={24} color={CyberTheme.colors.success} /> : <CreditCard size={24} color="#EF4444" />}
                            </View>

                            <View style={styles.txnInfo}>
                                <Text style={styles.txnTitle}>{txn.merchant}</Text>
                                <Text style={styles.txnSub}>{txn.type === 'income' ? 'Income' : 'Expense'} • {txn.date}</Text>
                            </View>

                            <View style={[styles.txnAmountBox, { borderColor: txn.type === 'income' ? CyberTheme.colors.success : 'rgba(239, 68, 68, 0.5)' }]}>
                                <Text style={[styles.txnAmount, { color: txn.type === 'income' ? CyberTheme.colors.success : '#EF4444' }]}>
                                    {txn.type === 'income' ? '+' : '-'} ₹{txn.amount}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: CyberTheme.colors.background },
    contentContainer: { padding: 24, paddingBottom: 100 },

    visualizerContainer: { alignItems: 'center', marginVertical: 30 },
    headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 40, letterSpacing: 1 },

    waveContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 120, marginBottom: 50 },
    waveBar: { width: 8, borderRadius: 4, opacity: 0.9 },

    scanBtn: {
        width: '85%', height: 60, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14,
        shadowColor: CyberTheme.colors.primary, shadowOpacity: 0.6, shadowRadius: 20, elevation: 12
    },
    fingerprintIcon: {},
    scanBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },

    summaryBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: CyberTheme.colors.success },
    summaryText: { color: CyberTheme.colors.success, fontWeight: 'bold', fontSize: 14 },

    resultsSection: { marginTop: 20 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionHeader: { color: 'white', fontSize: 18, fontWeight: 'bold' },

    placeholderContainer: { alignItems: 'center', marginTop: 20, opacity: 0.7 },
    placeholderText: { color: 'white', fontWeight: '600', fontSize: 15 },
    placeholderSub: { color: CyberTheme.colors.textDim, fontSize: 13, marginTop: 6 },

    txnCard: {
        backgroundColor: CyberTheme.colors.surface, borderRadius: 20, padding: 18, marginBottom: 14,
        flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)'
    },
    txnIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 18 },
    txnInfo: { flex: 1 },
    txnTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    txnSub: { color: CyberTheme.colors.textDim, fontSize: 12, marginTop: 4 },
    txnAmountBox: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
    txnAmount: { fontSize: 13, fontWeight: 'bold' },

});
