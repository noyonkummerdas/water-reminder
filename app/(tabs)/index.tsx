import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BadgeCheck, Plus, User, CheckCircle2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

import { useFocusEffect } from '@react-navigation/native';
import WaterJar from '../../components/WaterJar';
import { getTodayStr, getIntakeForDate, getProfile, UserProfile, saveIntake } from '../../utils/storage';

import ThemeToggle from '../../components/ThemeToggle';

export default function HomeScreen() {
    const { t } = useTranslation();
    const { colorScheme } = useColorScheme();

    const [consumption, setConsumption] = useState(0);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        const profile = await getProfile();
        const defaultGoal = profile?.dailyGoal || 2500;
        const userId = profile?.id || 'default';

        // Load intake and goal for today
        const todayData = await getIntakeForDate(getTodayStr(), defaultGoal, userId);

        if (profile) setUserProfile(profile);
        setConsumption(todayData.intake);
        setIsLoading(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    // Dynamic Goal from profile (current)
    const dailyGoal = userProfile?.dailyGoal || 2500;
    const gender = userProfile?.gender || 'male';
    const userName = userProfile?.name || 'HL Cody';

    // Percentage starts from 0 on first add for a new account
    let percentage = dailyGoal > 0 ? Math.min(Math.round((consumption / dailyGoal) * 100), 100) : 0;
    if (isNaN(percentage)) percentage = 0;
    const isGoalReached = percentage >= 100;

    const handleQuickAdd = async (amount: number) => {
        if (isGoalReached) return;
        const newTotal = await saveIntake(amount, dailyGoal, userProfile?.id || 'default');
        setConsumption(newTotal);
    };

    if (isLoading && !userProfile) return null;

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-[#0F172A]" edges={['top']}>
            <View className="flex-1">
                <View className="px-6 py-4 flex-row justify-between items-center bg-white dark:bg-[#0F172A]">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-2xl bg-[#F5F5F5] dark:bg-[#1E293B] mr-4 border border-[#E0E0E0] dark:border-[#334155] items-center justify-center">
                            <User size={22} color="#0288D1" strokeWidth={2.5} />
                        </View>
                        <View>
                            <Text className="text-[#212121] dark:text-white font-black text-lg tracking-tight">{userName}</Text>
                            <View className="flex-row items-center">
                                <Text className="text-[#757575] dark:text-[#94A3B8] text-[10px] uppercase font-black tracking-widest">
                                    {t("goal")}: {dailyGoal} ML
                                </Text>
                                <View className="w-1 h-1 rounded-full bg-[#00BCD4] mx-2" />
                                <Text className="text-[#0288D1] text-[10px] uppercase font-black tracking-widest">
                                    {t(gender)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row items-center space-x-3">
                        <ThemeToggle />
                        <TouchableOpacity className="w-11 h-11 items-center justify-center rounded-2xl bg-[#F5F5F5] dark:bg-[#1E293B] border border-[#E0E0E0] dark:border-[#334155]">
                            <BadgeCheck size={22} color={isGoalReached ? "#66BB6A" : "#757575"} strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150 }}
                >
                    <View className="items-center mt-8 px-6">
                        <View className="flex-row items-baseline">
                            <Text className="text-[#0288D1] font-black text-5xl">{consumption}</Text>
                            <Text className="text-[#00BCD4] font-black text-2xl ml-1">{t("ml")}</Text>
                            <Text className="text-[#212121] dark:text-white font-black text-3xl ml-3">{t("so_far")} 🎯</Text>
                        </View>

                        {isGoalReached ? (
                            <View className="mt-6 flex-row items-center bg-[#A5D6A744] px-5 py-2.5 rounded-2xl border border-[#A5D6A7]">
                                <CheckCircle2 size={16} color="#66BB6A" strokeWidth={3} />
                                <Text className="text-[#66BB6A] font-black text-xs ml-2 tracking-wide uppercase">{t("achieved")} 🎉</Text>
                            </View>
                        ) : (
                            <Text className="text-[#757575] dark:text-[#94A3B8] text-xs font-bold mt-4 text-center px-10 tracking-tight leading-4">
                                {t("hydration_progress", { percentage })}
                            </Text>
                        )}
                    </View>

                    <View className="items-center py-6">
                        <WaterJar percentage={percentage} ml={consumption} />
                    </View>

                    <View className="px-6 py-4 flex-row justify-between">
                        {[100, 250, 500].map((amount) => (
                            <TouchableOpacity
                                key={amount}
                                disabled={isGoalReached}
                                onPress={() => handleQuickAdd(amount)}
                                activeOpacity={0.7}
                                className={`flex-1 mx-2 py-7 rounded-[40px] shadow-sm border items-center justify-center active:scale-95 transition-all ${isGoalReached ? 'bg-[#F5F5F5] dark:bg-[#0F172A] border-[#E0E0E0] dark:border-[#1E293B]' : 'bg-white dark:bg-[#1E293B] border-[#F5F5F5] dark:border-[#334155]'}`}
                                style={!isGoalReached ? {
                                    shadowColor: '#0288D1',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 8,
                                    elevation: 2
                                } : {}}
                            >
                                <View className={`p-2.5 rounded-2xl mb-3 ${isGoalReached ? 'bg-[#E0E0E0] dark:bg-[#1E293B]' : 'bg-[#0288D1]15'}`} style={!isGoalReached ? { backgroundColor: '#0288D115' } : {}}>
                                    <Plus size={20} color={isGoalReached ? "#757575" : "#0288D1"} strokeWidth={3} />
                                </View>
                                <Text className={`font-black text-xl ${isGoalReached ? 'text-[#E0E0E0] dark:text-[#334155]' : 'text-[#212121] dark:text-white'}`}>+{amount}</Text>
                                <Text className={`text-[10px] font-black uppercase tracking-widest ${isGoalReached ? 'text-[#E0E0E0] dark:text-[#334155]' : 'text-[#00BCD4]'}`}>{t("ml")}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {isGoalReached && (
                        <View className="px-10 mt-4 flex-row items-center justify-center">
                            <View className="h-[1px] flex-1 bg-[#E0E0E0] dark:bg-[#1E293B]" />
                            <Text className="text-[#757575] dark:text-[#94A3B8] text-[10px] mx-4 font-black uppercase tracking-widest">
                                {t("max_limit")} 👋
                            </Text>
                            <View className="h-[1px] flex-1 bg-[#E0E0E0] dark:bg-[#1E293B]" />
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
