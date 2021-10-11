import { Constructor } from "../types";

export class Entity {
  private static counter = 1;

  public id: number;
  private components: any[] = [];

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

  public getComponent<T>(type: Constructor<T>): T | undefined {
    return this.components.find((component) => component.constructor.name === type.name);
  }
}
