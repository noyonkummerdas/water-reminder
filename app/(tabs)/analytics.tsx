import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar as CalendarIcon, Droplets, TrendingUp, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INTAKE_HISTORY_KEY, USER_PROFILE_KEY, getTodayStr, DayData } from '../../utils/storage';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
    const todayStr = getTodayStr();
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [history, setHistory] = useState<Record<string, DayData>>({});
    const [currentProfileGoal, setCurrentProfileGoal] = useState(2500);

    const loadHistory = useCallback(async () => {
        try {
            const historyData = await AsyncStorage.getItem(INTAKE_HISTORY_KEY);
            const profileData = await AsyncStorage.getItem(USER_PROFILE_KEY);

            if (historyData) setHistory(JSON.parse(historyData));
            if (profileData) {
                const profile = JSON.parse(profileData);
                setCurrentProfileGoal(profile.dailyGoal || 2500);
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [loadHistory])
    );

    // Get data for selected date
    const dayData = useMemo(() => {
        return history[selectedDate] || { intake: 0, goal: currentProfileGoal };
    }, [history, selectedDate, currentProfileGoal]);

    const percentage = dayData.goal > 0 ? Math.min(Math.round((dayData.intake / dayData.goal) * 100), 100) : 0;

    // Calendar Calculations
    const currentDate = new Date();
    const currentMonthLabel = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Circle Math
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

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFB]" edges={['top']}>
            <View className="flex-1">
                {/* Header */}
                <View className="px-6 py-4 flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-11 h-11 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50"
                    >
                        <ChevronLeft size={22} color="#1E293B" />
                    </TouchableOpacity>
                    <Text className="text-[#1E293B] font-black text-xl">Statistics</Text>
                    <View className="w-11" />
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    {/* View Mode Toggle */}
                    <View className="px-6 py-4 flex-row justify-between items-center">
                        <TouchableOpacity
                            onPress={() => setViewMode(viewMode === 'week' ? 'month' : 'week')}
                            className="flex-row items-center bg-[#00BDD6] px-5 py-3.5 rounded-[16px] shadow-lg"
                        >
                            <Text className="text-white font-bold text-sm mr-2">
                                {viewMode === 'week' ? 'Recent Days' : `${currentMonthLabel} ${currentYear}`}
                            </Text>
                            <ChevronRight size={16} color="white" style={{ transform: [{ rotate: '90deg' }] }} />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-13 h-13 items-center justify-center rounded-[16px] bg-white shadow-sm border border-slate-50">
                            <CalendarIcon size={22} color="#00BDD6" />
                        </TouchableOpacity>
                    </View>

                    {/* Horizontal Calendar */}
                    <View className="px-6 mb-6">
                        <View className="bg-white p-6 rounded-[20px] shadow-lg border border-slate-100">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {Array.from({ length: viewMode === 'week' ? 10 : daysInMonth }, (_, i) => {
                                    const dayNum = viewMode === 'week' ? (currentDate.getDate() - 9 + i) : (i + 1);
                                    const dateStr = formatDateStr(dayNum);

                                    const tempDate = new Date(currentYear, currentMonthIndex, dayNum);
                                    const dayName = weekDays[tempDate.getDay()];
                                    const displayDay = tempDate.getDate();

                                    const isSelected = selectedDate === dateStr;
                                    const isToday = todayStr === dateStr;

                                    const dayStats = history[dateStr] || { intake: 0, goal: currentProfileGoal };
                                    const hasData = dayStats.intake > 0;
                                    const isCompleted = dayStats.intake >= dayStats.goal;

                                    return (
                                        <TouchableOpacity
                                            key={dateStr}
                                            onPress={() => setSelectedDate(dateStr)}
                                            className={`items-center justify-center w-14 h-26 rounded-[20px] mr-3 ${isSelected ? 'bg-[#00BDD6]' : isToday ? 'bg-[#E6F4FE]' : 'bg-[#F8FAFB]'}`}
                                        >
                                            <View className="items-center justify-center">
                                                <Text className={`text-[10px] font-bold uppercase mb-2 ${isSelected ? 'text-white/70' : isToday ? 'text-[#00BDD6]' : 'text-[#94A3B8]'}`}>
                                                    {dayName}
                                                </Text>
                                                <Text className={`font-black text-lg ${isSelected ? 'text-white' : 'text-[#1E293B]'}`}>
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

                    {/* Progress Card */}
                    <View className="px-6 py-4">
                        <View className="bg-white p-8 rounded-[10px] shadow-lg border border-slate-100">
                            <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-6">
                                {selectedDate === todayStr ? "Today's Progress" : `Progress for ${selectedDate}`}
                            </Text>
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <View className="flex-row items-baseline">
                                        <Text className="text-[#1E293B] font-black text-6xl">{percentage}</Text>
                                        <Text className="text-[#1E293B] font-bold text-2xl ml-1">%</Text>
                                    </View>
                                    <Text className="text-[#94A3B8] text-xs mt-2 w-36 leading-5">
                                        {percentage >= 100 ? 'Hydration complete! 🌟' : 'Keep drinking to reach your goal!'}
                                    </Text>
                                </View>
                                <View className="relative">
                                    <Svg width="110" height="110" viewBox="0 0 100 100">
                                        <Circle cx="50" cy="50" r="42" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                                        <Circle
                                            cx="50" cy="50" r="42"
                                            stroke="#00BDD6" strokeWidth="12"
                                            fill="#E6F4FE"
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

                    {/* Stats Summary */}
                    <View className="px-6 py-2 flex-row justify-between">
                        <View className="flex-1 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 mr-2">
                            <View className="bg-[#E6F4FE] w-12 h-12 items-center justify-center rounded-xl mb-4">
                                <Droplets size={24} color="#00BDD6" />
                            </View>
                            <Text className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-wider mb-2">Total Intake</Text>
                            <View className="flex-row items-baseline">
                                <Text className="text-[#1E293B] font-black text-2xl">{(dayData.intake / 1000).toFixed(2)}</Text>
                                <Text className="text-[#94A3B8] font-bold text-base ml-1.5">L</Text>
                            </View>
                        </View>

                        <View className="flex-1 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 ml-2">
                            <View className="bg-[#DCFCE7] w-12 h-12 items-center justify-center rounded-xl mb-4">
                                <TrendingUp size={24} color="#22C55E" />
                            </View>
                            <Text className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-wider mb-2">Daily Goal</Text>
                            <View className="flex-row items-baseline">
                                <Text className="text-[#1E293B] font-black text-2xl">{(dayData.goal / 1000).toFixed(1)}</Text>
                                <Text className="text-[#94A3B8] font-bold text-base ml-1.5">L</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
