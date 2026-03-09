import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar as CalendarIcon, Droplets, TrendingUp, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { getTodayStr, getIntakeForDate, getProfile, UserProfile } from '../../utils/storage';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const { t } = useTranslation();
    const { colorScheme } = useColorScheme();

    const todayStr = getTodayStr();
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [history, setHistory] = useState<Record<string, any>>({});
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const profile = await getProfile();
            setUserProfile(profile);
            const defaultGoal = profile?.dailyGoal || 2500;
            const userId = profile?.id || 'default';

            const newHistory: Record<string, any> = {};
            // Load last 30 days to cover both week and month views
            for (let i = 30; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const dayData = await getIntakeForDate(dateStr, defaultGoal, userId);
                newHistory[dateStr] = dayData;
            }
            setHistory(newHistory);
        } catch (e) {
            console.error("Failed to load history", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const dayData = useMemo(() => {
        return history[selectedDate] || { intake: 0, goal: userProfile?.dailyGoal || 2500 };
    }, [history, selectedDate, userProfile]);

    const percentage = dayData.goal > 0 ? Math.min(Math.round((dayData.intake / dayData.goal) * 100), 100) : 0;

    const currentDate = new Date();
    const currentMonthLabel = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const formatDateStr = (dayNum: number) => {
        const date = new Date(currentYear, currentMonthIndex, dayNum);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    if (isLoading && !userProfile) return null;

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-dark-background" edges={['top']}>
            <View className="flex-1">
                <View className="px-6 py-4 flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-11 h-11 items-center justify-center rounded-2xl bg-white dark:bg-dark-surface shadow-sm border border-slate-50 dark:border-slate-800"
                    >
                        <ChevronLeft size={22} color={colorScheme === 'dark' ? "#F8FAFC" : "#1E293B"} />
                    </TouchableOpacity>
                    <Text className="text-[#1E293B] dark:text-white font-black text-xl text-center flex-1">{t("statistics")}</Text>
                    <View className="w-11" />
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    <View className="px-6 py-4 flex-row justify-between items-center">
                        <TouchableOpacity
                            onPress={() => setViewMode(viewMode === 'week' ? 'month' : 'week')}
                            className="flex-row items-center bg-[#00BDD6] px-5 py-3.5 rounded-[16px] shadow-lg"
                        >
                            <Text className="text-white font-bold text-sm mr-2">
                                {viewMode === 'week' ? t("recent_days") : `${currentMonthLabel} ${currentYear}`}
                            </Text>
                            <ChevronRight size={16} color="white" style={{ transform: [{ rotate: '90deg' }] }} />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-13 h-13 items-center justify-center rounded-[16px] bg-white dark:bg-dark-surface shadow-sm border border-slate-50 dark:border-slate-800">
                            <CalendarIcon size={22} color="#00BDD6" />
                        </TouchableOpacity>
                    </View>

                    <View className="px-6 mb-6">
                        <View className="bg-white dark:bg-dark-surface p-6 rounded-[20px] shadow-lg border border-slate-100 dark:border-slate-800">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {Array.from({ length: viewMode === 'week' ? 10 : daysInMonth }, (_, i) => {
                                    const dayNum = viewMode === 'week' ? (currentDate.getDate() - 9 + i) : (i + 1);
                                    const dateStr = formatDateStr(dayNum);
                                    const tempDate = new Date(currentYear, currentMonthIndex, dayNum);
                                    const dayName = weekDays[tempDate.getDay()];
                                    const displayDay = tempDate.getDate();
                                    const isSelected = selectedDate === dateStr;
                                    const isToday = todayStr === dateStr;
                                    const dayStats = history[dateStr] || { intake: 0, goal: userProfile?.dailyGoal || 2500 };
                                    const hasData = dayStats.intake > 0;
                                    const isCompleted = dayStats.intake >= dayStats.goal;

                                    return (
                                        <TouchableOpacity
                                            key={dateStr}
                                            onPress={() => setSelectedDate(dateStr)}
                                            className={`items-center justify-center w-14 h-26 rounded-[20px] mr-3 ${isSelected ? 'bg-[#00BDD6]' : isToday ? (colorScheme === 'dark' ? 'bg-slate-800' : 'bg-[#E6F4FE]') : (colorScheme === 'dark' ? 'bg-slate-900' : 'bg-[#F8FAFB]')}`}
                                        >
                                            <View className="items-center justify-center">
                                                <Text className={`text-[10px] font-bold uppercase mb-2 ${isSelected ? 'text-white/70' : isToday ? 'text-[#00BDD6]' : 'text-[#94A3B8] dark:text-slate-500'}`}>
                                                    {dayName}
                                                </Text>
                                                <Text className={`font-black text-lg ${isSelected ? 'text-white' : 'text-[#1E293B] dark:text-white'}`}>
                                                    {displayDay}
                                                </Text>
                                                <View className="mt-2 h-4 items-center justify-center">
                                                    {hasData && (
                                                        <Text className={`text-[10px] font-black ${isSelected ? 'text-white' : isCompleted ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                            {isCompleted ? 'C' : 'F'}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>

                    <View className="px-6 py-4">
                        <View className="bg-white dark:bg-dark-surface p-8 rounded-[10px] shadow-lg border border-slate-100 dark:border-slate-800">
                            <Text className="text-[#94A3B8] dark:text-slate-400 text-[10px] font-bold uppercase tracking-[ link text](file:///d%3A/Techsoul/water-reminder/app/%28tabs%29/analytics.tsx#L150-160)2px] mb-6">
                                {selectedDate === todayStr ? t("today_progress") : t("progress_for", { date: selectedDate })}
                            </Text>
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <View className="flex-row items-baseline">
                                        <Text className="text-[#1E293B] dark:text-white font-black text-6xl">{percentage}</Text>
                                        <Text className="text-[#1E293B] dark:text-white font-bold text-2xl ml-1">%</Text>
                                    </View>
                                    <Text className="text-[#94A3B8] dark:text-slate-400 text-xs mt-2 w-36 leading-5">
                                        {percentage >= 100 ? t("hydration_complete") : t("keep_drinking")}
                                    </Text>
                                </View>
                                <View className="relative">
                                    <Svg width="110" height="110" viewBox="0 0 100 100">
                                        <Circle cx="50" cy="50" r="42" stroke={colorScheme === 'dark' ? "#1E293B" : "#F1F5F9"} strokeWidth="12" fill="none" />
                                        <Circle
                                            cx="50" cy="50" r="42"
                                            stroke="#00BDD6" strokeWidth="12"
                                            fill={colorScheme === 'dark' ? "#0F172A" : "#E6F4FE"}
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            strokeLinecap="round"
                                            transform="rotate(-90 50 50)"
                                        />
                                    </Svg>
                                    <View className="absolute inset-0 items-center justify-center">
                                        <Droplets size={28} color="#00BDD6" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="px-6 py-2 flex-row justify-between">
                        <View className="flex-1 bg-white dark:bg-dark-surface p-6 rounded-[30px] shadow-sm border border-slate-100 dark:border-slate-800 mr-2">
                            <View className="bg-[#E6F4FE] dark:bg-slate-800 w-12 h-12 items-center justify-center rounded-xl mb-4">
                                <Droplets size={24} color="#00BDD6" />
                            </View>
                            <Text className="text-[#94A3B8] dark:text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-2">{t("total_intake")}</Text>
                            <View className="flex-row items-baseline">
                                <Text className="text-[#1E293B] dark:text-white font-black text-2xl">{(dayData.intake / 1000).toFixed(2)}</Text>
                                <Text className="text-[#94A3B8] dark:text-slate-400 font-bold text-base ml-1.5">L</Text>
                            </View>
                        </View>

                        <View className="flex-1 bg-white dark:bg-dark-surface p-6 rounded-[30px] shadow-sm border border-slate-100 dark:border-slate-800 ml-2">
                            <View className="bg-[#DCFCE7] dark:bg-slate-800 w-12 h-12 items-center justify-center rounded-xl mb-4">
                                <TrendingUp size={24} color="#22C55E" />
                            </View>
                            <Text className="text-[#94A3B8] dark:text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-2">{t("daily_goal")}</Text>
                            <View className="flex-row items-baseline">
                                <Text className="text-[#1E293B] dark:text-white font-black text-2xl">{(dayData.goal / 1000).toFixed(1)}</Text>
                                <Text className="text-[#94A3B8] dark:text-slate-400 font-bold text-base ml-1.5">L</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
