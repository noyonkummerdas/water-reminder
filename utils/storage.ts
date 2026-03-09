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
    wakeUpTime: string; // "HH:mm"
    bedTime: string;    // "HH:mm"
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
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        currentData.logs.push({
            id: Math.random().toString(36).substring(2, 11),
            amount: safeAmount,
            time: `${h}:${min}`
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

export const calculateSchedule = (profile: UserProfile, currentIntake?: number): DrinkLog[] => {
    const { wakeUpTime, bedTime, dailyGoal } = profile;
    if (!wakeUpTime || !bedTime || !dailyGoal) return [];

    const parseTime = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    };

    const wakeMinutes = parseTime(wakeUpTime);
    let bedMinutes = parseTime(bedTime);

    if (bedMinutes <= wakeMinutes) {
        bedMinutes += 24 * 60;
    }

    const totalActiveMinutes = bedMinutes - wakeMinutes;
    const intervalMinutes = 120; // Drink every 2 hours
    const numberOfReminders = Math.floor(totalActiveMinutes / intervalMinutes);

    if (numberOfReminders <= 0) return [];

    const amountPerReminder = Math.round(dailyGoal / numberOfReminders);
    const schedule: DrinkLog[] = [];

    const now = new Date();
    const currentMinutesSystem = now.getHours() * 60 + now.getMinutes();

    let expectedIntake = 0;
    let upcomingCount = 0;

    for (let i = 0; i < numberOfReminders; i++) {
        const timeMinutes = wakeMinutes + (i * intervalMinutes);
        const h = Math.floor((timeMinutes % (24 * 60)) / 60);
        const m = timeMinutes % 60;
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

        schedule.push({
            id: `sched_${i}`,
            amount: amountPerReminder,
            time: timeStr
        });

        // Determine if this reminder has passed
        const itemMinutes = h * 60 + m;
        if (itemMinutes <= currentMinutesSystem) {
            expectedIntake += amountPerReminder;
        } else {
            upcomingCount++;
        }
    }

    // Redistribute missed intake across upcoming reminders
    if (currentIntake !== undefined && upcomingCount > 0) {
        const missedAmount = Math.max(0, expectedIntake - currentIntake);
        if (missedAmount > 0) {
            const extraPerReminder = Math.round(missedAmount / upcomingCount);

            for (const item of schedule) {
                const [h, m] = item.time.split(':').map(Number);
                const itemMinutes = h * 60 + m;
                if (itemMinutes > currentMinutesSystem) {
                    item.amount += extraPerReminder;
                }
            }
        }
    }

    return schedule;
};

export const getExpectedIntake = (profile: UserProfile): number => {
    const schedule = calculateSchedule(profile); // Base schedule to see past requirements
    const now = new Date();
    const currentMinutesSystem = now.getHours() * 60 + now.getMinutes();

    let expectedIntake = 0;
    for (const item of schedule) {
        const [h, m] = item.time.split(':').map(Number);
        if (h * 60 + m <= currentMinutesSystem) {
            expectedIntake += item.amount;
        }
    }

    return expectedIntake;
};
