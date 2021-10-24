import { Renderer } from "../../renderer";
import { Translation } from "../components/translation";
import { Square } from "../components/square";
import { System } from "../system";
import { Mouse } from "../../input/mouse";

export class RenderSquareSystem extends System {
  tick() {
    this.world.fromAll(Translation, Square).forEach((value) => {
      const [translation, square] = value as [Translation, Square];

      // console.log(translation);
      // translation.value.set(Mouse.position.x, Mouse.position.y);
      // translation.age++;

      Renderer.drawSquare(translation.value, square.size);
    });
  }

  // init() {
  //   this.world.fromAll(Translation, Square).forEach((value) => {
  //     const [translation, square] = value as [Translation, Square];
  //
  //     console.log("system", translation);
  //     // console.log(translation);
  //     translation.value.set(Mouse.position.x, Mouse.position.y);
  //     translation.age++;
  //
  //     Renderer.drawSquare(translation.value, square.size);
  //   });
  // }
}
