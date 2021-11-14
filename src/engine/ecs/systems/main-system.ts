import { System } from "../system";
import { Bodies, Composite } from "matter-js";
import { Size, Translation } from "../components";
import { PhysicsBody } from "../components/physics-body";

export class MainSystem extends System {
  start() {
    const boxA = this.world.createEntity();
    boxA.addComponent(Translation).value.set(400, 200);
    boxA.addComponent(Size).value.set(80, 80);
    boxA.addComponent(PhysicsBody).static = false;

    const boxB = this.world.createEntity();
    boxB.addComponent(Translation).value.set(450, 50);
    boxB.addComponent(Size).value.set(80, 80);
    boxB.addComponent(PhysicsBody).static = false;

    const ground = this.world.createEntity();
    ground.addComponent(Translation).value.set(400, 610);
    ground.addComponent(Size).value.set(810, 60);
    ground.addComponent(PhysicsBody).static = true;

    this.world
      .fromAll(Translation, Size, PhysicsBody)
      .forEach(([translation, size, physicsBody]) => {
        const body = Bodies.rectangle(
          translation.value.x,
          translation.value.y,
          size.value.x,
          size.value.y,
          { isStatic: physicsBody.static },
        );
        Composite.add(this.world.engine.world, body);
      });
  }
}
