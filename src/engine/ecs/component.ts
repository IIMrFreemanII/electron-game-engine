import { Entity } from "./entity";

export class Component {
  entity: Entity;

  get type() {
    return this.constructor.name;
  }
}
