import React, { useEffect, useState } from "react";
import { Vector2 } from "three";

import { RenderSquareSystem } from "./engine/ecs/systems/render-square-system";
import { Translation } from "./engine/ecs/components/translation";
import { Square } from "./engine/ecs/components/square";
import { World } from "./engine/ecs/world";
import { Editor } from "frontent/pages";
import { Renderer } from "./engine/renderer";
import { Player } from "./engine/ecs/components/player";

export const App = () => {
  const [worlds, setWorlds] = useState<World[]>([]);

  useEffect(() => {
    const world = new World();
    setWorlds((prev) => [...prev, world]);
    const canvasSize = Renderer.getSize();

    for (let i = 0; i < 5; i++) {
      const size = new Vector2(250, 250);
      const squareEntity = world.createEntity();
      // squareEntity
      // .addComponent(Translation)
      // .value.set((canvasSize.width - size.x) * 0.5, (canvasSize.height - size.y) * 0.5);
      // squareEntity.addComponent(Square).size.copy(size);

      squareEntity.addComponent(Player);
    }

    // for (let i = 0; i < 1; i++) {
    //   const x = Math.random() * innerWidth;
    //   const y = Math.random() * innerHeight;
    //   const width = Math.random() * 500;
    //   const height = Math.random() * 500;
    //   // const radius = Math.random() * 10;
    //
    //   const squareEntity = world.createEntity();
    //   world.addComponent(squareEntity, Translation).value.set(x, y);
    //   world.addComponent(squareEntity, Square).size.set(width, height);
    //
    //   // world.destroyEntity(squareEntity);
    //   // world.destroyComponent(squareEntity, Translation);
    //   // world.destroyComponent(squareEntity, Square);
    //
    //   // const squareEntity1 = world.createEntity();
    //   // world.addComponent(squareEntity1, Translation).value.set(x, y);
    //   // world.addComponent(squareEntity1, Square).size.set(width, height);
    // }

    world.addSystem(RenderSquareSystem);
    // world.addSystem(RenderCircleSystem);

    world.init();

    let lastTime = 0;

    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      world.tick();

      requestAnimationFrame(animate);
    };

    animate(0);
  }, []);

  return (
    <>
      <Editor worlds={worlds} />
    </>
  );
};
