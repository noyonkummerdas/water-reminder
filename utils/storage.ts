import AsyncStorage from '@react-native-async-storage/async-storage';

export const USER_PROFILE_KEY = 'user_profile';
export const INTAKE_HISTORY_KEY = 'intake_history';

export interface UserProfile {
    name: string;
    gender: 'male' | 'female';
    weight: string;
    height: string;
    dailyGoal: number;
}

export interface IntakeRecord {
    date: string; // ISO Date YYYY-MM-DD
    amount: number;
    timestamp: string;
}

export const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export interface DayData {
    intake: number;
    goal: number;
}

export const saveIntake = async (amount: number, currentGoal: number) => {
    try {
        const today = getTodayStr();
        const historyData = await AsyncStorage.getItem(INTAKE_HISTORY_KEY);
        let history: Record<string, any> = historyData ? JSON.parse(historyData) : {};

        let rawData = history[today];
        let dayData: DayData;

        // Migration logic: if old data was just a number, convert to object
        if (typeof rawData === 'number') {
            dayData = { intake: rawData, goal: currentGoal };
        } else if (rawData && typeof rawData === 'object') {
            dayData = rawData;
        } else {
            dayData = { intake: 0, goal: currentGoal };
        }

        const safeAmount = isNaN(amount) ? 0 : amount;
        const safeGoal = isNaN(currentGoal) ? 2500 : currentGoal;

        dayData.intake += safeAmount;
        dayData.goal = safeGoal;

        history[today] = dayData;
        await AsyncStorage.setItem(INTAKE_HISTORY_KEY, JSON.stringify(history));
        return dayData.intake;
    } catch (e) {
        console.error("Error saving intake", e);
        return 0;
    }
};

export const getIntakeForDate = async (date: string, defaultGoal: number): Promise<DayData> => {
    try {
        const historyData = await AsyncStorage.getItem(INTAKE_HISTORY_KEY);
        const history: Record<string, any> = historyData ? JSON.parse(historyData) : {};
        const rawData = history[date];

        if (typeof rawData === 'number') {
            return { intake: rawData, goal: defaultGoal };
        } else if (rawData && typeof rawData === 'object') {
            return rawData;
        }

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
