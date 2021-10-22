import { Renderer } from "../../renderer";
import { Translation } from "../components/translation";
import { Square } from "../components/square";
import { System } from "../system";

export class RenderSquareSystem extends System {
  tick() {
    this.world.fromAll(Translation, Square).forEach((value) => {
      const [translation, square] = value as [Translation, Square];

      Renderer.drawSquare(translation.value, square.size);
    });
  }
}
