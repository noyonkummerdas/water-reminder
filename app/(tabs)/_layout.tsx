import React from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, BarChart3, GlassWater, User, Plus } from 'lucide-react-native';
import { View, Dimensions, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 85;

const TabBarBackground = () => (
    <View style={StyleSheet.absoluteFill}>
        <View style={{
            backgroundColor: 'white',
            height: TAB_BAR_HEIGHT,
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -12 },
            shadowOpacity: 0.06,
            shadowRadius: 20,
            elevation: 15
        }}>
            <Svg width={width} height={TAB_BAR_HEIGHT} viewBox={`0 0 ${width} ${TAB_BAR_HEIGHT}`}>
                <Path
                    d={`M 0 35 C 0 15.664 15.664 0 35 0 L ${width / 2 - 45} 0 C ${width / 2 - 25} 0 ${width / 2 - 22} 38 ${width / 2} 38 C ${width / 2 + 22} 38 ${width / 2 + 25} 0 ${width / 2 + 45} 0 L ${width - 35} 0 C ${width - 15.664} 0 ${width} 15.664 ${width} 35 L ${width} ${TAB_BAR_HEIGHT} L 0 ${TAB_BAR_HEIGHT} Z`}
                    fill="white"
                />
            </Svg>
        </View>
    </View>
);

export default function TabLayout() {
    const { t } = useTranslation();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#0288D1',
                tabBarInactiveTintColor: '#757575',
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    height: TAB_BAR_HEIGHT,
                    elevation: 0,
                    paddingBottom: 20,
                },
                tabBarBackground: () => <TabBarBackground />,
                tabBarLabelStyle: {
                    display: 'none',
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('home'),
                    tabBarIcon: ({ color, focused }) => (
                        <View className="items-center">
                            {focused && <View className="w-1.5 h-1.5 rounded-full bg-[#0288D1] mb-1" />}
                            <LayoutGrid size={24} color={color} strokeWidth={2.5} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: t('statistics'),
                    tabBarIcon: ({ color, focused }) => (
                        <View className="items-center">
                            {focused && <View className="w-1.5 h-1.5 rounded-full bg-[#0288D1] mb-1" />}
                            <BarChart3 size={24} color={color} strokeWidth={2.5} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: '',
                    tabBarIcon: () => (
                        <View style={{
                            backgroundColor: '#0288D1',
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 50,
                            shadowColor: '#0288D1',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.45,
                            shadowRadius: 15,
                            elevation: 10,
                            borderWidth: 5,
                            borderColor: 'white'
                        }}>
                            <Plus size={34} color="white" strokeWidth={3.5} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: t('history'),
                    tabBarIcon: ({ color, focused }) => (
                        <View className="items-center">
                            {focused && <View className="w-1.5 h-1.5 rounded-full bg-[#0288D1] mb-1" />}
                            <GlassWater size={24} color={color} strokeWidth={2.5} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t('my_profile'),
                    tabBarIcon: ({ color, focused }) => (
                        <View className="items-center">
                            {focused && <View className="w-1.5 h-1.5 rounded-full bg-[#0288D1] mb-1" />}
                            <User size={24} color={color} strokeWidth={3} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
