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
    Languages,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile, UserProfile } from '../../utils/storage';

export default function ProfileScreen() {
    const { t, i18n } = useTranslation();

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);


    const loadProfile = useCallback(async () => {
        try {
            const profile = await getProfile();
            if (profile) {
                setUserProfile(profile);
            }
        } catch (error) {
            console.error("Profile: Error loading profile:", error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [loadProfile])
    );

    const SettingItem = ({ icon: Icon, label, color, onPress, showBorder = true }: any) => (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center justify-between py-5 ${showBorder ? 'border-b border-slate-50' : ''}`}
        >
            <View className="flex-row items-center">
                <View className="w-11 h-11 items-center justify-center rounded-2xl bg-slate-50/50 mr-4">
                    <Icon size={20} color={color || "#94A3B8"} strokeWidth={2} />
                </View>
                <Text className="text-[#334155] font-medium text-base">{label}</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" strokeWidth={2} />
        </TouchableOpacity>
    );

    const handleSignOut = () => {
        Alert.alert(
            t("sign_out"),
            t("sign_out_confirm"),
            [
                { text: t("cancel"), style: "cancel" },
                {
                    text: t("logout"),
                    style: "destructive",
                    onPress: () => router.replace('/(auth)/login')
                }
            ]
        );
    };

    const toggleLanguage = async () => {
        const nextLang = i18n.language === 'en' ? 'bn' : 'en';
        await i18n.changeLanguage(nextLang);
        // Manual save just to be sure
        await AsyncStorage.setItem('user-language', nextLang);
    };


    const handleProfileEdit = () => {
        router.push('/profile-setup');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFB]" edges={['top']}>
            <View className="px-6 py-4 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => router.replace('/(tabs)')}
                    className="w-11 h-11 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50"
                >
                    <ChevronLeft size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text className="text-[#1E293B] font-black text-xl">{t("my_profile")}</Text>
                <View className="w-11" />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* User Info Card */}
                <View className="py-6">
                    <TouchableOpacity
                        onPress={handleProfileEdit}
                        className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-50 flex-row items-center"
                    >
                        <View className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden mr-4 items-center justify-center">
                            <User size={30} color="#00BDD6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[#1E293B] font-black text-xl">{userProfile?.name || 'User'}</Text>
                            <Text className="text-[#94A3B8] font-bold text-xs mt-1">{t("goal")}: {userProfile?.dailyGoal} ml</Text>
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
                    <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">{t("body_profile")}</Text>
                    <View className="bg-white px-6 rounded-[20px] shadow-sm border border-slate-50">
                        <SettingItem
                            icon={User}
                            label={`${t("weight")}: ${userProfile?.weight || '--'} ${t("kg")}`}
                            color="#7DD3FC"
                            showBorder={true}
                            onPress={handleProfileEdit}
                        />
                        <SettingItem
                            icon={Info}
                            label={`${t("height")}: ${userProfile?.height || '--'} ${t("cm")}`}
                            color="#FCD34D"
                            showBorder={true}
                            onPress={handleProfileEdit}
                        />
                        <SettingItem
                            icon={Droplets}
                            label={`${t("daily_goal")}: ${userProfile?.dailyGoal || '--'} ${t("ml")}`}
                            color="#7DD3FC"
                            showBorder={false}
                            onPress={handleProfileEdit}
                        />
                    </View>
                </View>


                {/* App Sections */}
                <View className="mb-10">
                    <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">{t("settings")}</Text>
                    <View className="bg-white px-6 rounded-[20px] shadow-sm border border-slate-50">
                        <SettingItem
                            icon={Languages}
                            label={`${t("language")}: ${i18n.language === 'en' ? 'English' : 'বাংলা'}`}
                            color="#A78BFA"
                            onPress={toggleLanguage}
                        />
                        <SettingItem
                            icon={Lock}
                            label={t("change_password")}
                            color="#FCA5A5"
                            onPress={() => router.push('/settings/password')}
                        />
                        <SettingItem
                            icon={Users}
                            label={t("invite")}
                            color="#86EFAC"
                            onPress={() => router.push('/settings/invite')}
                        />
                        <SettingItem
                            icon={HelpCircle}
                            label={t("faq")}
                            color="#A5B4FC"
                            onPress={() => router.push('/settings/faq')}
                        />
                        <SettingItem
                            icon={Info}
                            label={t("about")}
                            color="#94A3B8"
                            showBorder={false}
                            onPress={() => router.push('/settings/about')}
                        />
                    </View>
                </View>


                <TouchableOpacity
                    className="bg-[#00BDD6] py-4 flex-row rounded-[32px] shadow-lg shadow-[#00BDD6]/40 items-center justify-center space-x-3 mb-12"
                    onPress={handleSignOut}
                >
                    <LogOut size={20} color="white" strokeWidth={2.5} />
                    <Text className="text-white font-black text-lg">{t("sign_out")}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
