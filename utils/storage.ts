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

export interface DrinkLog {
    id: string;
    amount: number;
    time: string;
}

export interface DayData {
    intake: number;
    goal: number;
    logs: DrinkLog[];
}

export const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getHistoryKey = (userId: string, date: string) => `${INTAKE_HISTORY_PREFIX}${userId}_${date}`;

export const saveIntake = async (amount: number, goal: number, userId: string = 'default'): Promise<number> => {
    try {
        const today = getTodayStr();
        const key = getHistoryKey(userId, today);
        const existingData = await AsyncStorage.getItem(key);

        let currentData: DayData = existingData ? JSON.parse(existingData) : { intake: 0, goal: goal, logs: [] };

        // Update intake and goal
        const safeAmount = isNaN(amount) ? 0 : amount;
        currentData.intake += safeAmount;
        currentData.goal = goal;

        // Add to logs
        if (!currentData.logs) currentData.logs = [];
        currentData.logs.push({
            id: Math.random().toString(36).substring(2, 11),
            amount: safeAmount,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        await AsyncStorage.setItem(key, JSON.stringify(currentData));

        return currentData.intake;
    } catch (e) {
        console.error("Failed to save intake", e);
        return 0;
    }
};

export const getIntakeForDate = async (date: string, goal: number, userId: string = 'default'): Promise<DayData> => {
    try {
        const key = getHistoryKey(userId, date);
        const data = await AsyncStorage.getItem(key);
        if (data) return JSON.parse(data);
        return { intake: 0, goal: goal, logs: [] };
    } catch (e) {
        console.error("Error getting intake", e);
        return { intake: 0, goal: goal, logs: [] };
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
