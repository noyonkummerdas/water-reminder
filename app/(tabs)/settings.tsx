import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2, Droplets, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayStr, getIntakeForDate, getProfile, UserProfile, DayData, INTAKE_HISTORY_PREFIX } from '../../utils/storage';

export default function DrinkHistoryScreen() {
    const { t } = useTranslation();

    const [history, setHistory] = useState<DayData | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const loadData = useCallback(async () => {
        const profile = await getProfile();
        setUserProfile(profile);
        const data = await getIntakeForDate(getTodayStr(), profile?.dailyGoal || 2500, profile?.id || 'default');
        setHistory(data);
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
                        setHistory(updatedData);
                    }
                }
            ]
        );
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
                <Text className="text-[#1E293B] font-black text-xl text-center flex-1">{t("history")}</Text>
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

                <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">{t("logs")}</Text>

                {history?.logs && history.logs.length > 0 ? (
                    history.logs.map((log) => (
                        <View key={log.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-50 mb-3 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center mr-4">
                                    <Clock size={20} color="#00BDD6" />
                                </View>
                                <View>
                                    <Text className="text-[#1E293B] font-black text-base">{log.amount} {t("ml")}</Text>
                                    <Text className="text-[#94A3B8] font-bold text-xs">{log.time}</Text>
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
