import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, Mail, Phone, MapPin, Briefcase, Edit2, Save } from 'lucide-react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard, SectionTitle, GlassInput } from '../components/GlassComponents';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ onBack }: { onBack?: () => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Rahul Sharma",
        email: "rahul.sharma@gmail.com",
        phone: "+91 98765 43210",
        location: "Bangalore, Karnataka",
        occupation: "Delivery Partner (Uber/Swiggy)"
    });

    return (
        <ScreenWrapper title="Profile" subtitle="PERSONAL DETAILS" showBack onBack={onBack}>

            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <View style={styles.avatarContainer}>
                    <LinearGradient colors={['#06b6d4', '#2563eb']} style={styles.avatarGradient}>
                        <Text style={styles.avatarText}>{profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</Text>
                    </LinearGradient>
                </View>
                {isEditing ? (
                    <GlassInput
                        value={profile.name}
                        onChangeText={(t) => setProfile({ ...profile, name: t })}
                        style={{ width: 200, textAlign: 'center' }}
                    />
                ) : (
                    <Text style={styles.name}>{profile.name}</Text>
                )}
                <Text style={styles.role}>Gig Driver • Platinum Member</Text>

                <TouchableOpacity
                    onPress={() => setIsEditing(!isEditing)}
                    style={{ position: 'absolute', right: 0, top: 0, padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 }}
                >
                    {isEditing ? <Save size={20} color="#34d399" /> : <Edit2 size={20} color="#22d3ee" />}
                </TouchableOpacity>
            </View>

            <SectionTitle title="Personal Information" />
            <GlassCard intensity={15}>
                <ProfileRow icon={Mail} label="Email" value={profile.email} isLast={false} isEditing={isEditing} onChange={(t: any) => setProfile({ ...profile, email: t })} />
                <ProfileRow icon={Phone} label="Phone" value={profile.phone} isLast={false} isEditing={isEditing} onChange={(t: any) => setProfile({ ...profile, phone: t })} />
                <ProfileRow icon={MapPin} label="Location" value={profile.location} isLast={false} isEditing={isEditing} onChange={(t: any) => setProfile({ ...profile, location: t })} />
                <ProfileRow icon={Briefcase} label="Occupation" value={profile.occupation} isLast={true} isEditing={isEditing} onChange={(t: any) => setProfile({ ...profile, occupation: t })} />
            </GlassCard>

            <SectionTitle title="Earnings Stats" />
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <StatCard label="Total Earned" value="₹7.2L" color="#34d399" />
                <StatCard label="Verified" value="100%" color="#22d3ee" />
                <StatCard label="Credit Score" value="750" color="#f472b6" />
            </View>

        </ScreenWrapper>
    );
}

const ProfileRow = ({ icon: Icon, label, value, isLast, isEditing, onChange }: any) => (
    <View style={[styles.row, !isLast && styles.borderBottom]}>
        <View style={styles.iconBox}>
            <Icon size={18} color="#94a3b8" />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.label}>{label}</Text>
            {isEditing ? (
                <GlassInput
                    value={value}
                    onChangeText={onChange}
                    style={{ padding: 0, height: 40, backgroundColor: 'transparent', borderWidth: 0, marginTop: -4 }}
                    placeholder={label}
                />
            ) : (
                <Text style={styles.value}>{value}</Text>
            )}
        </View>
    </View>
);

const StatCard = ({ label, value, color }: any) => (
    <GlassCard intensity={10} style={{ flex: 1, alignItems: 'center', padding: 16 }}>
        <Text style={{ color: color, fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>{value}</Text>
        <Text style={{ color: '#94a3b8', fontSize: 10 }}>{label}</Text>
    </GlassCard>
);

const styles = StyleSheet.create({
    avatarContainer: { padding: 4, borderRadius: 60, borderWidth: 1, borderColor: 'rgba(34, 211, 238, 0.3)', marginBottom: 16 },
    avatarGradient: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
    name: { fontSize: 24, fontWeight: 'bold', color: 'white', letterSpacing: 0.5 },
    role: { color: '#22d3ee', fontSize: 14, marginTop: 4 },

    row: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12 },
    borderBottom: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    iconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
    label: { color: '#64748b', fontSize: 12 },
    value: { color: 'white', fontSize: 14, fontWeight: '500', marginTop: 2 }
});
