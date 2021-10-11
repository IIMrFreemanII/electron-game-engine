import { Vector2 } from "three";

export class Renderer {
  public static canvas: HTMLCanvasElement = document.createElement("canvas");
  public static ctx: CanvasRenderingContext2D = Renderer.canvas.getContext(
    "2d",
  ) as CanvasRenderingContext2D;

  public static setSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public static getSize(): Vector2 {
    return new Vector2(this.canvas.width, this.canvas.height);
  }

  public static clear() {
    Renderer.ctx.clearRect(0, 0, ...this.getSize().toArray());
  }

  public static drawSquare(position: Vector2, size: Vector2) {
    this.ctx.fillRect(position.x, position.y, size.width, size.height);
  }

  public static drawCircle(position: Vector2, radius: number) {
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
