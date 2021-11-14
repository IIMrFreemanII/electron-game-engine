import { World } from "./world";

export class System {
  public world: World;

  tick(): void {}

  editorTick(): void {}

  start(): void {}

  stop(): void {}

  get type() {
    return this.constructor.name;
  }
}
