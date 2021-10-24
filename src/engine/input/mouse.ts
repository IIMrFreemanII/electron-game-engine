import { Vector2 } from "three";
import { Renderer } from "../renderer";

export class Mouse {
  static position = new Vector2(0, 0);
}

Renderer.canvas.addEventListener("mousemove", (e) => {
  const canvas = e.target as HTMLCanvasElement;
  const rect = canvas.getBoundingClientRect();
  Mouse.position.set(e.x - rect.x, e.y - rect.y);
});
