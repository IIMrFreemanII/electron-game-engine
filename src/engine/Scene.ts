import { Entity } from "./ECS/Entity";
import { System } from "./ECS/systems/System";
import { Profiler } from "./Profiler";

export class Scene {
  public entities: Entity[];
  public systems: System[];

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }
  addSystem(system: System) {
    this.systems.push(system);
  }

  onUpdate() {
    this.systems.forEach((system) =>
      Profiler.profile(system.constructor.name, () => system.onUpdate()),
    );
  }
}
