import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Info, Heart, Shield, Globe } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AboutScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFB]" edges={['top']}>
            <View className="px-6 py-4 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')}
                    className="w-11 h-11 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50"
                >
                    <ChevronLeft size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text className="text-[#1E293B] font-black text-xl">About AquaFlow</Text>
                <View className="w-11" />
            </View>

            <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
                <View className="items-center mb-10">
                    <View className="w-24 h-24 bg-[#00BDD6] rounded-[32px] items-center justify-center mb-6 shadow-xl shadow-[#00BDD6]/40">
                        <Text className="text-white text-5xl font-black">A</Text>
                    </View>
                    <Text className="text-[#1E293B] font-black text-3xl">AquaFlow</Text>
                    <Text className="text-[#94A3B8] font-bold text-sm mt-1 uppercase tracking-widest">Version 1.0.0</Text>
                </View>

                <View className="bg-white p-8 rounded-[44px] shadow-sm border border-slate-50 mb-6">
                    <Text className="text-[#64748B] font-medium leading-7 text-center">
                        AquaFlow is your personal hydration partner, dedicated to helping you live a healthier life through better water consumption habits. Our mission is to make hydration simple, fun, and data-driven for everyone.
                    </Text>
                </View>

                <View className="bg-white p-4 rounded-[44px] shadow-sm border border-slate-50 mb-8">
                    <View className="flex-row items-center p-4 border-b border-slate-50">
                        <View className="w-10 h-10 bg-[#E6F4FE] rounded-xl items-center justify-center mr-4">
                            <Heart size={20} color="#EF4444" />
                        </View>
                        <View>
                            <Text className="text-[#1E293B] font-black text-base">Made with Love</Text>
                            <Text className="text-[#94A3B8] font-bold text-xs uppercase">HL Cody Team</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center p-4 border-b border-slate-50">
                        <View className="w-10 h-10 bg-[#E6F4FE] rounded-xl items-center justify-center mr-4">
                            <Shield size={20} color="#22C55E" />
                        </View>
                        <View>
                            <Text className="text-[#1E293B] font-black text-base">Privacy Policy</Text>
                            <Text className="text-[#94A3B8] font-bold text-xs uppercase">Data Protected</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center p-4">
                        <View className="w-10 h-10 bg-[#E6F4FE] rounded-xl items-center justify-center mr-4">
                            <Globe size={20} color="#00BDD6" />
                        </View>
                        <View>
                            <Text className="text-[#1E293B] font-black text-base">Official Website</Text>
                            <Text className="text-[#94A3B8] font-bold text-xs uppercase">www.aquaflow.com</Text>
                        </View>
                    </View>
                </View>

                <Text className="text-center text-[#CBD5E1] text-[10px] font-bold uppercase tracking-widest mb-12">
                    Copyright © 2026 AquaFlow. All rights reserved.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
