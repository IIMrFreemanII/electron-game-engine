import { useCallback, useEffect, useRef } from "react";

import { useDidMount } from "frontent/hooks";
import { Renderer } from "engine/renderer";
import { ProfilerUi, PlayButton } from "frontent/components";
import { CANVAS_WRAPPER_ID } from "./canvas.constants";

import styles from "./canvas.module.scss";

export const Canvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    const { current } = containerRef;
    if (!current) return;
    const { width, height } = current.getBoundingClientRect();
    Renderer.setSize(width, height);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useDidMount(() => {
    const { current } = containerRef;
    if (!current) return;
    const { width, height } = current.getBoundingClientRect();
    Renderer.setSize(width, height);
    current.appendChild(Renderer.canvas);
  });

  return (
    <div id={CANVAS_WRAPPER_ID} className={styles.container} ref={containerRef}>
      <PlayButton />
      <ProfilerUi enable={false} />
    </div>
  );
};
