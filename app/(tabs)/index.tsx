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
        <SafeAreaView className="flex-1 bg-background dark:bg-dark-background" edges={['top']}>
            <View className="flex-1">
                <View className="px-6 py-4 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mr-3 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden items-center justify-center">
                            <View className="bg-primary/20 w-full h-full items-center justify-center">
                                <User size={20} color="#00BDD6" />
                            </View>
                        </View>
                        <View>
                            <Text className="text-[#1E293B] dark:text-white font-bold text-lg">{userName}</Text>
                            <View className="flex-row items-center">
                                <Text className="text-[#94A3B8] dark:text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                                    {t("goal")}: {dailyGoal} {t("ml")}
                                </Text>
                                <Text className="mx-1.5 text-[#CBD5E1] dark:text-slate-600 text-[10px]">•</Text>
                                <Text className="text-[#00BDD6] text-[10px] uppercase font-bold">
                                    {t(gender)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row items-center space-x-3">
                        <ThemeToggle />
                        <TouchableOpacity className="w-11 h-11 items-center justify-center rounded-2xl bg-white dark:bg-dark-surface shadow-sm border border-slate-50 dark:border-slate-800">
                            <BadgeCheck size={22} color={isGoalReached ? "#00BDD6" : (colorScheme === 'dark' ? "#334155" : "#CBD5E1")} strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150 }}
                >
                    <View className="items-center mt-6 px-6">
                        <View className="flex-row items-center">
                            <Text className="text-[#00BDD6] font-black text-4xl">{consumption} {t("ml")}</Text>
                            <Text className="text-[#1E293B] dark:text-white font-black text-3xl ml-3">{t("so_far")} 🎯</Text>
                        </View>

                        {isGoalReached ? (
                            <View className="mt-4 flex-row items-center bg-[#DCFCE7] px-4 py-2 rounded-2xl">
                                <CheckCircle2 size={16} color="#22C55E" strokeWidth={3} />
                                <Text className="text-[#15803D] font-bold text-xs ml-2 text-center">{t("achieved")} 🎉</Text>
                            </View>
                        ) : (
                            <Text className="text-[#94A3B8] dark:text-slate-400 text-xs font-semibold mt-4 text-center px-6">
                                {t("hydration_progress", { percentage })}
                            </Text>
                        )}
                    </View>

                    <View className="items-center py-8">
                        <WaterJar percentage={percentage} ml={consumption} />
                    </View>

                    <View className="px-6 py-6 flex-row justify-between">
                        {[100, 250, 500].map((amount) => (
                            <TouchableOpacity
                                key={amount}
                                disabled={isGoalReached}
                                onPress={() => handleQuickAdd(amount)}
                                className={`flex-1 mx-2 py-6 rounded-[36px] shadow-sm border items-center justify-center active:scale-95 transition-all ${isGoalReached ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'bg-white dark:bg-dark-surface border-slate-50 dark:border-slate-800'}`}
                            >
                                <View className={`p-2 rounded-2xl mb-2 ${isGoalReached ? 'bg-slate-200 dark:bg-slate-700' : 'bg-[#00BDD6]/10'}`}>
                                    <Plus size={20} color={isGoalReached ? (colorScheme === 'dark' ? "#475569" : "#94A3B8") : "#00BDD6"} strokeWidth={3} />
                                </View>
                                <Text className={`font-black text-lg ${isGoalReached ? 'text-slate-400 dark:text-slate-500' : 'text-[#1E293B] dark:text-white'}`}>+{amount}</Text>
                                <Text className={`text-[10px] font-bold uppercase ${isGoalReached ? 'text-slate-300 dark:text-slate-600' : 'text-[#94A3B8]'}`}>{t("ml")}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {isGoalReached && (
                        <View className="px-10 mt-2">
                            <Text className="text-[#94A3B8] dark:text-slate-500 text-[10px] text-center font-bold uppercase tracking-wider leading-5">
                                {t("max_limit")} 👋
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
