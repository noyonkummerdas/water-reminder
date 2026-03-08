import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_PROFILE_KEY = 'user_profile';
export const INTAKE_HISTORY_PREFIX = 'intake_history_';

export interface UserProfile {
    id: string;
    name: string;
    gender: 'male' | 'female';
    weight: string;
    height: string;
    dailyGoal: number;
    lastActiveDate: string;
}

export interface DayData {
    intake: number;
    goal: number;
}

export const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getHistoryKey = (userId: string) => `${INTAKE_HISTORY_PREFIX}${userId}`;

export const saveIntake = async (amount: number, currentGoal: number, userId: string = 'default') => {
    try {
        const today = getTodayStr();
        const key = getHistoryKey(userId);
        const historyData = await AsyncStorage.getItem(key);
        let history: Record<string, any> = historyData ? JSON.parse(historyData) : {};

        let dayData: DayData = history[today] || { intake: 0, goal: currentGoal };

        const safeAmount = isNaN(amount) ? 0 : amount;
        dayData.intake += safeAmount;
        dayData.goal = currentGoal;

        history[today] = dayData;
        await AsyncStorage.setItem(key, JSON.stringify(history));

        // Update profile's last active date
        const profile = await getProfile();
        if (profile && profile.id === userId) {
            await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify({ ...profile, lastActiveDate: today }));
        }

        return dayData.intake;
    } catch (e) {
        console.error("Error saving intake", e);
        return 0;
    }
};

export const getIntakeForDate = async (date: string, defaultGoal: number, userId: string = 'default'): Promise<DayData> => {
    try {
        const key = getHistoryKey(userId);
        const historyData = await AsyncStorage.getItem(key);
        const history: Record<string, any> = historyData ? JSON.parse(historyData) : {};
        const dayData = history[date];

        if (dayData) return dayData;
        return { intake: 0, goal: defaultGoal };
    } catch (e) {
        console.error("Error getting intake", e);
        return { intake: 0, goal: defaultGoal };
    }
};

export const getProfile = async (): Promise<UserProfile | null> => {
    try {
        const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("Error getting profile", e);
        return null;
    }
};

export const clearAllData = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const appKeys = keys.filter(k => k.startsWith(INTAKE_HISTORY_PREFIX) || k === USER_PROFILE_KEY);
        await AsyncStorage.multiRemove(appKeys);
    } catch (e) {
        console.error("Error clearing data", e);
    }
};
