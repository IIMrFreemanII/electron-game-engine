import { World } from "../world";

export class Component {
  world: World | null;
  constructor() {
    this.world = null;
  }
  get type() {
    return this.constructor.name;
  }
}
