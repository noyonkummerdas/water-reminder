import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import '../global.css';
import '../i18n';
import { useColorScheme } from 'nativewind';
import { getTheme } from '../utils/theme-storage';
import { registerForPushNotificationsAsync, scheduleWaterReminder } from '../utils/notifications';

export default function RootLayout() {
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        const initTheme = async () => {
            const savedTheme = await getTheme();
            setColorScheme(savedTheme);
        };
        initTheme();

        const setupNotifications = async () => {
            await registerForPushNotificationsAsync();
            await scheduleWaterReminder(); // Default schedule
        };
        setupNotifications();
    }, [setColorScheme]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile-setup" />
        </Stack>
    );
}
