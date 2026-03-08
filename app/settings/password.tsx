import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Lock, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ChangePasswordScreen() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleUpdate = () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }
        Alert.alert("Success", "Password updated successfully! ✅");
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFB]" edges={['top']}>
            <View className="px-6 py-4 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-11 h-11 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50"
                >
                    <ChevronLeft size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text className="text-[#1E293B] font-black text-xl">Change Password</Text>
                <View className="w-11" />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6 pt-8">
                    <View className="bg-white p-8 rounded-[44px] shadow-sm border border-slate-50">
                        <Text className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mb-6">Security</Text>

                        <View className="mb-6">
                            <Text className="text-slate-400 font-bold text-xs mb-3 ml-2">Current Password</Text>
                            <View className="bg-[#F8FAFB] flex-row items-center px-4 py-4 rounded-3xl border border-slate-100">
                                <Lock size={18} color="#94A3B8" />
                                <TextInput
                                    className="flex-1 ml-3 text-[#1E293B] font-bold"
                                    placeholder="••••••••"
                                    secureTextEntry={!showPass}
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                />
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-slate-400 font-bold text-xs mb-3 ml-2">New Password</Text>
                            <View className="bg-[#F8FAFB] flex-row items-center px-4 py-4 rounded-3xl border border-slate-100">
                                <Lock size={18} color="#00BDD6" />
                                <TextInput
                                    className="flex-1 ml-3 text-[#1E293B] font-bold"
                                    placeholder="New Password"
                                    secureTextEntry={!showPass}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                            </View>
                        </View>

                        <View className="mb-8">
                            <Text className="text-slate-400 font-bold text-xs mb-3 ml-2">Confirm New Password</Text>
                            <View className="bg-[#F8FAFB] flex-row items-center px-4 py-4 rounded-3xl border border-slate-100">
                                <Lock size={18} color="#00BDD6" />
                                <TextInput
                                    className="flex-1 ml-3 text-[#1E293B] font-bold"
                                    placeholder="Confirm Password"
                                    secureTextEntry={!showPass}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => setShowPass(!showPass)}
                            className="flex-row items-center self-end mb-4 mr-2"
                        >
                            {showPass ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
                            <Text className="text-[#94A3B8] font-bold text-xs ml-2">{showPass ? "Hide" : "Show"} Passwords</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className="mt-8 bg-[#00BDD6] py-6 rounded-[32px] shadow-lg shadow-[#00BDD6]/40 items-center mb-12"
                        onPress={handleUpdate}
                    >
                        <Text className="text-white font-black text-lg">Update Password</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
