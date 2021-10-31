import { inputSizeType, inputType } from "./input.constants";
import { StatusColorKeys } from "../../../utils";

export type InputSizeTypeKeys = keyof typeof inputSizeType;

export type InputTypeKeys = keyof typeof inputType;

export type InputDOMElement = HTMLInputElement & HTMLTextAreaElement;

export type InputLineStatuses = Extract<
  StatusColorKeys,
  "error" | "primary" | "success" | "warning"
>;
