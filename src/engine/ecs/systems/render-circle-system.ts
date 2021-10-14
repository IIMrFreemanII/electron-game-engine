import { System } from "./system";
import { EntityManager } from "../entity-manager";
import { Renderer } from "../../renderer";
import { Circle } from "../components/circle";
import { Transform } from "../components/transform";

export class RenderCircleSystem extends System {
  tick() {
    const entities = EntityManager.getAll();
    entities.forEach((entity) => {
      const transform = entity.getComponent(Transform);
      const circle = entity.getComponent(Circle);

      if (transform && circle) {
        const { position } = transform;
        const { radius } = circle;

        Renderer.drawCircle(position, radius);
      }
    });
  }
}
