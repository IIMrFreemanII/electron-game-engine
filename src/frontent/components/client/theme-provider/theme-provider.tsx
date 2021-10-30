import React, { memo, useCallback, useState } from "react";

import { useDidMount, useLocalStorage } from "frontent/hooks";
import { addClassesToElement, removeClassesFromElement } from "frontent/utils";
import { ThemeContext, themeLocalStorageKey } from "./theme-provider.constants";
import { ThemeType } from "./theme-provider.types";

export interface ThemeProviderProps {
  children: React.ReactNode;
  themes: ThemeType[];
  initialTheme: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = memo(
  ({ children, themes, initialTheme }: ThemeProviderProps) => {
    const [theme, setTheme] = useState(initialTheme);
    const { value, setValue } = useLocalStorage(themeLocalStorageKey);

    const setClassName = useCallback(
      (newClassName: string) => {
        removeClassesFromElement(document.body, ...themes.map((theme) => theme.className));
        addClassesToElement(document.body, newClassName);
      },
      [themes],
    );

    const handleThemeChange = useCallback(
      async (themeName: string, defaultTheme?: ThemeType) => {
        const newTheme = themes.find((themeElement) => themeElement.name === themeName);
        const themeToSet = newTheme || defaultTheme;

        if (!themeToSet) return;

        themeToSet.importCallback();
        setClassName(themeToSet.className);
        setTheme(themeToSet);
        setValue(themeToSet.name);
      },
      [themes],
    );

    const handleSetTheme = useCallback(
      (theme: React.SetStateAction<string>) => {
        handleThemeChange(typeof theme === "function" ? theme(value) : theme);
      },
      [handleThemeChange],
    );

    useDidMount(() => handleThemeChange(value, theme));

    return (
      <ThemeContext.Provider value={{ theme, themes, setTheme: handleSetTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  },
);

export default ThemeProvider;
