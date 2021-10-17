import { Entity } from "./entity";

export class Component {
  entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }
  get type() {
    return this.constructor.name;
  }
}
