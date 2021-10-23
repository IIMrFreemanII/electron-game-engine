import { AllHTMLAttributes, CSSProperties } from "react";

import { Nullable, RefModel } from "frontent/models";
import { isWithinRange } from "frontent/utils";

export const applyCSSToElement = (el: Nullable<HTMLElement>, stylesToApply: CSSProperties) =>
  el && Object.entries(stylesToApply).forEach(([key, value]) => ((el.style as any)[key] = value));

export const removeCSSFromElement = (
  el: Nullable<HTMLElement>,
  stylesToRemove: Array<keyof CSSProperties>,
) => el && stylesToRemove.forEach((key) => ((el.style as any)[key] = null));

export const addClassesToElement = (el: Nullable<HTMLElement>, ...classNames: string[]) =>
  el && classNames.forEach((name) => el.classList.add(name));

export const removeClassesFromElement = (el: Nullable<HTMLElement>, ...classNames: string[]) =>
  el && classNames.forEach((name) => el.classList.remove(name));

export const addAttributesToElement = (
  el: Nullable<HTMLElement>,
  attributes: AllHTMLAttributes<HTMLElement>,
) => el && Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));

export const removeAttributesFromElement = (
  el: Nullable<HTMLElement>,
  attributes: Array<keyof AllHTMLAttributes<HTMLElement>>,
) => el && attributes.forEach((key) => el.removeAttribute(key));

export const isWithinRect = (
  element: Nullable<HTMLElement>,
  event: MouseEvent,
  mousePosition: "client" | "page" = "page",
): boolean => {
  if (!element) return false;

  const { pageX, pageY, clientY, clientX } = event;

  const { offsetWidth, offsetHeight } = element;
  const { top, left } = element.getBoundingClientRect();
  const topOffset = top + offsetHeight;
  const leftOffset = left + offsetWidth;

  const mouseX = mousePosition === "client" ? clientX : pageX;
  const mouseY = mousePosition === "client" ? clientY : pageY;

  return isWithinRange(mouseX, left, leftOffset) && isWithinRange(mouseY, top, topOffset);
};

export const handleSetRef = <T extends any>(ref: T | null, domRefModel: Nullable<RefModel<T>>) => {
  if (typeof domRefModel === "function") {
    domRefModel(ref);
  } else if (domRefModel) {
    domRefModel.current = ref;
  }
};
