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
    Moon,
    Sun,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { saveTheme } from '../../utils/theme-storage';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile, UserProfile } from '../../utils/storage';
import ThemeToggle from '../../components/ThemeToggle';

const SettingItem = ({ icon: Icon, label, color, onPress, showBorder = true, rightElement }: any) => {
    const { colorScheme } = useColorScheme();
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 18,
                borderBottomWidth: showBorder ? 1 : 0,
                borderBottomColor: colorScheme === 'dark' ? '#1E293B' : '#F1F5F9'
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                    width: 44,
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#F8FAFC',
                    marginRight: 16
                }}>
                    <Icon size={20} color={color || "#94A3B8"} strokeWidth={2} />
                </View>
                <Text className="text-[#334155] dark:text-slate-200 font-medium text-base">{label}</Text>
            </View>
            {rightElement ? rightElement : (
                <ChevronRight size={18} color={colorScheme === 'dark' ? "#334155" : "#CBD5E1"} strokeWidth={2} />
            )}
        </TouchableOpacity>
    );
};

export default function ProfileScreen() {
    const { t, i18n } = useTranslation();
    const { colorScheme, setColorScheme } = useColorScheme();

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
        await AsyncStorage.setItem('user-language', nextLang);
    };

    const handleToggleTheme = async (theme: 'light' | 'dark') => {
        setColorScheme(theme);
        await saveTheme(theme);
    };

    const handleProfileEdit = () => {
        router.push('/profile-setup');
    };

    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-dark-background" edges={['top']}>
            <View className="px-6 py-4 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)')}
                    className="w-11 h-11 items-center justify-center rounded-2xl bg-white dark:bg-dark-surface shadow-sm border border-slate-50 dark:border-slate-800"
                >
                    <ChevronLeft size={22} color={isDark ? "#F8FAFC" : "#1E293B"} />
                </TouchableOpacity>
                <Text className="text-[#1E293B] dark:text-white font-black text-xl">{t("my_profile")}</Text>
                <ThemeToggle />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                {/* User Info Card */}
                <View className="py-6">
                    <TouchableOpacity
                        onPress={handleProfileEdit}
                        className="bg-white dark:bg-dark-surface p-6 rounded-[24px] shadow-sm border border-slate-50 dark:border-slate-800 flex-row items-center"
                    >
                        <View className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden mr-4 items-center justify-center">
                            <User size={30} color="#00BDD6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-[#1E293B] dark:text-white font-black text-xl">{userProfile?.name || 'User'}</Text>
                            <Text className="text-[#94A3B8] dark:text-slate-400 font-bold text-xs mt-1">{t("goal")}: {userProfile?.dailyGoal} ml</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => Alert.alert("Success", "All notifications are active! 🔔")}
                            style={{ backgroundColor: isDark ? '#1E293B' : '#E6F4FE', padding: 12, borderRadius: 16 }}
                        >
                            <Bell size={20} color="#00BDD6" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>

                {/* Modern Theme Switcher Card */}
                <View className="mb-8">
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                        padding: 6,
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: isDark ? '#1E293B' : '#F1F5F9'
                    }}>
                        <TouchableOpacity
                            onPress={() => handleToggleTheme('light')}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 12,
                                borderRadius: 20,
                                backgroundColor: !isDark ? 'white' : 'transparent',
                                shadowColor: !isDark ? '#000' : 'transparent',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: !isDark ? 2 : 0
                            }}
                        >
                            <Sun size={18} color={!isDark ? "#F59E0B" : "#94A3B8"} strokeWidth={3} />
                            <Text style={{
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                fontSize: 10,
                                letterSpacing: 2,
                                marginLeft: 8,
                                color: !isDark ? '#1E293B' : '#94A3B8'
                            }}>{t("light")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleToggleTheme('dark')}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 12,
                                borderRadius: 20,
                                backgroundColor: isDark ? '#4F46E5' : 'transparent',
                                shadowColor: isDark ? '#4F46E5' : 'transparent',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: isDark ? 4 : 0
                            }}
                        >
                            <Moon size={18} color={isDark ? "white" : "#94A3B8"} strokeWidth={3} />
                            <Text style={{
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                fontSize: 10,
                                letterSpacing: 2,
                                marginLeft: 8,
                                color: isDark ? 'white' : '#94A3B8'
                            }}>{t("dark")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Body Profile Section */}
                <View className="mb-8">
                    <Text className="text-[#94A3B8] dark:text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">{t("body_profile")}</Text>
                    <View className="bg-white dark:bg-dark-surface px-6 rounded-[24px] shadow-sm border border-slate-50 dark:border-slate-800">
                        <SettingItem
                            icon={User}
                            label={`${t("weight")}: ${userProfile?.weight || '--'} ${t("kg")}`}
                            color="#7DD3FC"
                            onPress={handleProfileEdit}
                        />
                        <SettingItem
                            icon={Info}
                            label={`${t("height")}: ${userProfile?.height || '--'} ${t("cm")}`}
                            color="#FCD34D"
                            onPress={handleProfileEdit}
                        />
                        <SettingItem
                            icon={Droplets}
                            label={`${t("daily_goal")}: ${userProfile?.dailyGoal || '--'} ${t("ml")}`}
                            color="#00BDD6"
                            showBorder={false}
                            onPress={handleProfileEdit}
                        />
                    </View>
                </View>

                {/* Settings Section */}
                <View className="mb-10">
                    <Text className="text-[#94A3B8] dark:text-slate-500 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">{t("settings")}</Text>
                    <View className="bg-white dark:bg-dark-surface px-6 rounded-[24px] shadow-sm border border-slate-50 dark:border-slate-800">
                        <SettingItem
                            icon={Languages}
                            label={`${t("language")}: ${i18n.language === 'en' ? 'English' : 'বাংলা'}`}
                            color="#818CF8"
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
                            color="#4ADE80"
                            onPress={() => router.push('/settings/invite')}
                        />
                        <SettingItem
                            icon={HelpCircle}
                            label={t("faq")}
                            color="#F472B6"
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
                    onPress={handleSignOut}
                    style={{
                        backgroundColor: '#00BDD6',
                        paddingVertical: 18,
                        flexDirection: 'row',
                        borderRadius: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                        shadowColor: '#00BDD6',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 6
                    }}
                >
                    <LogOut size={20} color="white" strokeWidth={2.5} />
                    <Text style={{ color: 'white', fontWeight: '900', fontSize: 18, marginLeft: 12 }}>{t("sign_out")}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

