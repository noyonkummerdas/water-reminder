import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_PROFILE_KEY } from '../utils/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function ProfileSetupScreen() {
    const { t } = useTranslation();

    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState({
        name: '',
        age: '',
        gender: 'male' as 'male' | 'female',
        weight: '70',
        height: '',
    });

    useFocusEffect(
        useCallback(() => {
            const loadExistingProfile = async () => {
                try {
                    const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
                    if (data) {
                        const existing = JSON.parse(data);
                        setProfile({
                            name: existing.name || '',
                            age: existing.age || '',
                            gender: existing.gender || 'male',
                            weight: existing.weight || '70',
                            height: existing.height || '',
                        });
                        if (existing.heightUnit === 'ft') {
                            setHeightUnit('ft');
                            setFeet(existing.feet || '');
                            setInches(existing.inches || '');
                        } else {
                            setHeightUnit('cm');
                        }
                    }
                } catch (e) {
                    console.error("Error loading profile for edit:", e);
                }
            };
            loadExistingProfile();
        }, [])
    );

    const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('ft');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');

    const HeightPicker = ({ heightUnit, setHeightUnit, feet, setFeet, inches, setInches, hValue, onHeightChange }: any) => {
        const estimatedHeight = Math.round(heightUnit === 'ft'
            ? ((parseInt(feet) || 0) * 30.48 + (parseInt(inches) || 0) * 2.54)
            : (parseFloat(hValue) || 0));

        const displayEstimated = heightUnit === 'ft'
            ? `${t('estimated')}: ${estimatedHeight} ${t('cm')}`
            : `${t('estimated')}: ${(estimatedHeight / 30.48).toFixed(1)} ${t('feet')}`;

        return (
            <View className="items-center py-4">
                <Text className="text-[#212121] font-black text-2xl mb-3 text-center px-4">{t('height_ques')}</Text>
                <Text className="text-[#757575] text-xs text-center px-10 leading-5 mb-8 italic">{t('height_desc')}</Text>

                <View className="flex-row bg-[#F5F5F5] p-1.5 rounded-[24px] mb-12 w-56 border border-[#E0E0E0]">
                    <TouchableOpacity
                        onPress={() => setHeightUnit('ft')}
                        className={`flex-1 py-3 rounded-[20px] items-center ${heightUnit === 'ft' ? 'bg-white shadow-sm' : ''}`}
                    >
                        <Text className={`font-black text-[10px] uppercase tracking-widest ${heightUnit === 'ft' ? 'text-[#0288D1]' : 'text-[#757575]'}`}>{t('feet')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setHeightUnit('cm')}
                        className={`flex-1 py-3 rounded-[20px] items-center ${heightUnit === 'cm' ? 'bg-white shadow-sm' : ''}`}
                    >
                        <Text className={`font-black text-[10px] uppercase tracking-widest ${heightUnit === 'cm' ? 'text-[#0288D1]' : 'text-[#757575]'}`}>{t('cm')}</Text>
                    </TouchableOpacity>
                </View>


                <View className="items-center mb-10 w-full">
                    {heightUnit === 'ft' ? (
                        <View className="flex-row justify-center space-x-6 items-center">
                            <View className="items-center">
                                <View className="bg-white px-6 py-4 rounded-[36px] shadow-sm border border-[#F5F5F5] items-center justify-center min-w-[100px]">
                                    <TextInput
                                        className="text-[#212121] font-black text-6xl text-center"
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor="#E0E0E0"
                                        value={feet}
                                        onChangeText={setFeet}
                                        maxLength={1}
                                    />
                                </View>
                                <Text className="mt-4 text-[#00BCD4] font-black uppercase text-[10px] tracking-widest">{t('feet')}</Text>
                            </View>
                            <Text className="text-[#E0E0E0] font-black text-4xl mb-8">'</Text>
                            <View className="items-center">
                                <View className="bg-white px-8 py-6 rounded-[36px] shadow-sm border border-[#F5F5F5] items-center justify-center min-w-[100px]">
                                    <TextInput
                                        className="text-[#212121] font-black text-6xl text-center"
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor="#E0E0E0"
                                        value={inches}
                                        onChangeText={setInches}
                                        maxLength={2}
                                    />
                                </View>
                                <Text className="mt-4 text-[#00BCD4] font-black uppercase text-[10px] tracking-widest">{t('inches')}</Text>
                            </View>
                        </View>
                    ) : (
                        <View className="bg-white px-10 py-6 rounded-[36px] shadow-sm border border-[#F5F5F5] flex-row items-baseline justify-center min-w-[180px]">
                            <TextInput
                                className="text-[#212121] font-black text-6xl text-center mr-2"
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor="#E0E0E0"
                                value={hValue}
                                onChangeText={onHeightChange}
                                maxLength={3}
                            />
                            <Text className="text-[#0288D1] font-bold text-2xl">{t('cm')}</Text>
                        </View>
                    )}
                </View>

                <View className="px-10">
                    <Text className="text-[#757575] text-center text-[10px] font-bold uppercase leading-5 italic bg-[#F5F5F5] py-4 rounded-3xl border border-[#E0E0E0] px-6">
                        {estimatedHeight > 0 ? displayEstimated : t('enter_height')}
                    </Text>
                </View>
            </View>
        );
    };

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            const weightNum = parseFloat(profile.weight) || 70;
            const dailyGoal = Math.round(weightNum * 35);

            let finalHeight = profile.height;
            if (heightUnit === 'ft') {
                const f = parseInt(feet) || 0;
                const i = parseInt(inches) || 0;
                finalHeight = String(Math.round((f * 30.48) + (i * 2.54)));
            }

            const existingProfileStr = await AsyncStorage.getItem(USER_PROFILE_KEY);
            let userId = 'user_' + Math.random().toString(36).substr(2, 9);
            if (existingProfileStr) {
                const existingProfile = JSON.parse(existingProfileStr);
                userId = existingProfile.id || userId;
            }

            const today = new Date().toISOString().split('T')[0];

            const userData = {
                ...profile,
                id: userId,
                height: finalHeight,
                heightUnit,
                feet: heightUnit === 'ft' ? feet : '',
                inches: heightUnit === 'ft' ? inches : '',
                dailyGoal,
                setupComplete: true,
                onboardingDate: existingProfileStr ? JSON.parse(existingProfileStr).onboardingDate : new Date().toISOString(),
                lastActiveDate: today
            };

            try {
                await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userData));
                router.replace('/(tabs)');
            } catch (e) {
                console.error("Failed to save profile", e);
                router.replace('/(tabs)');
            }
        }
    };

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-6 py-4 flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={() => {
                            if (step > 1) {
                                setStep(step - 1);
                            } else if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace('/(auth)/login');
                            }
                        }}
                        className="w-11 h-11 items-center justify-center rounded-2xl bg-[#F5F5F5] border border-[#E0E0E0]"
                    >
                        <ChevronLeft size={22} color="#212121" />
                    </TouchableOpacity>
                    <View className="flex-row px-2">
                        {[1, 2, 3].map((s) => (
                            <View
                                key={s}
                                className={`w-2.5 h-1 rounded-full mx-1 ${s === step ? 'bg-[#0288D1] w-6' : 'bg-[#E0E0E0]'}`}
                            />
                        ))}
                    </View>
                    <View className="w-11" />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                        {step === 1 && (
                            <View>
                                <Text className="text-[#212121] font-black text-4xl mb-3 leading-[50px] tracking-tight">{t('welcome')}</Text>
                                <Text className="text-[#757575] text-lg font-medium mb-12">{t('welcome_sub')}</Text>

                                <View className="mb-8">
                                    <View className="flex-row items-center mb-4 ml-4">
                                        <View className="w-1.5 h-1.5 rounded-full bg-[#00BCD4] mr-2" />
                                        <Text className="text-[#757575] text-[10px] font-black uppercase tracking-[2px]">{t('your_name')}</Text>
                                    </View>
                                    <TextInput
                                        className="bg-[#F5F5F5] p-5 rounded-[28px] border border-[#E0E0E0] text-lg font-bold text-[#212121]"
                                        placeholder="Cody Fisher"
                                        placeholderTextColor="#757575"
                                        value={profile.name}
                                        onChangeText={(text) => setProfile({ ...profile, name: text })}
                                    />
                                </View>

                                <View className="mb-8">
                                    <View className="flex-row items-center mb-6 ml-4">
                                        <View className="w-1.5 h-1.5 rounded-full bg-[#00BCD4] mr-2" />
                                        <Text className="text-[#757575] text-[10px] font-black uppercase tracking-[2px]">{t('gender')}</Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <TouchableOpacity
                                            onPress={() => setProfile({ ...profile, gender: 'male' })}
                                            className={`w-[48%] py-5 rounded-[32px] flex-row items-center justify-center border ${profile.gender === 'male' ? 'bg-[#0288D1] border-[#0288D1]' : 'bg-[#F5F5F5] border-[#E0E0E0]'}`}
                                        >
                                            <MaterialCommunityIcons
                                                name="human-male"
                                                size={24}
                                                color={profile.gender === 'male' ? 'white' : '#00BCD4'}
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text className={`font-black text-sm uppercase tracking-wider ${profile.gender === 'male' ? 'text-white' : '#00BCD4'}`}>{t('male')}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setProfile({ ...profile, gender: 'female' })}
                                            className={`w-[48%] py-5 rounded-[32px] flex-row items-center justify-center border ${profile.gender === 'female' ? 'bg-[#0288D1] border-[#0288D1]' : 'bg-[#F5F5F5] border-[#E0E0E0]'}`}
                                        >
                                            <MaterialCommunityIcons
                                                name="human-female"
                                                size={24}
                                                color={profile.gender === 'female' ? 'white' : '#00BCD4'}
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text className={`font-black text-sm uppercase tracking-wider ${profile.gender === 'female' ? 'text-white' : '#00BCD4'}`}>{t('female')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        )}

                        {step === 2 && (
                            <HeightPicker
                                heightUnit={heightUnit}
                                setHeightUnit={setHeightUnit}
                                feet={feet}
                                setFeet={setFeet}
                                inches={inches}
                                setInches={setInches}
                                profile={profile}
                                hValue={profile.height}
                                onHeightChange={(text: string) => setProfile({ ...profile, height: text })}
                            />
                        )}

                        {step === 3 && (
                            <View className="items-center">
                                <Text className="text-[#212121] font-black text-3xl mb-12 text-center px-6 tracking-tight">{t('weight_ques')}</Text>
                                <View className="w-full bg-[#F5F5F5] p-12 rounded-[50px] border border-[#E0E0E0] items-center">
                                    <Text className="text-[#757575] text-[10px] font-black uppercase tracking-[2px] mb-6">{t('weight')}</Text>
                                    <View className="flex-row items-baseline mb-8">
                                        <TextInput
                                            className="text-[#212121] font-black text-8xl text-center min-w-[150px]"
                                            keyboardType="numeric"
                                            value={profile.weight}
                                            onChangeText={(text) => setProfile({ ...profile, weight: text })}
                                        />
                                        <Text className="text-[#0288D1] font-black text-3xl ml-3 tracking-tighter">{t('kg')}</Text>
                                    </View>
                                    <Text className="text-[#757575] text-center text-xs px-10 leading-5 italic font-medium">{t('weight_desc')}</Text>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            className="mt-14 bg-[#0288D1] py-5 rounded-[32px] shadow-xl shadow-[#0288D1]/30 flex-row items-center justify-center mb-20"
                            onPress={handleNext}
                        >
                            <Text className="text-white font-black text-xl mr-3 tracking-tight">{t('next')}</Text>
                            <ArrowRight size={20} color="white" strokeWidth={3} />
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
