import { Renderer } from "../../renderer";
import { EntityManager } from "../entity-manager";
import { Transform } from "../components/transform";
import { Square } from "../components/square";
import { System } from "./system";

export class RenderSquareSystem extends System {
  tick() {
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
