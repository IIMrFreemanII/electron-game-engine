import React, { memo, useEffect, useState } from "react";
import { Vector2 } from "three";

import { RenderSquareSystem, Translation, Square, Player, World, Renderer } from "engine";
import { Editor } from "frontent/pages";

import styles from "frontent/assets/styles/app.module.scss";
import { GameStateManager } from "./engine/game-state";
import { useGameState } from "./frontent/components";

export const App = memo(() => {
  // const { state } = useGameState();
  // const [worlds, setWorlds] = useState<World[]>([new World()]);

  // useEffect(() => {
  //   const worlds = [new World()];
  //   const [world] = worlds;
  //   setWorlds(worlds);
  //
  //   const canvasSize = Renderer.getSize();
  //
  //   for (let i = 0; i < 5; i++) {
  //     const size = new Vector2(250, 250);
  //     const squareEntity = world.createEntity();
  //     squareEntity
  //       .addComponent(Translation)
  //       .value.set((canvasSize.width - size.x) * 0.5, (canvasSize.height - size.y) * 0.5);
  //     squareEntity.addComponent(Square).size.copy(size);
  //
  //     squareEntity.addComponent(Player);
  //   }
  //
  //   world.addSystem(RenderSquareSystem);
  //   // world.addSystem(RenderCircleSystem);
  //
  //   world.init();
  //
  //   let lastTime = 0;
  //
  //   const animate = (time) => {
  //     const delta = time - lastTime;
  //     lastTime = time;
  //
  //     world.tick();
  //
  //     if (GameStateManager.state === "play") {
  //       requestAnimationFrame(animate);
  //     }
  //   };
  //
  //   animate(0);
  // }, [state]);

  return (
    <div className={styles.app}>
      <Editor />
    </div>
  );
});
