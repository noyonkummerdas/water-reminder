import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Beer, Wine, GlassWater as Lemonade, IceCream as Milk, Soup as Tea, Plus, Minus, Shovel as Shaker } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

import { router } from 'expo-router';
import { saveIntake, getProfile, getIntakeForDate, getTodayStr } from '../../utils/storage';

const DRINK_TYPES = [
    { id: 'beer', name: 'Beer', icon: Beer, color: '#F59E0B' },
    { id: 'protein', name: 'Protein', icon: Shaker, color: '#F97316' },
    { id: 'strong_alcohol', name: 'Strong alcohol', icon: Wine, color: '#EF4444' },
    { id: 'lemonade', name: 'Lemonade', icon: Lemonade, color: '#00BDD6' },
    { id: 'milkshake', name: 'Milkshake', icon: Milk, color: '#EC4899' },
    { id: 'herbal_tea', name: 'Herbal tea', icon: Tea, color: '#10B981' },
];


export default function AddDrinkScreen() {
    const { t } = useTranslation();
    const { colorScheme } = useColorScheme();

    const [amount, setAmount] = useState(250);
    const [dailyGoal, setDailyGoal] = useState(2500);
    const [currentIntake, setCurrentIntake] = useState(0);

    const isGoalReached = currentIntake >= dailyGoal && dailyGoal > 0;

    useEffect(() => {
        const loadInitialData = async () => {
            const profile = await getProfile();
            const goal = profile?.dailyGoal || 2500;
            setDailyGoal(goal);

            const todayData = await getIntakeForDate(getTodayStr(), goal);
            setCurrentIntake(todayData.intake);
        };
        loadInitialData();
    }, []);

    const handleAdd = async (customAmount?: number) => {
        if (isGoalReached) return;
        const intakeAmount = customAmount || amount;
        await saveIntake(intakeAmount, dailyGoal);
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-background dark:bg-dark-background" edges={['top']}>
            <View className="px-6 py-4 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-11 h-11 items-center justify-center rounded-2xl bg-white dark:bg-dark-surface shadow-sm border border-slate-50 dark:border-slate-800"
                >
                    <X size={22} color={colorScheme === 'dark' ? "#F8FAFC" : "#1E293B"} />
                </TouchableOpacity>
                <Text className="text-[#1E293B] dark:text-white font-black text-xl text-center flex-1">{t("add_drink")}</Text>
                <View className="w-11" />
            </View>

            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                {isGoalReached && (
                    <View className="mx-2 mb-6 bg-slate-100 dark:bg-slate-800 p-6 rounded-[32px] border border-slate-200 dark:border-slate-700 items-center">
                        <Text className="text-[#94A3B8] dark:text-slate-400 font-bold text-xs text-center px-4">
                            {t("add_restricted")}
                        </Text>
                    </View>
                )}

                <View className="flex-row flex-wrap justify-center opacity-100" style={{ opacity: isGoalReached ? 0.5 : 1 }}>
                    {DRINK_TYPES.map((drink) => {
                        const Icon = drink.icon;
                        return (
                            <TouchableOpacity
                                key={drink.id}
                                disabled={isGoalReached}
                                className="w-[30%] aspect-square bg-white dark:bg-dark-surface p-4 rounded-[32px] m-[1.5%] shadow-sm border border-slate-50 dark:border-slate-800 items-center justify-center"
                                onPress={() => handleAdd(250)}
                            >
                                <View
                                    className="w-13 h-13 rounded-2xl items-center justify-center mb-3"
                                    style={{ backgroundColor: `${drink.color}${colorScheme === 'dark' ? '20' : '10'}` }}
                                >
                                    <Icon size={26} color={drink.color} />
                                </View>
                                <Text className="text-[#1E293B] dark:text-white font-bold text-[10px] text-center leading-3" numberOfLines={2}>{t(drink.id)}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Main Volume Input Card */}
                <View className="mt-8 mx-2 bg-white dark:bg-dark-surface p-10 rounded-[44px] shadow-sm border border-slate-50 dark:border-slate-800 items-center" style={{ opacity: isGoalReached ? 0.5 : 1 }}>
                    <Text className="text-[#94A3B8] dark:text-slate-400 text-[10px] font-bold uppercase tracking-[2px] mb-6">{t("volume")}</Text>
                    <View className="flex-row items-baseline mb-10">
                        <Text className="text-[#1E293B] dark:text-white font-black text-6xl">{amount}</Text>
                        <Text className="text-[#00BDD6] font-bold text-2xl ml-2">{t("ml")}</Text>
                    </View>

                    <View className="flex-row w-full justify-center items-center gap-4">
                        <TouchableOpacity
                            disabled={isGoalReached}
                            className="w-16 h-16 bg-[#F8FAFB] dark:bg-slate-800 rounded-2xl items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm"
                            onPress={() => setAmount(Math.max(0, amount - 50))}
                        >
                            <Minus size={24} color={colorScheme === 'dark' ? "#F8FAFC" : "#1E293B"} strokeWidth={2.5} />
                        </TouchableOpacity>

                        <View className="flex-row">
                            {[100, 250, 500].map(val => (
                                <TouchableOpacity
                                    key={val}
                                    disabled={isGoalReached}
                                    onPress={() => setAmount(val)}
                                    className={`mx-1.5 px-5 py-2.5 rounded-[18px] ${amount === val ? 'bg-[#00BDD6]' : 'bg-[#F1F5F9] dark:bg-slate-800'}`}
                                >
                                    <Text className={`font-black text-sm ${amount === val ? 'text-white' : 'text-[#94A3B8] dark:text-slate-400'}`}>{val}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            disabled={isGoalReached}
                            className="w-16 h-16 bg-[#F8FAFB] dark:bg-slate-800 rounded-2xl items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm"
                            onPress={() => setAmount(amount + 50)}
                        >
                            <Plus size={24} color={colorScheme === 'dark' ? "#F8FAFC" : "#1E293B"} strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    disabled={isGoalReached}
                    className={`mt-8 mx-2 py-6 rounded-[32px] shadow-lg items-center mb-12 ${isGoalReached ? 'bg-slate-300 shadow-none' : 'bg-[#00BDD6] shadow-[#00BDD6]/40'}`}
                    onPress={() => handleAdd()}
                >
                    <Text className="text-white font-black text-xl">{t("add_intake")}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
