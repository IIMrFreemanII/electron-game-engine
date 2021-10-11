import { System } from "./System";
import { EntityManager } from "../EntityManager";
import { Transform } from "../components/transform";
import { Square } from "../components/square";
import { Renderer } from "../../renderer";

export class RenderSquareSystem extends System {
  onUpdate() {
    const entities = EntityManager.getAll();
    entities.forEach((entity) => {
      const transform = entity.getComponent(Transform);
      const square = entity.getComponent(Square);

      if (transform && square) {
        const { position } = transform;
        const { size } = square;

        Renderer.drawSquare(position, size);
      }
    });
  }
}
