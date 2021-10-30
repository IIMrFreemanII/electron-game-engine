import cn from "classnames";

import { capitalize } from "frontent/utils";

import globalStyles from "frontent/assets/styles/global.module.scss";

export const statusColorTypes = {
  white: "",
  primary: "",
  error: "",
  textPrimary: "",
  textSecondary: "",
  textTertiary: "",
  textQuaternary: "",
};

export type StatusColorKeys = keyof typeof statusColorTypes;

export type SVGStatusType = "fill" | "stroke" | "both";

export const getSVGStatus = (status?: StatusColorKeys, type: SVGStatusType = "stroke") =>
  cn(globalStyles[status + capitalize(type + "SVG")]);

export const getBackgroundStatus = (status?: StatusColorKeys) =>
  cn(globalStyles[status + "Background"]);

export const getBorderStatus = (status?: StatusColorKeys) => cn(globalStyles[status + "Border"]);

export const getTextStatus = (status?: StatusColorKeys) => cn(globalStyles[status + "Text"]);
