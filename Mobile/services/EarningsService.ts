import { Platform, PermissionsAndroid } from 'react-native';

// Import Native SMS Module safely
let SmsAndroid: any = null;
if (Platform.OS === 'android') {
    try {
        SmsAndroid = require('react-native-get-sms-android').default;
    } catch (e) {
        console.log("SMS Module missing");
    }
}

export const EarningsService = {

    // Calculate Monthly Earnings from SMS
    calculateMonthlyEarnings: async (): Promise<number> => {
        if (Platform.OS !== 'android' || !SmsAndroid) {
            console.log("Earnings Service: Not Android or Module Missing");
            return 0; // Return 0 if not supported (Real behavior)
        }

        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);

            if (!granted) {
                // We won't prompt here to avoid blocking startup. 
                // We assume permissions are requested in Analyzer screen or user grants them.
                return 0;
            }

            return new Promise((resolve, reject) => {
                const filter = {
                    box: 'inbox',
                    maxCount: 200, // Read last 200 messages for better accuracy
                };

                SmsAndroid.list(
                    JSON.stringify(filter),
                    (fail: any) => {
                        console.log("Failed to read SMS", fail);
                        resolve(0);
                    },
                    (count: number, smsList: string) => {
                        const smsArray = JSON.parse(smsList);
                        const total = processSMSForEarnings(smsArray);
                        resolve(total);
                    }
                );
            });

        } catch (err) {
            console.error(err);
            return 0;
        }
    }
};

// Helper: Parse SMS for Income
const processSMSForEarnings = (smsArray: any[]): number => {
    let totalIncome = 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const moneyRegex = /(?:rs\.?|inr)\s*(\d+(?:,\d+)*(?:\.\d{1,2})?)|(\d+(?:,\d+)*(?:\.\d{1,2})?)\s*(?:rs\.?|inr)/i;

    smsArray.forEach((sms) => {
        const smsDate = new Date(sms.date);

        // Filter for Current Month ONLY
        if (smsDate.getMonth() === currentMonth && smsDate.getFullYear() === currentYear) {

            const body = sms.body.toLowerCase();
            // Income Keywords
            if (body.match(/credited|received|salary|payout|refund/)) {

                // Exclude generic/spam if possible, but keep it broad for Gig work
                const amountMatch = body.match(moneyRegex);
                if (amountMatch) {
                    const amountStr = amountMatch[1] || amountMatch[2];
                    if (amountStr) {
                        const amount = parseFloat(amountStr.replace(/,/g, ''));
                        if (!isNaN(amount)) {
                            totalIncome += amount;
                        }
                    }
                }
            }
        }
    });

    return totalIncome;
};
