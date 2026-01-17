import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { User, Mail, Phone, MapPin, LogOut, Edit2, Check, Camera, Star, Briefcase, Truck, PenTool } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Rahul Sharma',
        role: 'Gig Worker • 134 Tasks',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        location: 'Bangalore, Karnataka',
        about: "I am an elite tasker. I verify documents and deliver packages with a smile. Ask me for more info."
    });

    const SKILLS = ["Heavy Lifting", "Verified", "Fast Delivery", "Biker"];

    const handleSave = () => {
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
    };

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Log Out", style: "destructive", onPress: () => Alert.alert("Logged Out", "You have been logged out.") }
            ]
        );
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* 1. CURVED HEADER */}
                <View style={styles.headerCurve}>
                    <View style={styles.headerTopBar}>
                        <TouchableOpacity onPress={handleLogout}>
                            <LogOut color="white" size={24} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>WORKER PROFILE</Text>
                        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                            {isEditing ? <Check color="#4ADE80" size={24} /> : <Edit2 color="white" size={24} />}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 2. FLOATING AVATAR */}
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>RS</Text>
                        <View style={styles.verifiedBadge}>
                            <Check size={12} color="white" strokeWidth={4} />
                        </View>
                    </View>
                </View>

                {/* 3. PROFILE INFO */}
                <View style={styles.contentContainer}>
                    {isEditing ? (
                        <TextInput
                            style={styles.nameInput}
                            value={profile.name}
                            onChangeText={t => setProfile({ ...profile, name: t })}
                        />
                    ) : (
                        <Text style={styles.name}>{profile.name}</Text>
                    )}

                    {/* Rating Stars Simulation */}
                    <View style={styles.ratingRow}>
                        <Text style={styles.ratingScore}>4.8</Text>
                        <View style={{ flexDirection: 'row', gap: 2 }}>
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} color="#FBBF24" fill="#FBBF24" />)}
                        </View>
                        <Text style={styles.taskCount}>{profile.role}</Text>
                    </View>

                    {/* SKILLS CHIPS */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Skills</Text>
                        <View style={styles.skillsRow}>
                            {SKILLS.map((skill, i) => (
                                <View key={i} style={styles.skillChip}>
                                    <Text style={styles.skillText}>{skill.toUpperCase()}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* ABOUT ME CARD */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>About me</Text>
                        {isEditing ? (
                            <TextInput
                                style={[styles.aboutText, { borderBottomWidth: 1, borderColor: '#ddd' }]}
                                value={profile.about}
                                multiline
                                onChangeText={t => setProfile({ ...profile, about: t })}
                            />
                        ) : (
                            <Text style={styles.aboutText}>{profile.about}</Text>
                        )}
                    </View>

                    {/* PORTFOLIO / INFO GRID */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Details</Text>
                        <View style={styles.detailsGrid}>
                            <DetailItem icon={Mail} label="Email" value={profile.email} />
                            <DetailItem icon={Phone} label="Phone" value={profile.phone} />
                            <DetailItem icon={MapPin} label="City" value={profile.location} />
                        </View>
                    </View>

                    {/* BIG GREEN ACTION BUTTON */}
                    <TouchableOpacity style={styles.actionButton} onPress={isEditing ? handleSave : () => Alert.alert("Hired!", "You are available for work.")}>
                        <Text style={styles.actionBtnText}>{isEditing ? "SAVE PROFILE" : "AVAILABLE FOR WORK"}</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const DetailItem = ({ icon: Icon, label, value }: any) => (
    <View style={styles.detailCard}>
        <Icon size={20} color="#6B7280" />
        <View>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },

    // 1. HEADER CURVE
    headerCurve: {
        height: 180,
        backgroundColor: '#1F2937', // Dark Grey/Black theme
        borderBottomLeftRadius: width * 0.5, // Creates the distinct curve
        borderBottomRightRadius: width * 0.5,
        transform: [{ scaleX: 1.2 }], // Flattens the curve slightly for that "wide" look
        alignItems: 'center',
        paddingTop: 50,
        position: 'relative',
        zIndex: 1,
    },
    headerTopBar: {
        width: width / 1.2, // Counteract scaleX
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    headerTitle: { color: 'white', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.5 },

    // 2. AVATAR
    avatarWrapper: {
        alignItems: 'center',
        marginTop: -50,
        zIndex: 2,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#374151',
        borderWidth: 5,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5
    },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: 'white' },
    verifiedBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#10B981', // Green Check
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white'
    },

    // 3. CONTENT
    contentContainer: { padding: 24, alignItems: 'center' },
    name: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginTop: 8 },
    nameInput: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginTop: 8, borderBottomWidth: 1, borderBottomColor: '#10B981', minWidth: 200, textAlign: 'center' },

    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, marginBottom: 24 },
    ratingScore: { fontWeight: 'bold', color: '#111827' },
    taskCount: { fontSize: 12, color: '#9CA3AF', marginLeft: 4 },

    section: { width: '100%', marginBottom: 24 },
    sectionLabel: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 12 },

    skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    skillChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E9D5FF', // Light Purple Border
        shadowColor: "#7C3AED",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1
    },
    skillText: { fontSize: 10, fontWeight: 'bold', color: '#7C3AED' }, // Purple text

    aboutText: { fontSize: 14, color: '#6B7280', lineHeight: 22 },

    detailsGrid: { gap: 12 },
    detailCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12 },
    detailLabel: { fontSize: 12, color: '#9CA3AF' },
    detailValue: { fontSize: 14, fontWeight: '600', color: '#1F2937' },

    // BUTTON
    actionButton: {
        width: '100%',
        backgroundColor: '#10B981', // The Reference Green
        paddingVertical: 18,
        borderRadius: 30, // Fully rounded
        alignItems: 'center',
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        marginBottom: 30
    },
    actionBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});
