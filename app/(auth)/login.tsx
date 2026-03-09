import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Animated as RNAnimated, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
    const { t, i18n } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (!email.trim()) {
            Alert.alert(t("input_error"), t("enter_email"));
            return;
        }
        if (!email.includes('@')) {
            Alert.alert(t("input_error"), t("valid_email"));
            return;
        }
        if (!password.trim()) {
            Alert.alert(t("input_error"), t("enter_password"));
            return;
        }
        if (password.length < 6) {
            Alert.alert(t("input_error"), t("password_length"));
            return;
        }

        // Proceed to home if everything is fine
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                    {/* Logo / Header Area */}
                    <View className="items-center py-20">
                        <View className="bg-[#F5F5F5] p-6 rounded-[44px] border border-[#E0E0E0] mb-8 shadow-sm">
                            <View className="w-20 h-20 bg-[#0288D1] rounded-[32px] items-center justify-center shadow-lg shadow-[#0288D1]/40">
                                <View className="w-10 h-10 rounded-full border-[6px] border-white opacity-90" />
                            </View>
                        </View>
                        <Text className="text-[#212121] font-black text-5xl mb-3 tracking-tighter">{t("app_name")}</Text>
                        <Text className="text-[#757575] text-lg font-medium text-center px-4 tracking-tight">{t("slogan")}</Text>
                    </View>

                    {/* Login Form */}
                    <View className="mb-8">
                        <View className="mb-6">
                            <View className="flex-row items-center mb-4 ml-4">
                                <View className="w-1.5 h-1.5 rounded-full bg-[#00BCD4] mr-2" />
                                <Text className="text-[#757575] text-[10px] font-black uppercase tracking-[2px]">{t("email")}</Text>
                            </View>
                            <View className="relative justify-center">
                                <TextInput
                                    className="bg-[#F5F5F5] p-5 pl-16 rounded-[28px] border border-[#E0E0E0] text-base text-[#212121]"
                                    placeholder="name@example.com"
                                    placeholderTextColor="#757575"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <View className="absolute left-6 top-6">
                                    <Mail size={22} color="#00BCD4" strokeWidth={2.5} />
                                </View>
                            </View>
                        </View>

                        <View className="mb-10">
                            <View className="flex-row justify-between items-center mb-4 ml-4">
                                <View className="flex-row items-center">
                                    <View className="w-1.5 h-1.5 rounded-full bg-[#00BCD4] mr-2" />
                                    <Text className="text-[#757575] text-[10px] font-black uppercase tracking-[2px]">{t("password")}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Text className="text-[#0288D1] text-[10px] font-black uppercase tracking-[1px]">{t("forgot")}</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="relative">
                                <TextInput
                                    className="bg-[#F5F5F5] p-5 pl-16 pr-14 rounded-[28px] border border-[#E0E0E0] text-base text-[#212121]"
                                    placeholder="••••••••"
                                    placeholderTextColor="#E0E0E0"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <View className="absolute left-6 top-6">
                                    <Lock size={20} color="#00BCD4" strokeWidth={2.5} />
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-5 p-1"
                                >
                                    {showPassword
                                        ? <EyeOff size={20} color="#757575" strokeWidth={2.5} />
                                        : <Eye size={20} color="#757575" strokeWidth={2.5} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="bg-[#0288D1] py-4 rounded-[32px] shadow-xl shadow-[#0288D1]/30 flex-row items-center justify-center mb-10"
                            onPress={handleLogin}
                        >
                            <Text className="text-white font-black text-xl mr-3 tracking-tight">{t("sign_in")}</Text>
                            <ArrowRight size={20} color="white" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View className="flex-row justify-center items-center">
                        <Text className="text-[#757575] font-bold mr-2 tracking-tight">{t("new_user")}</Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text className="text-[#0288D1] font-black tracking-tighter">{t("create_account")}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
