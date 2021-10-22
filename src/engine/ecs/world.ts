import { Profiler } from "../profiler";
import { Entity } from "./entity";
import { System } from "./system";
import { Component } from "./component";
import { Renderer } from "../renderer";
import { Constructor } from "../types";

export class World {
  public entities: Entity[] = [];
  private mapEntityIdToComponents = new Map<number, Component[]>();
  public components = new Map<string, Component[]>();
  public systems: System[] = [];

  createEntity(): Entity {
    const entity = new Entity();
    this.entities.push(entity);
    return entity;
  }

  addComponent<T extends Component>(entity: Entity, type: Constructor<T>): T {
    const component = new type();
    component.entity = entity;

    const components = this.components.get(type.name);

    if (components) {
      components.push(component);
    } else {
      this.components.set(type.name, [component]);
    }

    const entityComponents = this.mapEntityIdToComponents.get(entity.id);
    if (entityComponents) {
      entityComponents.push(component);
    } else {
      this.mapEntityIdToComponents.set(entity.id, [component]);
    }

    return component as T;
  }

  getComponent<T extends Component>(entity: Entity, type: Constructor<T>): T | undefined {
    const components = this.mapEntityIdToComponents.get(entity.id);
    return components?.find((component) => component.type === type.name) as T;
  }

  destroyComponent<T extends Component>(entity: Entity, component: T): boolean {
    const entityComponents = this.mapEntityIdToComponents.get(entity.id);
    const components = this.components.get(component.type);

    if (entityComponents && components) {
      const newEntityComponents = entityComponents.filter((item) => item !== component);
      this.mapEntityIdToComponents.set(entity.id, newEntityComponents);

      const newComponents = components.filter((item) => item !== component);
      this.components.set(component.type, newComponents);

      return true;
    }

    return false;
  }

  destroyEntity(entity: Entity) {
    this.entities = this.entities.filter((ent) => ent.id !== entity.id);
    const components = this.mapEntityIdToComponents.get(entity.id);
    components?.forEach((component) => {
      this.destroyComponent(entity, component);
    });
    this.mapEntityIdToComponents.delete(entity.id);
  }

  addSystem<T extends System>(type: Constructor<T>) {
    this.systems.push(new type(this));
  }

  fromType<T extends Component>(type: Constructor<T>): T[] {
    return (this.components.get(type.name) || []) as T[];
  }

  // [Transform, ...others]
  // (...arr) => {}
  fromAllCache: Map<string, Component[][]> = new Map<string, Component[][]>();

  fromAll<T extends Component[]>(...types: Constructor<Component>[]): [[...T]] {
    const typesSignature = JSON.stringify(types.map((type) => type.name));
    const cached = this.fromAllCache.get(typesSignature);

    if (cached) {
      return cached as any;
    }

    const componentsArr = types.map((type) => this.fromType(type));

    let smallest: Component[] = [];
    componentsArr.forEach((components) => {
      if (!components.length) return;

      if (!smallest.length) {
        smallest = components;
      }

      if (smallest.length > components.length) {
        smallest = components;
      }
    });

    const result = smallest.filter((component) => {
      const { entity } = component;
      return types.every((type) => {
        return this.getComponent(entity, type);
      });
    });

    const final = result.map((component) => {
      const { entity } = component;

      return types.map((type) => {
        return this.getComponent(entity, type);
      });
    });

    this.fromAllCache.set(typesSignature, final as any);
    return final as any;
  }

  tick() {
    Renderer.clear();

    this.systems.forEach((system) => Profiler.profile(system.type, () => system.tick()));
  }
}