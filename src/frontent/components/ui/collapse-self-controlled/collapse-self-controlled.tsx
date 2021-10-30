import React, { memo, Fragment, useRef, useState, useCallback, useMemo } from "react";
import cuid from "cuid";
import cn from "classnames";

import { useDebounce, useDidUpdate } from "frontent/hooks";
import { applyCSSToElement, removeCSSFromElement } from "frontent/utils";

import styles from "./collapse-self-controlled.module.scss";

export interface CollapseSelfControlledProps {
  triggerElement: React.ComponentType<any> | React.ReactNode;
  children: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  openDuration?: number;
  hideDuration?: number;
  transitionDelay?: number;
  triggerOpening?: boolean;
  removeFromDOMOnClosed?: boolean;
  removeCollapseByCondition?: boolean;
  initiallyOpened?: boolean;
  onFinalOpened?: VoidFunction;
  onFinalClosed?: VoidFunction;
}

export const CollapseSelfControlled = memo(
  ({
    triggerElement,
    children,
    triggerClassName = "",
    contentClassName = "",
    openDuration = 0,
    hideDuration = 0,
    transitionDelay = 0,
    triggerOpening = false,
    removeFromDOMOnClosed = false,
    initiallyOpened = false,
    removeCollapseByCondition = false,
    onFinalOpened,
    onFinalClosed,
  }: CollapseSelfControlledProps) => {
    const contentObserverRef = useRef<HTMLDivElement>(null);
    const cuidRef = useRef(cuid());

    const isOpenRef = useRef(initiallyOpened);
    const isFinallyOpenedRef = useRef(initiallyOpened);
    const isFinallyClosedRef = useRef(!initiallyOpened);

    const [, setRerender] = useState(false);
    const handleRerender = useCallback(() => setRerender((prevState) => !prevState), []);

    const openDebounce = useDebounce(openDuration + transitionDelay);
    const hideDebounce = useDebounce(hideDuration + transitionDelay);

    const isTriggerClickable = !(
      removeCollapseByCondition ||
      openDebounce.active ||
      hideDebounce.active
    );

    const reset = useCallback(() => {
      isFinallyOpenedRef.current = false;
      isFinallyClosedRef.current = false;
      openDebounce.resetDebounce();
      hideDebounce.resetDebounce();
    }, []);

    const handleOpening = useCallback(() => {
      reset();

      setTimeout(() => {
        const observerEl = document.getElementById(cuidRef.current);

        applyCSSToElement(observerEl, {
          maxHeight: observerEl?.scrollHeight + "px",
        });
      }, 0);

      openDebounce.debounce(() => {
        isFinallyOpenedRef.current = true;

        removeCSSFromElement(contentObserverRef.current, ["maxHeight"]);

        onFinalOpened?.();

        handleRerender();
      });
    }, [openDebounce, onFinalOpened]);

    const handleClosing = useCallback(() => {
      reset();

      applyCSSToElement(contentObserverRef.current, {
        maxHeight: contentObserverRef.current?.scrollHeight + "px",
      });

      setTimeout(() => removeCSSFromElement(contentObserverRef.current, ["maxHeight"]), 0);

      hideDebounce.debounce(() => {
        isFinallyClosedRef.current = true;

        onFinalClosed?.();

        handleRerender();
      });
    }, [hideDebounce, onFinalClosed]);

    const handleTrigger = useCallback(() => {
      isOpenRef.current = !isOpenRef.current;

      isOpenRef.current ? handleOpening() : handleClosing();

      handleRerender();
    }, [handleOpening, handleClosing]);

    const handleTriggerClick = useCallback(() => {
      isTriggerClickable && handleTrigger();
    }, [isTriggerClickable, handleTrigger]);

    useDidUpdate(handleTriggerClick, [triggerOpening]);

    const opening = isOpenRef.current && !isFinallyOpenedRef.current;
    const closing = !isOpenRef.current && !isFinallyClosedRef.current;
    const closed = !isOpenRef.current && isFinallyClosedRef.current;

    const containerStyles = cn(
      styles.container,
      { [styles.clickable]: isTriggerClickable },
      triggerClassName,
    );

    const contentObserverStyles = cn(
      styles.contentObserver,
      { [styles.opening]: opening },
      { [styles.closing]: closing },
      { [styles.closed]: closed },
      contentClassName,
    );

    const [openStyles, closeStyles] = useMemo(() => {
      const openStyles = {
        transitionDuration: openDuration + "ms",
        transitionDelay: transitionDelay + "ms",
      };

      const closeStyles = {
        transitionDuration: hideDuration + "ms",
        transitionDelay: transitionDelay + "ms",
      };

      return [openStyles, closeStyles];
    }, [openDuration, hideDuration, transitionDelay]);

    const inlineStyles: React.CSSProperties = isOpenRef.current ? openStyles : closeStyles;

    return (
      <Fragment>
        <div className={containerStyles} onClick={handleTriggerClick}>
          {triggerElement}
        </div>
        {!(removeCollapseByCondition || (removeFromDOMOnClosed && isFinallyClosedRef.current)) && (
          <div
            id={cuidRef.current}
            className={contentObserverStyles}
            style={inlineStyles}
            ref={contentObserverRef}
          >
            {children}
          </div>
        )}
      </Fragment>
    );
  },
);

export default CollapseSelfControlled;