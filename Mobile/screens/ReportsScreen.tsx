import React from 'react';
import { View, Text } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard } from '../components/GlassComponents';

export default function ReportsScreen({ onBack }: { onBack?: () => void }) {
    return (
        <ScreenWrapper title="Reports" subtitle="DOWNLOAD HISTORY" showBack onBack={onBack}>
            <GlassCard intensity={15} style={{ padding: 20 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>No reports generated yet.</Text>
            </GlassCard>
        </ScreenWrapper>
    );
}
