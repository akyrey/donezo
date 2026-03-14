import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    /** The resolved theme after applying system preference */
    resolvedTheme: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextValue>({
    theme: 'system',
    setTheme: () => {},
    resolvedTheme: 'light',
});

export function useTheme(): ThemeContextValue {
    return useContext(ThemeContext);
}
