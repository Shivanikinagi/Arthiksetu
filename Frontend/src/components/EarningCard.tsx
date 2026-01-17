import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonBadge } from '@ionic/react';
import { walletOutline, timeOutline, businessOutline } from 'ionicons/icons';

interface EarningCardProps {
    platform: string;
    amount: number;
    date: string;
}

export function EarningCard({ platform, amount, date }: EarningCardProps) {
    // Helper to get platform specific colors
    const getPlatformStyle = (name: string) => {
        switch (name.toLowerCase()) {
            case 'zomato': return { color: '#cb202d', bg: '#fef2f2' };
            case 'swiggy': return { color: '#fc8019', bg: '#fff7ed' };
            case 'uber': return { color: '#000000', bg: '#f3f4f6' };
            default: return { color: '#3B82F6', bg: '#eff6ff' };
        }
    };

    const style = getPlatformStyle(platform);

    return (
        <IonCard mode="ios" className="mx-0 my-3 shadow-sm border border-gray-100 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-white">
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-sm"
                        style={{ backgroundColor: style.bg, color: style.color }}
                    >
                        {platform.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-lg">{platform}</h3>
                            <IonBadge color="success" className="text-[10px] font-normal px-1.5 py-0.5" mode="ios">Verified</IonBadge>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-0.5">
                            <IonIcon icon={timeOutline} />
                            <span>{date}</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-[#0A1F44]">
                        <span className="font-bold text-lg">₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        + Credits
                    </p>
                </div>
            </div>
        </IonCard>
    );
}
