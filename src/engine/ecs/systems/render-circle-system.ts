import { System } from "../system";
import { Renderer } from "../../renderer";
import { Circle } from "../components/circle";
import { Translation } from "../components/translation";

export class RenderCircleSystem extends System {
  tick() {
    this.world.fromAll(Translation, Circle).forEach((value) => {
      const [translation, circle] = value as [Translation, Circle];

      Renderer.drawCircle(translation.value, circle.radius);
    });
  }
}
