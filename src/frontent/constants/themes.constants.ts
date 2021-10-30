import { ThemeType } from "frontent/components";

export const lightTheme: ThemeType<"Light"> = {
  name: "Light",
  importCallback: () => require("frontent/assets/styles/light-theme.scss"),
  className: "lightTheme",
} as const;

export const darkTheme: ThemeType<"Dark"> = {
  name: "Dark",
  importCallback: () => require("frontent/assets/styles/dark-theme.scss"),
  className: "darkTheme",
} as const;

export type SupportedThemes = typeof lightTheme | typeof darkTheme;
