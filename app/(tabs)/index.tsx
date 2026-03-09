import { useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, User, Clock, Bell, Droplet, PlusCircle, LayoutGrid, CheckCircle2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import Svg, { Circle, G, Text as SvgText, Defs, LinearGradient, Stop, Path, Rect, ClipPath } from 'react-native-svg';

import { useFocusEffect } from '@react-navigation/native';
import { getTodayStr, getIntakeForDate, getProfile, UserProfile, saveIntake, calculateSchedule, getExpectedIntake } from '../../utils/storage';
import ThemeToggle from '../../components/ThemeToggle';
import { Accelerometer } from 'expo-sensors';
import { Animated, Easing } from 'react-native';

const AnimatedG = Animated.createAnimatedComponent(G);

const { width } = Dimensions.get('window');

const BottleProgress = ({ percentage, consumption, goal, t }: any) => {
    const BOTTLE_WIDTH = 140;
    const BOTTLE_HEIGHT = 280;

    // Invert percentage for SVG coordinates (0 is top, BOTTLE_HEIGHT is bottom)
    const normalizedPercentage = Math.max(0, Math.min(100, percentage));

    // The water height should only fill the body, not the cap/neck area.
    // Let's say the fillable area starts at Y=70 and ends at Y=260.
    const FILLABLE_HEIGHT = 190;
    const FILLABLE_START_Y = 70;
    const waterHeight = (normalizedPercentage / 100) * FILLABLE_HEIGHT;
    const waterY = FILLABLE_START_Y + FILLABLE_HEIGHT - waterHeight;

    const tiltValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Accelerometer.setUpdateInterval(30); // ~33fps
        const subscription = Accelerometer.addListener(({ x, y }) => {
            // Calculate angle. X and Y represent gravity vector.
            // When phone is upright, x ~ 0, y ~ -1. Angle ~ 0.
            // Math.atan2(x, -y) gives angle in radians.
            let angle = Math.atan2(x, -y) * (180 / Math.PI);

            // Clamp it so it doesn't spin wildly
            angle = Math.max(-30, Math.min(30, angle));

            Animated.spring(tiltValue, {
                toValue: angle,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }).start();
        });

        return () => subscription.remove();
    }, []);

    const spin = tiltValue.interpolate({
        inputRange: [-30, 30],
        outputRange: ['-30deg', '30deg']
    });

    return (
        <View className="items-center justify-center relative">
            <Svg width={BOTTLE_WIDTH} height={BOTTLE_HEIGHT} viewBox="0 0 140 280">
                <Defs>
                    {/* Water Gradient */}
                    <LinearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.9" />
                        <Stop offset="20%" stopColor="#29B6F6" stopOpacity="0.85" />
                        <Stop offset="100%" stopColor="#0288D1" stopOpacity="0.9" />
                    </LinearGradient>

                    {/* Missed Water (Red) Gradient */}
                    <LinearGradient id="missedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#EF5350" stopOpacity="0.75" />
                        <Stop offset="100%" stopColor="#E53935" stopOpacity="0.85" />
                    </LinearGradient>

                    {/* Mask that exactly matches the inside of the bottle so water doesn't overflow the glass */}
                    <ClipPath id="bottleMask">
                        <Path d="M50 45 C45 60 30 75 25 100 L20 230 C15 260 30 275 70 275 C110 275 125 260 120 230 L115 100 C110 75 95 60 90 45 Z" />
                    </ClipPath>
                </Defs>

                {/* Back Glass (Light shadow) */}
                <Path d="M50 45 C45 60 30 75 25 100 L20 230 C15 260 30 275 70 275 C110 275 125 260 120 230 L115 100 C110 75 95 60 90 45 Z" fill="#F8FAFC" opacity="0.4" />

                {/* Dynamic Water Fill Group */}
                <G clipPath="url(#bottleMask)">
                    {/* Animated Fill (Both Red and Blue) */}
                    {/* @ts-ignore */}
                    <AnimatedG
                        rotation={tiltValue}
                        originX={70}
                        originY={waterY}
                    >
                        {/* Red Background (Empty/Missed portion) */}
                        <Rect
                            x="-50"
                            y={FILLABLE_START_Y - 50}
                            width="240"
                            height={FILLABLE_HEIGHT + 100}
                            fill="url(#missedGrad)"
                        />

                        {/* Water Fill */}
                        <Rect
                            x="-50"
                            y={waterY}
                            width="240"
                            height={FILLABLE_HEIGHT + 100}
                            fill="url(#waterGrad)"
                        />

                        {/* Water Surface Wave/Ellipse */}
                        {normalizedPercentage > 0 && normalizedPercentage < 100 && (
                            <Circle cx="70" cy={waterY} r={140} fill="white" opacity="0.1" />
                        )}
                    </AnimatedG>
                </G>

                {/* Bottle Ridges / Details */}
                <Path d="M22 140 Q70 155 118 140" fill="none" stroke="white" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
                <Path d="M21 190 Q70 205 119 190" fill="none" stroke="white" strokeWidth="2" opacity="0.5" strokeLinecap="round" />

                {/* Bottle Outline Outline (Glass Edge) */}
                <Path d="M50 45 C45 60 30 75 25 100 L20 230 C15 260 30 275 70 275 C110 275 125 260 120 230 L115 100 C110 75 95 60 90 45 Z" fill="none" stroke="#E6F2F5" strokeWidth="3" opacity="0.8" />
                {/* Left Reflection Highlight */}
                <Path d="M30 110 L28 170" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
                <Path d="M26 195 L25 220" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

                {/* Bottle Neck & Mouth */}
                <Path d="M48 25 L48 45 L92 45 L92 25 Z" fill="#F1F5F9" opacity="0.7" stroke="#E6F2F5" strokeWidth="1" />
                <Path d="M46 25 L94 25 L94 28 L46 28 Z" fill="#E2E8F0" />

                {/* Aqua Cap Details */}
                <Path d="M45 5 C45 2 48 0 50 0 L90 0 C92 0 95 2 95 5 L95 24 L45 24 Z" fill="#00BCD4" />
                {/* Cap Ridges */}
                <Path d="M52 2 L52 22 M60 2 L60 22 M68 2 L68 22 M76 2 L76 22 M84 2 L84 22" fill="none" stroke="#0097A7" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
                <Path d="M48 3 L48 21" fill="none" stroke="white" opacity="0.4" strokeWidth="1.5" />

                {/* Dynamic Measurement Ruler */}
                {(() => {
                    const marks = [];
                    // 1. Draw 100ml dashes first (background layer of ruler)
                    const step = goal > 2500 ? 200 : 100;
                    for (let i = step; i < goal; i += step) {
                        const ratio = i / goal;
                        const yPos = FILLABLE_START_Y + FILLABLE_HEIGHT - (ratio * FILLABLE_HEIGHT);
                        marks.push(
                            <Path
                                key={`tick-${i}`}
                                d={`M 115 ${yPos} L 110 ${yPos}`}
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="1"
                            />
                        );
                    }

                    // 2. Draw 4 major segment labels (Quarter marks)
                    const segments = [0.25, 0.5, 0.75, 1];
                    segments.forEach(perc => {
                        const val = Math.round(goal * perc);
                        const yPos = FILLABLE_START_Y + FILLABLE_HEIGHT - (perc * FILLABLE_HEIGHT);
                        marks.push(
                            <G key={`label-${val}`}>
                                <Path
                                    d={`M 115 ${yPos} L 105 ${yPos}`}
                                    stroke="rgba(255,255,255,0.9)"
                                    strokeWidth="1.5"
                                />
                                <SvgText
                                    x="95"
                                    y={yPos + 3}
                                    fill="rgba(255,255,255,0.9)"
                                    fontSize="9"
                                    fontWeight="900"
                                    textAnchor="end"
                                >
                                    {val} ml
                                </SvgText>
                            </G>
                        );
                    });

                    return marks;
                })()}
            </Svg>
        </View>
    );
};

