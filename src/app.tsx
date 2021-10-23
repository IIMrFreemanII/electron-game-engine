import React, { useEffect, useState } from "react";
import { Vector2 } from "three";

import { RenderSquareSystem } from "./engine/ecs/systems/render-square-system";
import { Translation } from "./engine/ecs/components/translation";
import { Square } from "./engine/ecs/components/square";
import { World } from "./engine/ecs/world";
import { Editor } from "./engine/ui/components/editor";
import { Renderer } from "./engine/renderer";

export const App = () => {
  const [worlds, setWorlds] = useState<World[]>([]);

  useEffect(() => {
    const world = new World();
    setWorlds((prev) => [...prev, world]);
    const canvasSize = Renderer.getSize();

    const size = new Vector2(250, 250);
    const squareEntity = world.createEntity();
    world
      .addComponent(squareEntity, Translation)
      .value.set((canvasSize.width - size.x) * 0.5, (canvasSize.height - size.y) * 0.5);
    world.addComponent(squareEntity, Square).size.copy(size);

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
