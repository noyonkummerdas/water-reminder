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

const SettingItem = ({ icon: Icon, label, color, onPress, showBorder = true, rightElement, value }: any) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.6}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 18,
                borderBottomWidth: showBorder ? 1 : 0,
                borderBottomColor: isDark ? '#1E293B' : '#F5F5F5'
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                    width: 42,
                    height: 42,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 14,
                    backgroundColor: isDark ? '#1E293B' : '#F5F5F5',
                    marginRight: 16
                }}>
                    <Icon size={18} color={color || "#757575"} strokeWidth={2.2} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        color: isDark ? '#F8FAFC' : '#212121',
                        fontSize: 15,
                        fontWeight: '600',
                        letterSpacing: -0.3
                    }}>
                        {label}
                    </Text>
                    {value ? (
                        <Text style={{
                            color: '#757575',
                            fontSize: 12,
                            fontWeight: '500',
                            marginTop: 1
                        }}>
                            {value}
                        </Text>
                    ) : null}
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {rightElement ? rightElement : (
                    <ChevronRight size={18} color={isDark ? "#334155" : "#E0E0E0"} strokeWidth={2.5} />
                )}
            </View>
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
        <SafeAreaView className="flex-1 bg-white dark:bg-[#0F172A]" edges={['top']}>
            <View className="px-6 py-4 flex-row justify-between items-center bg-white dark:bg-[#0F172A]">
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)')}
                    style={{
                        width: 44,
                        height: 44,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 15,
                        backgroundColor: isDark ? '#1E293B' : '#F5F5F5',
                        borderWidth: 1,
                        borderColor: isDark ? '#334155' : '#E0E0E0'
                    }}
                >
                    <ChevronLeft size={22} color={isDark ? "#F8FAFC" : "#212121"} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={{
                    color: isDark ? '#F8FAFC' : '#212121',
                    fontSize: 20,
                    fontWeight: '900',
                    letterSpacing: -0.5
                }}>
                    {t("my_profile")}
                </Text>
                <ThemeToggle />
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                <View className="py-6">
                    <View
                        style={{
                            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                            padding: 24,
                            borderRadius: 32,
                            borderWidth: 1,
                            borderColor: isDark ? '#334155' : '#F5F5F5',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: isDark ? 0 : 0.05,
                            shadowRadius: 20,
                            elevation: isDark ? 0 : 4,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <View style={{
                            width: 72,
                            height: 72,
                            borderRadius: 26,
                            backgroundColor: isDark ? '#0F172A' : '#E0F2FE',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 20,
                            borderWidth: 1,
                            borderColor: isDark ? '#334155' : '#4FC3F7'
                        }}>
                            <User size={34} color="#0288D1" strokeWidth={2.5} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                color: isDark ? '#F8FAFC' : '#212121',
                                fontSize: 22,
                                fontWeight: '900',
                                letterSpacing: -0.5
                            }}>
                                {userProfile?.name || 'Hydrator'}
                            </Text>
                            <View style={{
                                backgroundColor: isDark ? '#0F172A' : '#4FC3F733',
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 10,
                                alignSelf: 'flex-start',
                                marginTop: 6,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Droplets size={12} color="#00BCD4" strokeWidth={3} style={{ marginRight: 4 }} />
                                <Text style={{
                                    color: '#0288D1',
                                    fontSize: 11,
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5
                                }}>
                                    {userProfile?.dailyGoal} ML GOAL
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => Alert.alert("Notifications", "All hydration alerts are active! 🔔")}
                            activeOpacity={0.7}
                            style={{
                                backgroundColor: isDark ? '#0F172A' : '#F5F5F5',
                                width: 48,
                                height: 48,
                                borderRadius: 18,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: isDark ? '#334155' : '#E0E0E0'
                            }}
                        >
                            <Bell size={20} color="#00BCD4" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: isDark ? '#1E293B' : '#F5F5F5',
                        padding: 16,
                        borderRadius: 24,
                        marginRight: 12,
                        borderWidth: 1,
                        borderColor: isDark ? '#334155' : '#E0E0E0'
                    }}>
                        <Text style={{ color: '#757575', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>{t("weight")}</Text>
                        <Text style={{ color: isDark ? '#F8FAFC' : '#212121', fontSize: 18, fontWeight: '900', marginTop: 4 }}>{userProfile?.weight || '--'} <Text style={{ fontSize: 13, color: '#757575' }}>{t("kg")}</Text></Text>
                    </View>
                    <View style={{
                        flex: 1,
                        backgroundColor: isDark ? '#1E293B' : '#F5F5F5',
                        padding: 16,
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: isDark ? '#334155' : '#E0E0E0'
                    }}>
                        <Text style={{ color: '#757575', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>{t("height")}</Text>
                        <Text style={{ color: isDark ? '#F8FAFC' : '#212121', fontSize: 18, fontWeight: '900', marginTop: 4 }}>{userProfile?.height || '--'} <Text style={{ fontSize: 13, color: '#757575' }}>{t("cm")}</Text></Text>
                    </View>
                </View>

                <View className="mb-10">
                    <Text style={{
                        color: '#757575',
                        fontSize: 11,
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        marginBottom: 16,
                        marginLeft: 4
                    }}>
                        {t("appearance")}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: isDark ? '#1E293B' : '#F5F5F5',
                        padding: 6,
                        borderRadius: 24,
                        borderWidth: 1,
                        borderColor: isDark ? '#334155' : '#E0E0E0'
                    }}>
                        <TouchableOpacity
                            onPress={() => handleToggleTheme('light')}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 14,
                                borderRadius: 18,
                                backgroundColor: !isDark ? 'white' : 'transparent',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: !isDark ? 0.08 : 0,
                                shadowRadius: 10,
                                elevation: !isDark ? 3 : 0
                            }}
                        >
                            <Sun size={18} color={!isDark ? "#FFA726" : "#757575"} strokeWidth={!isDark ? 3 : 2} />
                            <Text style={{
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                fontSize: 10,
                                letterSpacing: 1.5,
                                marginLeft: 8,
                                color: !isDark ? '#212121' : '#757575'
                            }}>{t("light")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleToggleTheme('dark')}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 14,
                                borderRadius: 18,
                                backgroundColor: isDark ? '#0288D1' : 'transparent',
                                shadowColor: '#0288D1',
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: isDark ? 0.4 : 0,
                                shadowRadius: 12,
                                elevation: isDark ? 8 : 0
                            }}
                        >
                            <Moon size={18} color={isDark ? "white" : "#757575"} strokeWidth={isDark ? 3 : 2} />
                            <Text style={{
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                fontSize: 10,
                                letterSpacing: 1.5,
                                marginLeft: 8,
                                color: isDark ? 'white' : '#757575'
                            }}>{t("dark")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-10">
                    <Text style={{
                        color: '#757575',
                        fontSize: 11,
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        marginBottom: 12,
                        marginLeft: 4
                    }}>
                        {t("settings")}
                    </Text>
                    <View style={{
                        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                        paddingHorizontal: 20,
                        borderRadius: 28,
                        borderWidth: 1,
                        borderColor: isDark ? '#334155' : '#F5F5F5',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isDark ? 0 : 0.02,
                        shadowRadius: 10,
                        elevation: isDark ? 0 : 1
                    }}>
                        <SettingItem
                            icon={Languages}
                            label={t("language")}
                            value={i18n.language === 'en' ? 'English' : 'বাংলা'}
                            color="#0288D1"
                            onPress={toggleLanguage}
                        />
                        <SettingItem
                            icon={Lock}
                            label={t("change_password")}
                            color="#F44336"
                            onPress={() => router.push('/settings/password')}
                        />
                        <SettingItem
                            icon={Users}
                            label={t("invite")}
                            color="#66BB6A"
                            onPress={() => router.push('/settings/invite')}
                        />
                        <SettingItem
                            icon={HelpCircle}
                            label={t("faq")}
                            color="#00BCD4"
                            onPress={() => router.push('/settings/faq')}
                        />
                        <SettingItem
                            icon={Info}
                            label={t("about")}
                            color="#757575"
                            showBorder={false}
                            onPress={() => router.push('/settings/about')}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSignOut}
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: isDark ? '#1E293B' : '#F5F5F5',
                        paddingVertical: 18,
                        flexDirection: 'row',
                        borderRadius: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                        borderWidth: 1,
                        borderColor: isDark ? '#F4433644' : '#F4433622',
                    }}
                >
                    <LogOut size={20} color="#F44336" strokeWidth={2.5} />
                    <Text style={{ color: '#F44336', fontWeight: '800', fontSize: 16, marginLeft: 12 }}>{t("sign_out")}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
