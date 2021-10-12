import React, { useEffect } from "react";
import { Vector2 } from "three";

import { RenderSquareSystem } from "engine/ECS/systems/RenderSquareSystem";
import { EntityManager } from "engine/ECS/EntityManager";
import { Transform } from "engine/ECS/components/transform";
import { Square } from "engine/ECS/components/square";
import { RenderCircleSystem } from "engine/ECS/systems/RenderCircleSystem";
import { Profiler, Renderer, ProfilerUI } from "engine";

export const App = () => {
  useEffect(() => {
    document.getElementById("root")?.appendChild(Renderer.canvas);
    Renderer.setSize(innerWidth, innerHeight);

    window.addEventListener("resize", () => {
      Renderer.setSize(innerWidth, innerHeight);
    });

    for (let i = 0; i < 1000; i++) {
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

      systems.forEach((system) =>
        Profiler.profile(system.constructor.name, () => system.onUpdate()),
      );

      requestAnimationFrame(animate);
    };

    animate(0);
  }, []);

  return <ProfilerUI />;
};
