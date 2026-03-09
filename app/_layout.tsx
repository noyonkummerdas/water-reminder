import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import '../global.css';
import '../i18n';
import { registerForPushNotificationsAsync, scheduleWaterReminder } from '../utils/notifications';

export default function RootLayout() {
    useEffect(() => {
        const setupNotifications = async () => {
            await registerForPushNotificationsAsync();
            await scheduleWaterReminder(); // Default schedule
        };
        setupNotifications();
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile-setup" />
        </Stack>
    );
}