export default function HomeScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [consumption, setConsumption] = useState(0);
    const [logs, setLogs] = useState<any[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [nextReminder, setNextReminder] = useState<{ time: string, amount: number } | null>(null);

    const formatAmPm = (time: string): string => {
        if (!time) return '';
        if (time.includes('AM') || time.includes('PM') || time.includes('am') || time.includes('pm')) return time;
        const parts = time.split(':');
        if (parts.length < 2) return time;
        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (isNaN(h) || isNaN(m)) return time;
        const period = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 === 0 ? 12 : h % 12;
        return `${hour}:${String(m).padStart(2, '0')} ${period}`;
    };

    const loadData = useCallback(async () => {
        setIsLoading(true);
        const profile = await getProfile();
        const defaultGoal = profile?.dailyGoal || 2450;
        const userId = profile?.id || 'default';

        const todayData = await getIntakeForDate(getTodayStr(), defaultGoal, userId);

        if (profile) {
            setUserProfile(profile);
            const schedule = calculateSchedule(profile, todayData.intake);

            // Find next reminder based on current time
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            let upcoming = null;
            for (const item of schedule) {
                const [h, m] = item.time.split(':').map(Number);
                const itemMinutes = h * 60 + m;
                if (itemMinutes > currentMinutes) {
                    upcoming = { time: item.time, amount: item.amount };
                    break;
                }
            }
            if (!upcoming && schedule.length > 0) {
                // If all passed, maybe they are done, or just show the last one
            }
            setNextReminder(upcoming);
        }

        setConsumption(todayData.intake);
        setLogs(todayData.logs || []);
        setIsLoading(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const dailyGoal = userProfile?.dailyGoal || 2450;
    const userName = userProfile?.name || 'Noyon';

    const expectedIntake = userProfile ? getExpectedIntake(userProfile) : 0;
    const currentWaterInBottle = Math.max(0, dailyGoal - expectedIntake + consumption);

    const remainingAmount = Math.max(dailyGoal - consumption, 0);
    let percentage = dailyGoal > 0 ? Math.min(Math.round((currentWaterInBottle / dailyGoal) * 100), 100) : 100;
    if (isNaN(percentage)) percentage = 100;
    const isGoalReached = consumption >= dailyGoal;

    const handleQuickAdd = async (amount: number) => {
        if (isGoalReached) return;
        await saveIntake(amount, dailyGoal, userProfile?.id || 'default');

        // Fully reload data to recalculate schedule, logs, and consumption
        loadData();
    };

    if (isLoading && !userProfile) return null;

    return (
        <SafeAreaView className="flex-1 bg-[#F5F5F5] dark:bg-[#0F172A]" edges={['top']}>
            <View className="flex-1">
                {/* Header */}
                <View className="px-6 py-6 flex-row justify-between items-center">
                    <View>
                        <Text className="text-[#757575] dark:text-[#94A3B8] text-sm font-bold tracking-tight mb-1">
                            {formatAmPm(`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`)} • 🔔
                        </Text>
                        <Text className="text-[#212121] dark:text-white font-black text-3xl tracking-tight">
                            {t("hello")}, {userName}
                        </Text>
                    </View>
                    <View className="flex-row items-center space-x-3">
                        <ThemeToggle />
                        <TouchableOpacity className="w-12 h-12 bg-white dark:bg-[#1E293B] rounded-2xl items-center justify-center shadow-sm border border-[#E0E0E0] dark:border-[#334155]">
                            <User size={24} color="#0288D1" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150 }}
                >
                    {/* Main Stats Card */}
                    <View className="mx-6 py-6 flex-row items-center justify-center">
                        <BottleProgress
                            percentage={percentage}
                            consumption={consumption}
                            goal={dailyGoal}
                            t={t}
                        />
                    </View>

                    {/* Next Reminder Card */}
                    <View className="mx-6 mt-8 bg-white dark:bg-[#1E293B] rounded-[32px] p-6 border border-[#E0E0E0] dark:border-[#334155] shadow-sm">
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center">
                                <View className="bg-[#F4433622] p-2 rounded-lg mr-3">
                                    <Bell size={18} color="#F44336" strokeWidth={3} />
                                </View>
                                <Text className="text-[#212121] dark:text-white font-black text-lg tracking-tight">{t("next_reminder")}</Text>
                            </View>
                            <TouchableOpacity className="bg-[#F5F5F5] dark:bg-[#0F172A] p-2 rounded-full">
                                <Plus size={16} color="#757575" strokeWidth={3} style={{ transform: [{ rotate: '45deg' }] }} />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <Clock size={32} color="#00BCD4" strokeWidth={2.5} />
                                <View className="ml-4">
                                    <Text className="text-[#212121] dark:text-white font-black text-4xl tracking-tighter">
                                        {nextReminder ? formatAmPm(nextReminder.time) : "--:--"}
                                    </Text>
                                    {nextReminder && (
                                        <Text className="text-[#0288D1] font-bold text-xs mt-1">
                                            {t("drink")} {nextReminder.amount} ml
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-[#757575] dark:text-[#94A3B8] text-[10px] font-black uppercase tracking-widest mb-1">{t("remaining")}</Text>
                                <View className="bg-[#0288D115] px-3 py-1 rounded-full border border-[#0288D133]">
                                    <Text className="text-[#0288D1] font-black text-sm">{remainingAmount} ml</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Primary Action Button */}
                    <View className="mt-10 px-6">
                        <TouchableOpacity
                            onPress={() => handleQuickAdd(nextReminder?.amount || 250)}
                            activeOpacity={0.8}
                            className="bg-[#0288D1] w-full py-5 rounded-[32px] items-center justify-center shadow-xl shadow-[#0288D1]/30 flex-row"
                        >
                            <Droplet size={24} color="white" strokeWidth={2.5} style={{ marginRight: 12 }} />
                            <Text className="text-white font-black text-2xl tracking-tight">
                                + {nextReminder?.amount ? `${nextReminder.amount} ml` : '250 ml'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/add')}
                            className="mt-6 flex-row items-center justify-center"
                        >
                            <PlusCircle size={18} color="#00BCD4" strokeWidth={2.5} style={{ marginRight: 8 }} />
                            <Text className="text-[#00BCD4] font-black text-xs uppercase tracking-widest">{t("add_manually")}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Daily History Section */}
                    <View className="mt-12 px-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-[#212121] dark:text-white font-black text-xl tracking-tight">{t("history")}</Text>
                            <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
                                <Text className="text-[#0288D1] font-black text-xs uppercase tracking-widest">{t("view_all")}</Text>
                            </TouchableOpacity>
                        </View>

                        {logs.length === 0 ? (
                            <View className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 items-center border border-[#E0E0E0] dark:border-[#334155] border-dashed">
                                <Droplet size={32} color="#CBD5E1" strokeWidth={2} />
                                <Text className="text-[#757575] dark:text-[#64748B] text-sm font-medium mt-3">{t("no_logs_today")}</Text>
                            </View>
                        ) : (
                            <View className="space-y-3">
                                {logs.slice(-3).reverse().map((log: any, index: number) => (
                                    <View
                                        key={log.id}
                                        className="bg-white dark:bg-[#1E293B] p-5 rounded-3xl flex-row items-center justify-between border border-[#E0E0E0] dark:border-[#334155] shadow-sm"
                                    >
                                        <View className="flex-row items-center">
                                            <View className="bg-[#0288D115] p-3 rounded-2xl mr-4">
                                                <Droplet size={20} color="#0288D1" strokeWidth={2.5} />
                                            </View>
                                            <View>
                                                <Text className="text-[#212121] dark:text-white font-black text-lg">+{log.amount} ml</Text>
                                                <Text className="text-[#757575] dark:text-[#94A3B8] text-xs font-bold">{log.time}</Text>
                                            </View>
                                        </View>
                                        <View className="bg-[#66BB6A15] p-2 rounded-full">
                                            <CheckCircle2 size={16} color="#66BB6A" strokeWidth={3} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {isGoalReached && (
                        <View className="mt-10 mx-auto bg-[#66BB6A22] px-8 py-3 rounded-full border border-[#66BB6A]">
                            <Text className="text-[#66BB6A] font-black uppercase tracking-[2px] text-[10px]">
                                {t("daily_goal_reached")} 🎊
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
