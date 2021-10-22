import { useCallback, useEffect, useRef } from "react";
import { Renderer } from "../../../renderer";

import "./index.css";
import { ProfilerUi } from "../profiler-ui";

export const Canvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    const { current } = containerRef;
    if (!current) return;

    const rect = current.getBoundingClientRect();
    Renderer.setSize(rect.width, rect.height);
  }, []);

  useEffect(() => {
    const { current } = containerRef;
    if (current) {
      const rect = current.getBoundingClientRect();
      Renderer.setSize(rect.width, rect.height);
      current.appendChild(Renderer.canvas);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="canvas-container" ref={containerRef}>
      <ProfilerUi enable={false} />
    </div>
  );
};
