import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'user-theme';

export type themeType = 'light' | 'dark';

export const saveTheme = async (theme: themeType) => {
    try {
        await AsyncStorage.setItem(THEME_KEY, theme);
    } catch (error) {
        console.error('Error saving theme', error);
    }
};

export const getTheme = async (): Promise<themeType> => {
    try {
        const theme = await AsyncStorage.getItem(THEME_KEY);
        return (theme as themeType) || 'light';
    } catch (error) {
        console.error('Error fetching theme', error);
        return 'light';
    }
};
