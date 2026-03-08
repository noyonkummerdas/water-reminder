import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_PROFILE_KEY } from '../utils/storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function ProfileSetupScreen() {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState({
        name: '',
        age: '',
        gender: 'male' as 'male' | 'female',
        weight: '70',
        height: '',
    });

    const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('ft');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');

    const HeightPicker = ({ heightUnit, setHeightUnit, feet, setFeet, inches, setInches, hValue, onHeightChange }: any) => {
        const estimatedHeight = Math.round(heightUnit === 'ft'
            ? ((parseInt(feet) || 0) * 30.48 + (parseInt(inches) || 0) * 2.54)
            : (parseFloat(hValue) || 0));

        const displayEstimated = heightUnit === 'ft'
            ? `Estimated: ${estimatedHeight} cm`
            : `Estimated: ${(estimatedHeight / 30.48).toFixed(1)} feet`;

        return (
            <View className="items-center py-4">
                <Text className="text-[#1E293B] font-black text-2xl mb-3">What is your <Text className="text-[#00BDD6]">height?</Text></Text>
                <Text className="text-[#94A3B8] text-xs text-center px-12 leading-5 mb-8 italic">We will use this data to calculate your body hydration needs.</Text>

                <View className="flex-row bg-slate-100 p-1.5 rounded-[24px] mb-12 w-48 shadow-sm">
                    <TouchableOpacity
                        onPress={() => setHeightUnit('ft')}
                        className={`flex-1 py-3 rounded-[20px] items-center ${heightUnit === 'ft' ? 'bg-white shadow-sm' : ''}`}
                    >
                        <Text className={`font-black text-xs uppercase tracking-widest ${heightUnit === 'ft' ? 'text-[#00BDD6]' : 'text-[#94A3B8]'}`}>Feet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setHeightUnit('cm')}
                        className={`flex-1 py-3 rounded-[20px] items-center ${heightUnit === 'cm' ? 'bg-white shadow-sm' : ''}`}
                    >
                        <Text className={`font-black text-xs uppercase tracking-widest ${heightUnit === 'cm' ? 'text-[#00BDD6]' : 'text-[#94A3B8]'}`}>CM</Text>
                    </TouchableOpacity>
                </View>

                <View className="items-center mb-10 w-full">
                    {heightUnit === 'ft' ? (
                        <View className="flex-row justify-center space-x-6 items-center">
                            <View className="items-center">
                                <View className="bg-white px-6 py-4 rounded-[36px] shadow-sm border border-slate-50 items-center justify-center min-w-[100px]">
                                    <TextInput
                                        className="text-[#1E293B] font-black text-6xl text-center"
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor="#E2E8F0"
                                        value={feet}
                                        onChangeText={setFeet}
                                        maxLength={1}
                                    />
                                </View>
                                <Text className="mt-4 text-[#00BDD6] font-black uppercase text-[10px] tracking-widest">Feet</Text>
                            </View>
                            <Text className="text-slate-200 font-black text-4xl mb-8">'</Text>
                            <View className="items-center">
                                <View className="bg-white px-8 py-6 rounded-[36px] shadow-sm border border-slate-50 items-center justify-center min-w-[100px]">
                                    <TextInput
                                        className="text-[#1E293B] font-black text-6xl text-center"
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor="#E2E8F0"
                                        value={inches}
                                        onChangeText={setInches}
                                        maxLength={2}
                                    />
                                </View>
                                <Text className="mt-4 text-[#00BDD6] font-black uppercase text-[10px] tracking-widest">Inches</Text>
                            </View>
                        </View>
                    ) : (
                        <View className="bg-white px-10 py-6 rounded-[36px] shadow-sm border border-slate-50 flex-row items-baseline justify-center min-w-[180px]">
                            <TextInput
                                className="text-[#1E293B] font-black text-6xl text-center mr-2"
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor="#E2E8F0"
                                value={hValue}
                                onChangeText={onHeightChange}
                                maxLength={3}
                            />
                            <Text className="text-[#00BDD6] font-bold text-2xl">cm</Text>
                        </View>
                    )}
                </View>

                <View className="px-10">
                    <Text className="text-[#94A3B8] text-center text-[10px] font-bold uppercase leading-5 italic bg-slate-50 py-4 rounded-3xl border border-slate-100">
                        {estimatedHeight > 0 ? displayEstimated : "Enter your height to see estimation"}
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

            const userId = 'user_' + Math.random().toString(36).substr(2, 9);
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
                onboardingDate: new Date().toISOString(),
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
        <View className="flex-1 bg-[#F8FAFB]">
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
                        className="w-11 h-11 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50"
                    >
                        <ChevronLeft size={22} color="#1E293B" />
                    </TouchableOpacity>
                    <View className="flex-row px-2">
                        {[1, 2, 3].map((s) => (
                            <View
                                key={s}
                                className={`w-2 h-2 rounded-full mx-1.5 ${s === step ? 'bg-[#00BDD6]' : 'bg-[#E2E8F0]'}`}
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
                                <Text className="text-[#1E293B] font-black text-4xl mb-3 leading-[50px]">Welcome! 👋</Text>
                                <Text className="text-[#94A3B8] text-lg font-medium mb-12">Let's get to know you better.</Text>

                                <View className="mb-8">
                                    <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">Your Name</Text>
                                    <TextInput
                                        className="bg-white p-4 rounded-[32px] shadow-sm border border-slate-50 text-lg"
                                        placeholder="Cody Fisher"
                                        value={profile.name}
                                        onChangeText={(text) => setProfile({ ...profile, name: text })}
                                    />
                                </View>

                                <View className="mb-8">
                                    <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-6 ml-4">Gender</Text>
                                    <View className="flex-row justify-between">
                                        <TouchableOpacity
                                            onPress={() => setProfile({ ...profile, gender: 'male' })}
                                            className={`w-[48%] py-4 rounded-[36px] flex-row items-center justify-center border ${profile.gender === 'male' ? 'bg-[#00BDD6] border-[#00BDD6]' : 'bg-white border-slate-50'}`}
                                        >
                                            <MaterialCommunityIcons
                                                name="human-male"
                                                size={28}
                                                color={profile.gender === 'male' ? 'white' : '#7FD7E0'}
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text className={`font-black text-lg ${profile.gender === 'male' ? 'text-white' : '#7FD7E0'}`}>Male</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setProfile({ ...profile, gender: 'female' })}
                                            className={`w-[48%] py-4 rounded-[36px] flex-row items-center justify-center border ${profile.gender === 'female' ? 'bg-[#00BDD6] border-[#00BDD6]' : 'bg-white border-slate-50'}`}
                                        >
                                            <MaterialCommunityIcons
                                                name="human-female"
                                                size={28}
                                                color={profile.gender === 'female' ? 'white' : '#7FD7E0'}
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text className={`font-black text-lg ${profile.gender === 'female' ? 'text-white' : '#7FD7E0'}`}>Female</Text>
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
                                <Text className="text-[#1E293B] font-black text-3xl mb-12">What is your weight?</Text>
                                <View className="w-full bg-white p-12 rounded-[50px] shadow-sm border border-slate-50 items-center">
                                    <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-6">Weight</Text>
                                    <View className="flex-row items-baseline mb-8">
                                        <TextInput
                                            className="text-[#1E293B] font-black text-8xl text-center min-w-[150px]"
                                            keyboardType="numeric"
                                            value={profile.weight}
                                            onChangeText={(text) => setProfile({ ...profile, weight: text })}
                                        />
                                        <Text className="text-[#00BDD6] font-bold text-3xl ml-2">kg</Text>
                                    </View>
                                    <Text className="text-[#94A3B8] text-center text-xs px-10 leading-5 italic">This algorithm will calculate your perfect hydration target.</Text>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            className="mt-14 bg-[#00BDD6] py-4 rounded-[32px] shadow-lg shadow-[#00BDD6]/40 flex-row items-center justify-center mb-20"
                            onPress={handleNext}
                        >
                            <Text className="text-white font-black text-xl mr-3">Next</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
