import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Lock, User, ArrowRight, ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        if (!name.trim()) {
            Alert.alert("Error", "Please enter your full name.");
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long.");
            return;
        }

        // Proceed to profile setup
        router.replace('/profile-setup');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFB]" edges={['top']}>
            <View className="px-6 py-4">
                <TouchableOpacity
                    onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/login')}
                    className="w-11 h-11 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50"
                >
                    <ChevronLeft size={22} color="#1E293B" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                    <View className="py-10">
                        <Text className="text-[#1E293B] font-black text-4xl mb-3 leading-[50px]">Create Account</Text>
                        <Text className="text-[#94A3B8] text-lg font-medium">Join us to start your hydration journey</Text>
                    </View>

                    {/* Signup Form */}
                    <View className="mb-8">
                        <View className="mb-6">
                            <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">Full Name</Text>
                            <View className="relative justify-center">
                                <TextInput
                                    className="bg-white h-16 px-6 pl-16 rounded-[28px] shadow-sm border border-slate-50 text-[#1E293B] text-lg"
                                    placeholder="Cody Fisher"
                                    value={name}
                                    onChangeText={setName}
                                />
                                <View className="absolute left-6 h-full justify-center">
                                    <User size={22} color="#7FD7E0" strokeWidth={2} />
                                </View>
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">Email Address</Text>
                            <View className="relative justify-center">
                                <TextInput
                                    className="bg-white h-16 px-6 pl-16 rounded-[28px] shadow-sm border border-slate-50 text-[#1E293B] text-lg"
                                    placeholder="name@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <View className="absolute left-6 h-full justify-center">
                                    <Mail size={22} color="#7FD7E0" strokeWidth={2} />
                                </View>
                            </View>
                        </View>

                        <View className="mb-10">
                            <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-4">Password</Text>
                            <View className="relative justify-center">
                                <TextInput
                                    className="bg-white h-16 px-6 pl-16 rounded-[28px] shadow-sm border border-slate-50 text-[#1E293B] text-lg"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <View className="absolute left-6 h-full justify-center">
                                    <Lock size={22} color="#7FD7E0" strokeWidth={2} />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            className="bg-[#00BDD6] py-4 rounded-[32px] shadow-lg shadow-[#00BDD6]/40 flex-row items-center justify-center mb-10"
                            onPress={handleSignUp}
                        >
                            <Text className="text-white font-black text-xl mr-3">Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View className="flex-row justify-center items-center">
                        <Text className="text-[#94A3B8] font-medium mr-2">Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                            <Text className="text-[#00BDD6] font-black">Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
