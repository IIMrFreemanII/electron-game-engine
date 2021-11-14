import { Vector2 } from "three";
import { Engine, Render } from "matter-js";

export class Renderer {
  public static canvas: HTMLCanvasElement = document.createElement("canvas");
  public static matterRender: Render;

  public static setSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public static getSize(): Vector2 {
    return new Vector2(this.canvas.width, this.canvas.height);
  }

  public static init(engine: Engine) {
    if (!this.matterRender) {
      const { width, height } = this.canvas;
      this.matterRender = Render.create({
        canvas: Renderer.canvas,
        options: {
          width,
          height,
        },
        engine,
      });
    }
  }

  public static render() {
    Render.world(this.matterRender);
  }
}
