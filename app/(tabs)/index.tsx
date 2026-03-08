import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BadgeCheck, Plus, User, CheckCircle2 } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import WaterJar from '../../components/WaterJar';
import { getProfile, getIntakeForDate, saveIntake, getTodayStr, UserProfile } from '../../utils/storage';

export default function HomeScreen() {
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
        <SafeAreaView className="flex-1 bg-[#F8FAFB]" edges={['top']}>
            <View className="flex-1">
                <View className="px-6 py-4 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-full bg-slate-100 mr-3 border-2 border-white shadow-sm overflow-hidden items-center justify-center">
                            <View className="bg-primary/20 w-full h-full items-center justify-center">
                                <User size={20} color="#00BDD6" />
                            </View>
                        </View>
                        <View>
                            <Text className="text-[#1E293B] font-bold text-lg">{userName}</Text>
                            <View className="flex-row items-center">
                                <Text className="text-[#94A3B8] text-[10px] uppercase font-bold tracking-widest">
                                    Goal: {dailyGoal} ml
                                </Text>
                                <Text className="mx-1.5 text-[#CBD5E1] text-[10px]">•</Text>
                                <Text className="text-[#00BDD6] text-[10px] uppercase font-bold">
                                    {gender}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity className="w-11 h-11 items-center justify-center rounded-full bg-white shadow-sm border border-slate-50">
                        <BadgeCheck size={22} color={isGoalReached ? "#00BDD6" : "#CBD5E1"} strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150 }}
                >
                    <View className="items-center mt-6 px-6">
                        <View className="flex-row items-center">
                            <Text className="text-[#00BDD6] font-black text-4xl">{consumption} ML</Text>
                            <Text className="text-[#1E293B] font-black text-3xl ml-3">so far 🎯</Text>
                        </View>

                        {isGoalReached ? (
                            <View className="mt-4 flex-row items-center bg-[#DCFCE7] px-4 py-2 rounded-2xl">
                                <CheckCircle2 size={16} color="#22C55E" strokeWidth={3} />
                                <Text className="text-[#15803D] font-bold text-xs ml-2">Daily Goal Achieved! 🎉</Text>
                            </View>
                        ) : (
                            <Text className="text-[#94A3B8] text-xs font-semibold mt-4 text-center">
                                You've reached <Text className="text-[#00BDD6] font-bold">{percentage}%</Text> of your daily hydration goal.
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
                                className={`flex-1 mx-2 py-6 rounded-[36px] shadow-sm border items-center justify-center active:scale-95 transition-all ${isGoalReached ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-50'}`}
                            >
                                <View className={`p-2 rounded-2xl mb-2 ${isGoalReached ? 'bg-slate-200' : 'bg-[#00BDD6]/10'}`}>
                                    <Plus size={20} color={isGoalReached ? "#94A3B8" : "#00BDD6"} strokeWidth={3} />
                                </View>
                                <Text className={`font-black text-lg ${isGoalReached ? 'text-slate-400' : 'text-[#1E293B]'}`}>+{amount}</Text>
                                <Text className={`text-[10px] font-bold uppercase ${isGoalReached ? 'text-slate-300' : 'text-[#94A3B8]'}`}>ML</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {isGoalReached && (
                        <View className="px-10 mt-2">
                            <Text className="text-[#94A3B8] text-[10px] text-center font-bold uppercase tracking-wider leading-5">
                                You've reached your maximum limit for today. {"\n"}See you tomorrow! 👋
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
