import { Entity } from "./entity";
import { System } from "./system";
import { Component } from "./component";
import { Constructor, Constructors } from "../types";
import { Engine } from "matter-js";

export class World {
  // matter-js engine, holds world with data
  public engine: Engine;

  public entities: Entity[] = [];
  public systems: System[] = [];

  createEntity(): Entity {
    const entity = new Entity(this);
    this.entities.push(entity);
    return entity;
  }

  removeEntity(entity: Entity) {
    entity.clearComponents();
    this.entities = this.entities.filter((ent) => ent !== entity);
  }

  addSystem<T extends System>(type: Constructor<T>) {
    const system = new type();
    system.world = this;

    this.systems.push(system);
  }

  fromAllCache: Map<string, Component[][]> = new Map<string, Component[][]>();

  clearCache() {
    this.fromAllCache.clear();
  }

  fromAll<T extends Component[]>(...types: Constructors<T>): [[...T]] {
    const typesSignature = JSON.stringify(types.map((type) => type.name));
    const cached = this.fromAllCache.get(typesSignature);

    if (cached) {
      return cached as any;
    }

    const result: Component[][] = [];
    this.entities.forEach((entity) => {
      const components = entity.getComponents(...types);
      if (!components) return;
      result.push(components);
    });

    this.fromAllCache.set(typesSignature, result);
    return result as any;
  }

  tick() {
    this.systems.forEach((system) => system.tick());
  }

  start() {
    this.systems.forEach((system) => system.start());
  }

  stop() {
    this.systems.forEach((system) => system.stop());
  }
}
