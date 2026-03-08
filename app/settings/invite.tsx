import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Gift, Share2, Copy, Users, CheckCircle2 } from 'lucide-react-native';
import { router } from 'expo-router';

export default function InviteFriendsScreen() {
    const inviteCode = "AQUA-7892";
    const [friendCode, setFriendCode] = useState('');

    const onShare = async () => {
        try {
            await Share.share({
                title: 'AquaFlow - Stay Hydrated',
                message: `Hey! I'm using AquaFlow to track my daily water intake. 💧\n\nDownload AquaFlow from Play Store: https://play.google.com/store/apps/details?id=com.techsoul.aquaflow\n\nUse my invite code: [ ${inviteCode} ] to join me!`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleApplyCode = () => {
        if (!friendCode || friendCode.length < 4) {
            Alert.alert("Error", "Please enter a valid invite code.");
            return;
        }
        Alert.alert("Success", "Invite code applied! Both you and your friend got a reward. 🎁 ✅");
        setFriendCode('');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFB]" edges={['top']}>
            <View className="px-6 py-4 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/settings')}
                    className="w-11 h-11 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50"
                >
                    <ChevronLeft size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text className="text-[#1E293B] font-black text-xl">Invite Friends</Text>
                <View className="w-11" />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                    <View className="items-center mb-8">
                        <View className="w-28 h-28 bg-[#E6F4FE] rounded-[48px] items-center justify-center mb-6 shadow-sm">
                            <Gift size={50} color="#00BDD6" strokeWidth={1.5} />
                        </View>
                        <Text className="text-[#1E293B] font-black text-2xl text-center">Refer & Earn Rewards</Text>
                        <Text className="text-[#94A3B8] text-sm text-center mt-3 px-6 leading-5 font-medium">
                            Share your hydration journey! When a friend joins, both of you earn exclusive rewards.
                        </Text>
                    </View>

                    {/* Section 1: Your Code */}
                    <View className="bg-white p-8 rounded-[44px] shadow-sm border border-slate-50 items-center">
                        <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-6">Your Invite Code</Text>

                        <View className="w-full bg-[#F8FAFB] py-5 rounded-[32px] border border-dashed border-slate-200 flex-row items-center justify-center mb-8">
                            <Text className="text-[#1E293B] font-black text-2xl tracking-[4px]">{inviteCode}</Text>
                            <TouchableOpacity
                                onPress={() => Alert.alert("Copied", "Invite code copied to clipboard!")}
                                className="ml-4 p-2 bg-white rounded-xl shadow-sm active:scale-90"
                            >
                                <Copy size={18} color="#00BDD6" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={onShare}
                            className="w-full bg-[#00BDD6] py-5 flex-row rounded-[28px] shadow-lg shadow-[#00BDD6]/30 items-center justify-center space-x-3 active:scale-95"
                        >
                            <Share2 size={20} color="white" />
                            <Text className="text-white font-black text-lg">Share Code</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Section 2: Enter Friend's Code */}
                    <View className="mt-6 bg-white p-8 rounded-[44px] shadow-sm border border-slate-50">
                        <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-6">Received a code?</Text>
                        <View className="flex-row items-center space-x-3 gap-2">
                            <View className="flex-1 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                                <TextInput
                                    placeholder="AQUA-XXXX"
                                    placeholderTextColor="#CBD5E1"
                                    className="text-[#1E293B] font-black"
                                    autoCapitalize="characters"
                                    value={friendCode}
                                    onChangeText={setFriendCode}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleApplyCode}
                                className="bg-[#00BDD6] px-6 py-4 rounded-2xl active:scale-95 shadow-sm"
                            >
                                <Text className="text-white font-black text-xs">Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Tracking & Info */}
                    <View className="mt-8 mb-4 bg-white p-5 rounded-[36px] shadow-sm border border-slate-50">
                        <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-2">How it works</Text>
                        <View className="space-y-4 gap-4">
                            <View className="flex-row items-center">
                                <View className="bg-green-50 p-2 rounded-xl mr-3">
                                    <CheckCircle2 size={16} color="#22C55E" />
                                </View>
                                <Text className="text-slate-600 text-xs font-bold">1. Send your code to a friend</Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="bg-green-50 p-2 rounded-xl mr-3">
                                    <CheckCircle2 size={16} color="#22C55E" />
                                </View>
                                <Text className="text-slate-600 text-xs font-bold">2. Friend enters code in their app</Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="bg-green-50 p-2 rounded-xl mr-3">
                                    <CheckCircle2 size={16} color="#22C55E" />
                                </View>
                                <Text className="text-slate-600 text-xs font-bold">3. Both of you win rewards!</Text>
                            </View>
                        </View>
                    </View>

                    <View className="mb-12 bg-white p-6 rounded-[36px] shadow-sm border border-slate-50 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="bg-[#00BDD6]/10 p-3 rounded-2xl mr-4">
                                <Users size={22} color="#00BDD6" />
                            </View>
                            <View>
                                <Text className="text-[#1E293B] font-black text-base">Friends Joined</Text>
                                <Text className="text-[#94A3B8] font-bold text-[10px] uppercase">0 Active Friends</Text>
                            </View>
                        </View>
                        <View className="bg-[#F8FAFB] px-4 py-2 rounded-full border border-slate-100">
                            <Text className="text-[#1E293B] font-black text-lg">0</Text>
                        </View>
                    </View>

                    <View className="py-6" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
