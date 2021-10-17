// import { Constructor } from "../types";
// import { Component } from "./component";

export class Entity {
  private static counter = 0;
  public id: number;

  // private components: Component[] = [];

  constructor() {
    this.id = Entity.counter;
    Entity.counter++;
  }

  // public addComponent<T extends Component>(component: Constructor<T>): T {
  //   const instance = new component();
  //
  //   this.components.push(instance);
  //
  //   return instance as T;
  // }
  //
  // public getComponent<T extends Component>(type: Constructor<T>): T | undefined {
  //   return this.components.find((component) => component.type === type.name) as T;
  // }
  //
  // public getComponents(): Component[] {
  //   return this.components;
  // }
}
