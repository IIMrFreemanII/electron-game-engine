import { System } from "../system";
import { Renderer } from "../../renderer";
import { Circle } from "../components/circle";
import { Translation } from "../components/translation";

export class RenderCircleSystem extends System {
  tick() {
    // this.world.entities.forEach((entity) => {
    //   const transform = entity.getComponent(Transform);
    //   const circle = entity.getComponent(Circle);
    //
    //   if (transform && circle) {
    //     const { value: position } = transform;
    //     const { radius } = circle;
    //
    //     Renderer.drawCircle(position, radius);
    //   }
    // });
  }
}
