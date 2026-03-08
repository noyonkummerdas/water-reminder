import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, ChevronRight, LogOut, Shield, CircleHelp as HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="items-center py-10">
                    <View className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-sm overflow-hidden mb-4">
                        <View className="w-full h-full bg-primary opacity-20" />
                    </View>
                    <Text className="text-slate-900 font-black text-2xl">Cody Fisher</Text>
                    <Text className="text-slate-400 font-medium">fisher123@gmail.com</Text>
                </View>

                <View className="bg-white rounded-[40px] shadow-sm border border-slate-50 overflow-hidden mb-6">
                    <TouchableOpacity className="flex-row items-center justify-between p-6 border-b border-slate-50">
                        <View className="flex-row items-center">
                            <User size={20} color="#00BDD6" />
                            <Text className="text-slate-900 font-bold ml-4">Edit Profile</Text>
                        </View>
                        <ChevronRight size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center justify-between p-6 border-b border-slate-50">
                        <View className="flex-row items-center">
                            <Shield size={20} color="#00BDD6" />
                            <Text className="text-slate-900 font-bold ml-4">Privacy & Security</Text>
                        </View>
                        <ChevronRight size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center justify-between p-6">
                        <View className="flex-row items-center">
                            <HelpCircle size={20} color="#00BDD6" />
                            <Text className="text-slate-900 font-bold ml-4">Help Center</Text>
                        </View>
                        <ChevronRight size={20} color="#cbd5e1" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="bg-accent/10 py-6 rounded-3xl items-center flex-row justify-center"
                    onPress={() => router.replace('/(auth)/login')}
                >
                    <LogOut size={20} color="#FF6E71" />
                    <Text className="text-accent font-black text-lg ml-2">Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
