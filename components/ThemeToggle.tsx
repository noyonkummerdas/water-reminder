import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { saveTheme } from '../utils/theme-storage';

const ThemeToggle = () => {
    const { colorScheme, setColorScheme } = useColorScheme();

    const toggleTheme = async () => {
        const nextTheme = colorScheme === 'light' ? 'dark' : 'light';
        setColorScheme(nextTheme);
        await saveTheme(nextTheme);
    };

    const isDark = colorScheme === 'dark';

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.8}
            className="w-11 h-11 items-center justify-center rounded-2xl bg-white dark:bg-dark-surface shadow-sm border border-slate-50 dark:border-slate-800"
        >
            <View className="items-center justify-center">
                {isDark ? (
                    <Sun size={22} color="#FBBF24" strokeWidth={2.5} />
                ) : (
                    <Moon size={22} color="#6366F1" strokeWidth={2.5} />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default ThemeToggle;
