import { Constructor } from "../types";
import { Component } from "./components/component";

export class Entity {
  private static counter = 1;

  public id: number;
  private components: Component[] = [];

  constructor() {
    this.id = Entity.counter;
    Entity.counter++;
  }

  public addComponent(component) {
    this.components.push(component);
  }

  public addComponents(components) {
    this.components.push(...components);
  }

  public getComponent<T extends Component>(type: Constructor<T>): T | undefined {
    return this.components.find((component) => component.type === type.name) as T;
  }
}
