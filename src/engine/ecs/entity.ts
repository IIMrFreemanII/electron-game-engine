import { Component, proxyComponent, removeProxy } from "./component";
import { Constructor } from "../types";
import { World } from "./world";

export class Entity {
  private static counter = 0;
  id: number;
  components: Component[] = [];
  world: World;

  constructor(world: World) {
    this.id = Entity.counter;
    this.world = world;
    Entity.counter++;
  }

  addComponent<T extends Component>(type: Constructor<T>): T {
    const component = new type();
    component.entity = this;
    this.components.push(component);
    this.world.addComponent(component);

    return component as any;
  }

  removeComponent(component: Component) {
    this.components = this.components.filter((item) => item !== component);
    this.world.removeComponent(component);
  }

  clearComponents() {
    this.components.forEach((component) => {
      this.removeComponent(component);
    });
  }

  getComponent<T extends Component>(type: Constructor<T>): T | undefined {
    return this.components.find((component) => component.type === type.name) as T;
  }

  addComponentsProxy() {
    for (let i = 0; i < this.components.length; i++) {
      this.components[i] = this.world.replaceWithProxy(this.components[i]);
    }
  }

  removeComponentsProxy() {
    for (let i = 0; i < this.components.length; i++) {
      this.components[i] = this.world.replaceProxyWithComponent(this.components[i]);
    }
  }
}
