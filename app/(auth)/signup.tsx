import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, User, ArrowRight, ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';


import { clearAllData } from '../../utils/storage';

export default function SignupScreen() {
    const { t } = useTranslation();

    const [name, setName] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        if (!name.trim()) {
            Alert.alert(t("error"), t("enter_full_name"));
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            Alert.alert(t("error"), t("valid_email"));
            return;
        }
        if (password.length < 6) {
            Alert.alert(t("error"), t("password_length"));
            return;
        }

        // Clear all previous user data for a clean start
        await clearAllData();

        // Proceed to profile setup
        router.replace('/profile-setup');
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="px-6 py-4">
                <TouchableOpacity
                    onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/login')}
                    className="w-11 h-11 items-center justify-center rounded-2xl bg-[#F5F5F5] border border-[#E0E0E0]"
                >
                    <ChevronLeft size={22} color="#212121" strokeWidth={2.5} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                    <View className="py-10">
                        <Text className="text-[#212121] font-black text-4xl mb-3 leading-[50px] tracking-tight">{t("signup_title")}</Text>
                        <Text className="text-[#757575] text-lg font-medium">{t("signup_sub")}</Text>
                    </View>

                    {/* Signup Form */}
                    <View className="mb-8">
                        <View className="mb-6">
                            <View className="flex-row items-center mb-4 ml-4">
                                <View className="w-1.5 h-1.5 rounded-full bg-[#00BCD4] mr-2" />
                                <Text className="text-[#757575] text-[10px] font-black uppercase tracking-[2px]">{t("full_name")}</Text>
                            </View>
                            <View className="relative justify-center">
                                <TextInput
                                    className="bg-[#F5F5F5] h-16 px-6 pl-16 rounded-[28px] border border-[#E0E0E0] text-[#212121] text-base"
                                    placeholder="Cody Fisher"
                                    placeholderTextColor="#757575"
                                    value={name}
                                    onChangeText={setName}
                                />
                                <View className="absolute left-6 h-full justify-center">
                                    <User size={22} color="#00BCD4" strokeWidth={2.5} />
                                </View>
                            </View>
                        </View>

                        <View className="mb-6">
                            <View className="flex-row items-center mb-4 ml-4">
                                <View className="w-1.5 h-1.5 rounded-full bg-[#00BCD4] mr-2" />
                                <Text className="text-[#757575] text-[10px] font-black uppercase tracking-[2px]">{t("email")}</Text>
                            </View>
                            <View className="relative justify-center">
                                <TextInput
                                    className="bg-[#F5F5F5] h-16 px-6 pl-16 rounded-[28px] border border-[#E0E0E0] text-[#212121] text-base"
                                    placeholder="name@example.com"
                                    placeholderTextColor="#757575"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <View className="absolute left-6 h-full justify-center">
                                    <Mail size={22} color="#00BCD4" strokeWidth={2.5} />
                                </View>
                            </View>
                        </View>

                        <View className="mb-10">
                            <View className="flex-row items-center mb-4 ml-4">
                                <View className="w-1.5 h-1.5 rounded-full bg-[#00BCD4] mr-2" />
                                <Text className="text-[#757575] text-[10px] font-black uppercase tracking-[2px]">{t("password")}</Text>
                            </View>
                            <View className="relative justify-center">
                                <TextInput
                                    className="bg-[#F5F5F5] h-16 px-6 pl-16 rounded-[28px] border border-[#E0E0E0] text-[#212121] text-base"
                                    placeholder="••••••••"
                                    placeholderTextColor="#E0E0E0"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <View className="absolute left-6 h-full justify-center">
                                    <Lock size={22} color="#00BCD4" strokeWidth={2.5} />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="bg-[#0288D1] py-5 rounded-[32px] shadow-xl shadow-[#0288D1]/30 flex-row items-center justify-center mb-10"
                            onPress={handleSignUp}
                        >
                            <Text className="text-white font-black text-xl mr-3 tracking-tight">{t("sign_up")}</Text>
                            <ArrowRight size={20} color="white" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View className="flex-row justify-center items-center">
                        <Text className="text-[#757575] font-bold mr-2 tracking-tight">{t("already_account")}</Text>
                        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                            <Text className="text-[#0288D1] font-black tracking-tighter">{t("login")}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
