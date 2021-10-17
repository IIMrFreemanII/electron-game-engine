import { Renderer } from "../../renderer";
import { Translation } from "../components/translation";
import { Square } from "../components/square";
import { System } from "../system";

export class RenderSquareSystem extends System {
  tick() {
    this.world.entities.forEach((entity) => {
      const translation = this.world.getComponent(entity, Translation);
      const square = this.world.getComponent(entity, Square);

      if (translation && square) {
        const { value: position } = translation;
        const { size } = square;

        Renderer.drawSquare(position, size);
      }
    });
  }
}
