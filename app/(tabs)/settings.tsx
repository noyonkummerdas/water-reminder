import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2, Droplets, Clock, CheckCircle2, Bell } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayStr, getIntakeForDate, getProfile, UserProfile, DayData, INTAKE_HISTORY_PREFIX, calculateSchedule } from '../../utils/storage';

export default function DrinkHistoryScreen() {
    const { t } = useTranslation();
    const { colorScheme } = useColorScheme();

    const [history, setHistory] = useState<DayData | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [reminderStats, setReminderStats] = useState({ total: 0, left: 0 });
    const [fullSchedule, setFullSchedule] = useState<{ time: string, amount: number }[]>([]);

    const loadData = useCallback(async () => {
        const profile = await getProfile();
        setUserProfile(profile);
        const data = await getIntakeForDate(getTodayStr(), profile?.dailyGoal || 2500, profile?.id || 'default');
        setHistory(data);

        if (profile) {
            const schedule = calculateSchedule(profile, data.intake);
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            let leftCount = 0;
            for (const item of schedule) {
                const [h, m] = item.time.split(':').map(Number);
                if (h * 60 + m > currentMinutes) leftCount++;
            }
            setReminderStats({ total: schedule.length, left: leftCount });
            setFullSchedule(schedule);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleDeleteLog = async (logId: string) => {
        Alert.alert(
            t("delete_entry"),
            t("delete_confirm"),
            [
                { text: t("cancel"), style: "cancel" },
                {
                    text: t("delete"),
                    style: "destructive",
                    onPress: async () => {
                        if (!history || !userProfile) return;
                        const newLogs = history.logs.filter(log => log.id !== logId);
                        const newIntake = newLogs.reduce((acc, log) => acc + log.amount, 0);
                        const updatedData = { ...history, logs: newLogs, intake: newIntake };

                        const key = `${INTAKE_HISTORY_PREFIX}${userProfile.id}_${getTodayStr()}`;
                        await AsyncStorage.setItem(key, JSON.stringify(updatedData));

                        // Full reload to update schedule details
                        loadData();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-dark-background" edges={['top']}>
            <View className="px-6 py-4 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => router.replace('/(tabs)')}
                    className="w-11 h-11 items-center justify-center rounded-2xl bg-white dark:bg-dark-surface shadow-sm border border-slate-50 dark:border-slate-800"
                >
                    <ChevronLeft size={22} color={colorScheme === 'dark' ? "#F8FAFC" : "#1E293B"} />
                </TouchableOpacity>
                <Text className="text-[#1E293B] dark:text-white font-black text-xl text-center flex-1">{t("history")}</Text>
                <View className="w-11" />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="py-6">
                    <View className="bg-[#00BDD6] p-8 rounded-[32px] shadow-lg shadow-[#00BDD6]/20 flex-row items-center justify-between">
                        <View>
                            <Text className="text-white/70 font-bold text-[10px] uppercase tracking-[1px] mb-1">{t("total_drank")}</Text>
                            <View className="flex-row items-baseline">
                                <Text className="text-white font-black text-4xl">{history?.intake || 0}</Text>
                                <Text className="text-white/80 font-bold text-lg ml-2">{t("ml")}</Text>
                            </View>
                        </View>
                        <View className="bg-white/20 p-4 rounded-2xl">
                            <Droplets size={32} color="white" />
                        </View>
                    </View>
                </View>

                <Text className="text-[#94A3B8] dark:text-slate-400 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">{t("daily_schedule_overview")}</Text>

                <View className="bg-white dark:bg-dark-surface p-6 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 mb-8 flex-row items-center justify-between">
                    <View className="flex-1 border-r border-slate-100 dark:border-slate-800 items-center justify-center">
                        <Text className="text-[#94A3B8] font-bold text-[10px] uppercase tracking-[1px] mb-2">{t("total_reminders")}</Text>
                        <Text className="text-[#1E293B] dark:text-white font-black text-3xl">{reminderStats.total}</Text>
                    </View>
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-[#94A3B8] font-bold text-[10px] uppercase tracking-[1px] mb-2">{t("left_today")}</Text>
                        <Text className="text-[#00BDD6] font-black text-3xl">{reminderStats.left}</Text>
                    </View>
                </View>

                {fullSchedule.length > 0 && (
                    <View className="mb-10">
                        <Text className="text-[#94A3B8] dark:text-slate-400 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">{t("upcoming_reminders")}</Text>

                        {fullSchedule.map((item, index) => {
                            const [h, m] = item.time.split(':').map(Number);
                            const now = new Date();
                            const currentMinutes = now.getHours() * 60 + now.getMinutes();
                            const hasPassed = h * 60 + m <= currentMinutes;

                            return (
                                <View key={`sched-${index}`} className={`p-4 rounded-[24px] mb-3 flex-row items-center justify-between border ${hasPassed ? 'bg-white/50 dark:bg-dark-surface/50 border-slate-50 dark:border-slate-800' : 'bg-white dark:bg-dark-surface border-slate-100 dark:border-slate-700 shadow-sm'}`}>
                                    <View className="flex-row items-center">
                                        <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${hasPassed ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-[#00BDD6]/10 dark:bg-[#00BDD6]/5'}`}>
                                            {hasPassed ? (
                                                <CheckCircle2 size={20} color="#94A3B8" />
                                            ) : (
                                                <Bell size={20} color="#00BDD6" />
                                            )}
                                        </View>
                                        <View>
                                            <Text className={`${hasPassed ? 'text-[#94A3B8] font-bold' : 'text-[#1E293B] dark:text-white font-black'} text-base`}>
                                                {item.amount} {t("ml")}
                                            </Text>
                                            <Text className={`${hasPassed ? 'text-slate-400' : 'text-[#94A3B8]'} font-bold text-xs mt-0.5`}>
                                                {item.time}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className={`px-3 py-1.5 rounded-full ${hasPassed ? 'bg-slate-50 dark:bg-slate-800' : 'bg-[#00BDD6]/10'}`}>
                                        <Text className={`text-[10px] font-bold uppercase tracking-wider ${hasPassed ? 'text-slate-400' : 'text-[#00BDD6]'}`}>
                                            {hasPassed ? t("passed") : t("upcoming")}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

                <Text className="text-[#94A3B8] dark:text-slate-400 text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">{t("logs")}</Text>

                {history?.logs && history.logs.length > 0 ? (
                    history.logs.map((log) => (
                        <View key={log.id} className="bg-white dark:bg-dark-surface p-5 rounded-[24px] shadow-sm border border-slate-50 dark:border-slate-800 mb-3 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl items-center justify-center mr-4">
                                    <Clock size={20} color="#00BDD6" />
                                </View>
                                <View>
                                    <Text className="text-[#1E293B] dark:text-white font-black text-base">{log.amount} {t("ml")}</Text>
                                    <Text className="text-[#94A3B8] dark:text-slate-400 font-bold text-xs">{log.time}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleDeleteLog(log.id)} className="p-2">
                                <Trash2 size={18} color="#FF6E71" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>
                    )).reverse() // Show newest first
                ) : (
                    <View className="py-12 items-center justify-center">
                        <Text className="text-[#94A3B8] font-medium text-center">{t("no_logs")}</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
