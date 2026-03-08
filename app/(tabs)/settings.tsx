import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ChevronLeft,
    User,
    Bell,
    Lock,
    Users,
    HelpCircle,
    Info,
    ChevronRight,
    LogOut,
    Droplets,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { getProfile, UserProfile } from '../../utils/storage';

export default function SettingsScreen() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const loadProfile = useCallback(async () => {
        try {
            const profile = await getProfile();
            if (profile) {
                setUserProfile(profile);
            }
        } catch (error) {
            console.error("Settings: Error loading profile:", error);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const SettingItem = ({ icon: Icon, label, color, onPress, showBorder = true }: any) => (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center justify-between py-5 ${showBorder ? 'border-b border-slate-50' : ''}`}
        >
            <View className="flex-row items-center">
                <View className="w-11 h-11 items-center justify-center rounded-2xl bg-slate-50 mr-4 border border-slate-100/50 shadow-sm">
                    <Icon size={22} color={color || "#64748B"} strokeWidth={2.5} />
                </View>
                <Text className="text-[#1E293B] font-black text-base">{label}</Text>
            </View>
            <ChevronRight size={20} color="#CBD5E1" strokeWidth={2.5} />
        </TouchableOpacity>
    );

    const handleSignOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => router.replace('/(auth)/login')
                }
            ]
        );
    };

    const handleComingSoon = (feature: string) => {
        Alert.alert("Coming Soon", `${feature} will be available in the next update! 🚀`);
    };

    const handleProfileEdit = () => {
        // Redirect to profile setup to update info
        router.push('/profile-setup');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFB]" edges={['top']}>
            <View className="px-6 py-4 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')}
                    className="w-11 h-11 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50"
                >
                    <ChevronLeft size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text className="text-[#1E293B] font-black text-xl">Settings</Text>
                <View className="w-11" />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* User Info Card */}
                <View className="py-6">
                    <TouchableOpacity
                        onPress={handleProfileEdit}
                        className="bg-white p-6 rounded-[44px] shadow-sm border border-slate-50 flex-row items-center"
                    >
                        <View className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden mr-4 items-center justify-center">
                            <User size={30} color="#00BDD6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[#1E293B] font-black text-xl">{userProfile?.name || 'User'}</Text>
                            <Text className="text-[#94A3B8] font-bold text-xs mt-1">Goal: {userProfile?.dailyGoal} ml</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => Alert.alert("Success", "All notifications are active! 🔔")}
                            className="bg-[#E6F4FE] p-3 rounded-2xl shadow-sm"
                        >
                            <Bell size={20} color="#00BDD6" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>

                {/* Physical Information Sections */}
                <View className="mb-8">
                    <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">Body Profile</Text>
                    <View className="bg-white px-6 rounded-[36px] shadow-sm border border-slate-50">
                        <SettingItem
                            icon={User}
                            label={`Weight: ${userProfile?.weight || '--'} kg`}
                            color="#00BDD6"
                            showBorder={true}
                            onPress={handleProfileEdit}
                        />
                        <SettingItem
                            icon={Info}
                            label={`Height: ${userProfile?.height || '--'} cm`}
                            color="#F59E0B"
                            showBorder={true}
                            onPress={handleProfileEdit}
                        />
                        <SettingItem
                            icon={Droplets}
                            label={`Daily Goal: ${userProfile?.dailyGoal || '--'} ml`}
                            color="#00BDD6"
                            showBorder={false}
                            onPress={handleProfileEdit}
                        />
                    </View>
                </View>

                {/* Static Options with Interactions */}
                <View className="mb-10">
                    <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">App Settings</Text>
                    <View className="bg-white px-6 rounded-[44px] shadow-sm border border-slate-50">
                        <SettingItem
                            icon={Lock}
                            label="Change Password"
                            color="#EF4444"
                            onPress={() => router.push('/settings/password')}
                        />
                        <SettingItem
                            icon={Users}
                            label="Invite Friends"
                            color="#22C55E"
                            onPress={() => router.push('/settings/invite')}
                        />
                        <SettingItem
                            icon={HelpCircle}
                            label="FAQs & Support"
                            color="#6366F1"
                            onPress={() => router.push('/settings/faq')}
                        />
                        <SettingItem
                            icon={Info}
                            label="About AquaFlow"
                            color="#64748B"
                            showBorder={false}
                            onPress={() => router.push('/settings/about')}
                        />
                    </View>
                </View>

                {/* Big Sign Out Button */}
                <TouchableOpacity
                    className="bg-[#00BDD6] py-6 flex-row rounded-[32px] shadow-lg shadow-[#00BDD6]/40 items-center justify-center space-x-3 mb-12"
                    onPress={handleSignOut}
                >
                    <LogOut size={20} color="white" strokeWidth={2.5} />
                    <Text className="text-white font-black text-lg">Sign out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
