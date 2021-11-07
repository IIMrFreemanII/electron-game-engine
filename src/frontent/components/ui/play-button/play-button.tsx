import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../button/button";

import styles from "./play-button.module.scss";
import { GameState, GameStateManager } from "engine/game-state";
import { GameLoop } from "../../../../renderer";

export const useGameState = () => {
  const [state, setState] = useState<GameState>("stop");

  useEffect(() => {
    GameStateManager.addListener("stateChange", handleStateChange);
    return () => GameStateManager.removeListener("stateChange", handleStateChange);
  }, []);

  const handleStateChange = useCallback((state: GameState) => {
    state === "play" ? GameLoop.start() : GameLoop.stop();

    setState(state);
  }, []);

  const toggleState = useCallback(() => {
    setState((prev) => {
      const state: GameState = prev === "play" ? "stop" : "play";
      GameStateManager.setState(state);
      return state;
    });
  }, []);

  return useMemo(() => ({ toggleState, state }), [toggleState, state]);
};

export const PlayButton = () => {
  const { toggleState, state } = useGameState();
  return (
    <Button className={styles.button} onClick={toggleState}>
      {state === "play" ? "stop" : "play"}
    </Button>
  );
};
