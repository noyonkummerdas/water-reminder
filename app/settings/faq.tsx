import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
    {
        question: "How much water should I drink daily?",
        answer: "The ideal amount depends on your weight and activity level. AquaFlow uses a standard formula (Weight in kg * 35ml) to calculate your personalized daily goal."
    },
    {
        question: "Why should I log my water intake?",
        answer: "Logging helps you build a consistent habit. Staying hydrated improves energy levels, skin health, and overall physical performance."
    },
    {
        question: "Can I change my daily goal manually?",
        answer: "Yes! Go to Settings > Profile Setup to update your weight, and the app will automatically recalculate your goal for you."
    },
    {
        question: "Will my data reset every day?",
        answer: "Yes, the daily tracker resets at midnight so you can start fresh every morning. You can view your historical progress in the Statistics tab."
    },
];

const FAQItem = ({ item }: any) => {
    const [expanded, setExpanded] = useState(false);

    const toggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <TouchableOpacity
            onPress={toggle}
            className="bg-white mb-4 p-6 rounded-[32px] shadow-sm border border-slate-50"
        >
            <View className="flex-row items-center justify-between">
                <Text className="flex-1 text-[#1E293B] font-black text-base pr-4">
                    {item.question}
                </Text>
                {expanded ? <ChevronUp size={20} color="#00BDD6" /> : <ChevronDown size={20} color="#94A3B8" />}
            </View>
            {expanded && (
                <View className="mt-4 pt-4 border-t border-slate-50">
                    <Text className="text-[#64748B] font-medium leading-6">
                        {item.answer}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default function FAQScreen() {
    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFB]" edges={['top']}>
            <View className="px-6 py-4 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-11 h-11 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-50"
                >
                    <ChevronLeft size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text className="text-[#1E293B] font-black text-xl">FAQs & Support</Text>
                <View className="w-11" />
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                <View className="flex-row items-center mb-8 px-2">
                    <View className="w-13 h-13 bg-[#F59E0B] rounded-2xl items-center justify-center mr-4 shadow-sm">
                        <HelpCircle size={24} color="white" />
                    </View>
                    <View>
                        <Text className="text-[#1E293B] font-black text-lg">Common Questions</Text>
                        <Text className="text-[#94A3B8] font-bold text-xs uppercase tracking-wider">Help Center</Text>
                    </View>
                </View>

                {FAQS.map((item, index) => (
                    <FAQItem key={index} item={item} />
                ))}

                <TouchableOpacity className="mt-8 bg-white border border-slate-100 p-8 rounded-[44px] items-center mb-12">
                    <Text className="text-[#94A3B8] font-bold text-xs uppercase tracking-[2px] mb-4">Need more help?</Text>
                    <Text className="text-[#00BDD6] font-black text-lg underline">techsoul.inc.bd@gmail.com</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
