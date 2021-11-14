import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../button/button";

import styles from "./play-button.module.scss";

// refactor imports
import { GameState, GameStateManager } from "engine/game-state";
import { GameLoop } from "../../../../renderer";

export const useGameState = () => {
  const [state, setState] = useState<GameState>("stop");

  // use useDidMount
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
      // {oppositeState} to not repeat same ternary
      const state: GameState = prev === "play" ? "stop" : "play";
      GameStateManager.setState(state);
      return state;
    });
  }, []);

  // it's useless to add toggleState to memoizing deps since it's never changed due to it has [] deps
  return useMemo(() => ({ toggleState, state }), [toggleState, state]);
};

// Don't ever do this. components has no relation to business logic, move this button to canvas component
export const PlayButton = () => {
  const { toggleState, state } = useGameState();

  /**
   * {state === "play" ? "stop" : "play"}
   *  We can do such condition directly in useGameState since it also repeated in toggleState callback,
   *  and instead use something like
   *  <Button className={styles.button} onClick={toggleState}>
        {oppositeState}
      </Button>
   */
  return (
    <Button className={styles.button} onClick={toggleState}>
      {state === "play" ? "stop" : "play"}
    </Button>
  );
};
