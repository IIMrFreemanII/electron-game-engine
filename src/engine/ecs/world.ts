import { Profiler } from "../profiler";
import { Entity } from "./entity";
import { System } from "./system";
import { Component } from "./component";
import { Renderer } from "../renderer";
import { Constructor, Constructors } from "../types";

export class World {
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
    this.systems.push(new type(this));
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
    Renderer.clear();

    this.systems.forEach((system) => Profiler.profile(system.type, () => system.tick()));
  }

  init() {
    this.systems.forEach((system) => system.init());
  }

  destroy() {
    this.systems.forEach((system) => system.destroy());
  }
}
