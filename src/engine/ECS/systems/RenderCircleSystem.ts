import { System } from "./System";
import { EntityManager } from "../EntityManager";
import { Transform } from "../components/transform";
import { Circle } from "../components/circle";
import { Renderer } from "../../renderer";

export class RenderCircleSystem extends System {
  onUpdate() {
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
