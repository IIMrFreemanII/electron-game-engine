import { Profiler } from "../profiler";
import { Entity } from "./entity";
import { System } from "./system";
import { Component, proxyComponent, removeProxy } from "./component";
import { Renderer } from "../renderer";
import { Constructor } from "../types";

export class World {
  public entities: Entity[] = [];
  public components = new Map<string, Component[]>();
  public systems: System[] = [];

  getComponentIndex(component: Component) {
    const arr = this.components.get(component.type);
    return arr?.indexOf(component);
  }

  replaceWithProxy(component: Component) {
    const index = this.getComponentIndex(component);
    const proxy = proxyComponent(component);
    const arr = this.components.get(component.type);

    if (arr && index !== -1 && index !== undefined) {
      arr[index] = proxy;
    }

    this.fromAllCache.clear();

    return proxy;
  }

  replaceProxyWithComponent(proxyComponent: Component) {
    const index = this.getComponentIndex(proxyComponent);
    const component = removeProxy(proxyComponent);
    const arr = this.components.get(component.type);

    if (arr && index !== -1 && index !== undefined) {
      arr[index] = component;
    }

    this.fromAllCache.clear();

    return component;
  }

  createEntity(): Entity {
    const entity = new Entity(this);
    this.entities.push(entity);
    return entity;
  }

  addComponent<T extends Component>(component: T) {
    const components = this.components.get(component.type);

    if (components) {
      components.push(component);
    } else {
      this.components.set(component.type, [component]);
    }
  }

  removeComponent<T extends Component>(component: T) {
    const components = this.components.get(component.type);

    if (components) {
      this.components.set(
        component.type,
        components.filter((item) => item !== component),
      );
    }
  }

  removeEntity(entity: Entity) {
    entity.clearComponents();
    this.entities = this.entities.filter((ent) => ent !== entity);
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
      return types.every((type) => {
        return component.entity.getComponent(type);
      });
    });

    const final = result.map((component) => {
      return types.map((type) => {
        return component.entity.getComponent(type);
      });
    });

    this.fromAllCache.set(typesSignature, final as any);
    return final as any;
  }

  tick() {
    Renderer.clear();

    this.systems.forEach((system) => Profiler.profile(system.type, () => system.tick()));
  }

  init() {
    this.systems.forEach((system) => system.init());
  }
}
