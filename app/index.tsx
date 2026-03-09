import { View } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
    const rootNavigationState = useRootNavigationState();
    const router = useRouter();
    const isLoggedIn = false;

    useEffect(() => {
        if (!rootNavigationState?.key) return;

        const timer = setTimeout(() => {
            if (isLoggedIn) {
                router.replace('/(tabs)');
            } else {
                router.replace('/(auth)/login');
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [rootNavigationState?.key, isLoggedIn]);

    return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
}
