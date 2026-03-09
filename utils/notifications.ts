import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is open
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#00BDD6',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Permission not granted for notifications');
            return;
        }

        try {
            const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
            if (!projectId) {
                console.log('No projectId found. Skipping Expo push token registration.');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync({
                projectId,
            })).data;
            console.log('Push Token:', token);
        } catch (e) {
            console.log('Error fetching push token (this is normal in development if EAS is not configured):', e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

export async function scheduleWaterReminder() {
    // Clear any existing reminders first to avoid double-ups
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule reminders every 2 hours from 8 AM to 8 PM
    const hours = [8, 10, 12, 14, 16, 18, 20];

    for (const hour of hours) {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Time to hydrate! 💧",
                    body: "Drinking water regularly keeps you energized and focused. Take a sip now!",
                    data: { screen: 'index' },
                    // In modern Expo, channelId is at the top level of the content object for Android
                    // @ts-ignore
                    channelId: 'default',
                },
                trigger: Platform.OS === 'ios' ? {
                    type: 'calendar',
                    hour: hour,
                    minute: 0,
                    repeats: true,
                } : {
                    hour: hour,
                    minute: 0,
                    repeats: true,
                } as any,
            });
        } catch (innerError) {
            console.error(`Failed to schedule notification for hour ${hour}:`, innerError);
        }
    }

    console.log('Water reminders scheduled!');
}

export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}
