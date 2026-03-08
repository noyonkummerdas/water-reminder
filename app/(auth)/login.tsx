import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Animated as RNAnimated, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!email.trim()) {
            Alert.alert("Input Error", "Please enter your email address.");
            return;
        }
        if (!email.includes('@')) {
            Alert.alert("Input Error", "Please enter a valid email address.");
            return;
        }
        if (!password.trim()) {
            Alert.alert("Input Error", "Please enter your password.");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Input Error", "Password must be at least 6 characters long.");
            return;
        }

        // Proceed to home if everything is fine
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFB]" edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                    {/* Logo / Header Area */}
                    <View className="items-center py-16">
                        <View className="bg-white p-6 rounded-[36px] shadow-sm border border-slate-50 mb-8">
                            <View className="w-16 h-16 bg-[#00BDD6] rounded-2xl items-center justify-center">
                                <View className="w-8 h-8 rounded-full border-4 border-white opacity-90" />
                            </View>
                        </View>
                        <Text className="text-[#1E293B] font-black text-4xl mb-3">AquaFlow</Text>
                        <Text className="text-[#94A3B8] text-lg font-medium">Drink water, stay healthy</Text>
                    </View>

                    {/* Login Form */}
                    <View className="mb-8">
                        <View className="mb-6">
                            <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">Email Address</Text>
                            <View className="relative justify-center">
                                <TextInput
                                    className="bg-white p-5 pl-16 rounded-[28px] shadow-sm border border-slate-50 text-lg"
                                    placeholder="name@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <View className="absolute left-6 top-6">
                                    <Mail size={22} color="#84dce6ff" strokeWidth={2.5} />
                                </View>
                            </View>
                        </View>

                        <View className="mb-8">
                            <View className="flex-row justify-between items-center mb-4 ml-4">
                                <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px]">Password</Text>
                                <TouchableOpacity>
                                    <Text className="text-[#00BDD6] text-[10px] font-black uppercase tracking-[1px]">Forgot</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="relative">
                                <TextInput
                                    className="bg-white p-5 pl-16 rounded-[28px] shadow-sm border border-slate-50 text-lg"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <View className="absolute left-6 top-6">
                                    <Lock size={20} color="#7FD7E0" strokeWidth={2.5} />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="bg-[#00BDD6] py-4 rounded-[28px] shadow-xl flex-row items-center justify-center mb-10"
                            onPress={handleLogin}
                        >
                            <Text className="text-white font-black text-xl mr-3">Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View className="flex-row justify-center items-center">
                        <Text className="text-[#94A3B8] font-medium mr-2">New user?</Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text className="text-[#00BDD6] font-black">Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
