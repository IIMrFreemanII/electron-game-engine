import { System } from "../system";
import { Renderer } from "../../renderer";

export class RenderSystem extends System {
  start() {
    Renderer.init(this.world.engine);
  }

  tick() {
    Renderer.render();
  }
}
