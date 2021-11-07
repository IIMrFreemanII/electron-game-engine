import { World } from "./world";

export class System {
  constructor(public world: World) {}

  tick(): void {}

  init(): void {}

  destroy(): void {}

  get type() {
    return this.constructor.name;
  }
}
