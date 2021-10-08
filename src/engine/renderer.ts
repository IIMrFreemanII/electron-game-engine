import { Vector2 } from "three";

export class Renderer {
    public static domElement: HTMLCanvasElement = document.createElement('canvas');
    public static ctx: CanvasRenderingContext2D = Renderer.domElement.getContext('2d');

    public static setSize(width: number, height: number) {
        this.domElement.width = width;
        this.domElement.height = height;
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