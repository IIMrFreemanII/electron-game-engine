import { System } from "../system";
import { Engine } from "matter-js";

export class PhysicsSystem extends System {
  tick() {
    Engine.update(this.world.engine);
  }
}
