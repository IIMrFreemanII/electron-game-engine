import { Profiler } from "../profiler";
import { Entity } from "./entity";
import { System } from "./systems/system";

export class World {
  public entities: Entity[];
  public systems: System[];

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }
  addSystem(system: System) {
    this.systems.push(system);
  }

  tick() {
    this.systems.forEach((system) =>
      Profiler.profile(system.constructor.name, () => system.tick()),
    );
  }
}
