import React, { useEffect } from "react";
import { RenderSquareSystem } from "./engine/ecs/systems/render-square-system";
import { RenderCircleSystem } from "./engine/ecs/systems/render-circle-system";
import { Renderer } from "./engine/renderer";
import { Translation } from "./engine/ecs/components/translation";
import { Square } from "./engine/ecs/components/square";
import { ProfilerUi } from "./engine/ui/components/profiler-ui";
import { World } from "./engine/ecs/world";

export const App = () => {
  useEffect(() => {
    document.getElementById("root")?.appendChild(Renderer.canvas);
    Renderer.setSize(innerWidth, innerHeight);

    window.addEventListener("resize", () => {
      Renderer.setSize(innerWidth, innerHeight);
    });

    const world = new World();

    for (let i = 0; i < 10; i++) {
      const x = Math.random() * innerWidth;
      const y = Math.random() * innerHeight;
      const width = Math.random() * 10;
      const height = Math.random() * 10;
      // const radius = Math.random() * 10;

      const squareEntity = world.createEntity();
      world.addComponent(squareEntity, Translation).value.set(x, y);
      world.addComponent(squareEntity, Square).size.set(width, height);

      // world.destroyEntity(squareEntity);
      // world.destroyComponent(squareEntity, Translation);
      // world.destroyComponent(squareEntity, Square);

      // const squareEntity1 = world.createEntity();
      // world.addComponent(squareEntity1, Translation).value.set(x, y);
      // world.addComponent(squareEntity1, Square).size.set(width, height);
    }

    world.addSystem(RenderSquareSystem);
    world.addSystem(RenderCircleSystem);

    console.log(world);
    console.log(world.fromAll([Translation, Square]));

    let lastTime = 0;

    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      world.tick();

      requestAnimationFrame(animate);
    };

    animate(0);
  }, []);

  // return <ProfilerUi />;
  return null;
};
