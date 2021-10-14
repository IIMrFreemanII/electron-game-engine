import React, { useEffect } from "react";
import { Vector2 } from "three";
import { RenderSquareSystem } from "./engine/ecs/systems/render-square-system";
import { EntityManager } from "./engine/ecs/entity-manager";
import { RenderCircleSystem } from "./engine/ecs/systems/render-circle-system";
import { Renderer } from "./engine/renderer";
import { Transform } from "./engine/ecs/components/transform";
import { Square } from "./engine/ecs/components/square";
import { ProfilerUi } from "./engine/ui/components/profiler-ui";
import { Profiler } from "./engine/profiler";

export const App = () => {
  useEffect(() => {
    document.getElementById("root")?.appendChild(Renderer.canvas);
    Renderer.setSize(innerWidth, innerHeight);

    window.addEventListener("resize", () => {
      Renderer.setSize(innerWidth, innerHeight);
    });

    for (let i = 0; i < 100; i++) {
      const x = Math.random() * innerWidth;
      const y = Math.random() * innerHeight;
      const width = Math.random() * 10;
      const height = Math.random() * 10;
      const radius = Math.random() * 10;

      EntityManager.create().addComponents([
        new Transform(new Vector2(x, y)),
        new Square(new Vector2(width, height)),
      ]);
      // EntityManager.create().addComponents([
      //     new Transform(new Vector2(x, y)),
      //     new Circle(radius)
      // ]);
    }

    const systems = [new RenderSquareSystem(), new RenderCircleSystem()];

    let lastTime = 0;

    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      Renderer.clear();

      systems.forEach((system) => Profiler.profile(system.type, () => system.tick()));

      requestAnimationFrame(animate);
    };

    animate(0);
  }, []);

  return <ProfilerUi />;
};
