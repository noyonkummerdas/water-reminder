import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Set this to false to completely disable all notification logic
const ENABLE_NOTIFICATIONS = false;

// We'll require expo-notifications only when needed or in a safe way
let Notifications: any;
try {
    if (ENABLE_NOTIFICATIONS) {
        Notifications = require('expo-notifications');

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
    }
} catch (e) {
    console.error('Failed to load expo-notifications:', e);
}

export async function registerForPushNotificationsAsync() {
    if (!ENABLE_NOTIFICATIONS || !Notifications) return;
    let token;

    if (Platform.OS === 'android') {
        try {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#00BDD6',
            });
        } catch (e) {
            console.log('Error setting notification channel:', e);
        }
    }

    if (Device.isDevice) {
        try {
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

            // CHECK FOR EXPO GO - SDK 53+ doesn't support push in Expo Go
            const isExpoGo = Constants.executionEnvironment === 'storeClient';
            if (isExpoGo) {
                console.log('Push notifications are not supported in Expo Go on SDK 53+. Skipping token registration.');
                return;
            }

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
            console.log('Error in push notification setup:', e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

export async function scheduleWaterReminder() {
    if (!ENABLE_NOTIFICATIONS || !Notifications) return;

    // Check permissions before scheduling
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        console.log('Cannot schedule notifications: Permission not granted');
        return;
    }

    // Clear any existing reminders first to avoid double-ups
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule reminders every 2 hours from 8 AM to 8 PM
    const hours = [8, 10, 12, 14, 16, 18, 20];

    for (const hour of hours) {
        try {
            const trigger: any = Platform.OS === 'ios'
                ? {
                    type: 'calendar',
                    hour: hour,
                    minute: 0,
                    repeats: true,
                }
                : {
                    // For Android, 'daily' type is supported for recurring time notifications
                    type: 'daily',
                    hour: hour,
                    minute: 0,
                    // channelId inside trigger can also satisfy the validator
                    channelId: 'default',
                };

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Time to hydrate! 💧",
                    body: "Drinking water regularly keeps you energized and focused. Take a sip now!",
                    data: { screen: 'index' },
                    // @ts-ignore
                    channelId: 'default',
                    // @ts-ignore
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                } as any,
                trigger,
            });
        } catch (innerError) {
            console.error(`Failed to schedule notification for hour ${hour}:`, innerError);
        }
    }

    console.log('Water reminders scheduled successfully!');
}

export async function cancelAllNotifications() {
    if (ENABLE_NOTIFICATIONS && Notifications) {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
}
