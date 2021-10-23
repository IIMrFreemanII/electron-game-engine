import { useState } from "react";

import { useWindowEvent } from "frontent/hooks";

type Output = {
  windowWidth: number;
  windowHeight: number;
};

export const useWindowSize = (onResize?: VoidFunction): Output => {
  const isClient = typeof window === "object";

  const getSize = () => ({
    windowWidth: isClient ? window.innerWidth : 0,
    windowHeight: isClient ? window.innerHeight : 0,
  });

  const [windowSize, setWindowSize] = useState(getSize);

  const handleResize = () => {
    setWindowSize(getSize());
    onResize?.();
  };

  useWindowEvent("resize", handleResize);

  return windowSize;
};

export default useWindowSize;
