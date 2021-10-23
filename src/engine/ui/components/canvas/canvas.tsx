import { useDidMount, useResize } from "frontent/hooks";
import { Renderer } from "../../../renderer";
import { ProfilerUi } from "../profiler-ui";
import { CANVAS_WRAPPER_ID } from "./canvas.constants";

import styles from "./canvas.module.scss";

export const Canvas = () => {
  const { ref, refCallback, elementRectRef } = useResize(null, (elementRect) => {
    const { width, height } = elementRect;
    Renderer.setSize(width, height);
  });

  useDidMount(() => {
    const current = ref.current;
    if (!current) return;

    const { width, height } = elementRectRef.current;
    Renderer.setSize(width, height);
    current.appendChild(Renderer.canvas);
  });

  return (
    <div id={CANVAS_WRAPPER_ID} className={styles.container} ref={refCallback}>
      <ProfilerUi enable={false} />
    </div>
  );
};
