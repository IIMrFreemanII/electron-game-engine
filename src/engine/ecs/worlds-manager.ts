import { World } from "./world";
import EventEmitter from "eventemitter3";

type EventTypes = "onWorldsUpdate";

export class WorldsManager {
  private static emitter = new EventEmitter();
  public static worlds: World[] = [];

  public static addWorld() {
    const world = new World();
    this.worlds.push(world);
    this.emitter.emit("onWorldsUpdate", this.worlds);

    return world;
  }

  public static initWorlds() {
    this.worlds.forEach((world) => {
      world.init();
    });
  }

  public static tickWorlds() {
    this.worlds.forEach((world) => {
      world.tick();
    });
  }

  public static destroyWorlds() {
    this.worlds.forEach((world) => {
      world.destroy();
    });
    this.worlds = [];
  }

  public static addListener(event: EventTypes, callback: (worlds: World[]) => void) {
    this.emitter.addListener(event, callback);
  }

  public static removeListener(event: EventTypes, callback: (worlds: World[]) => void) {
    this.emitter.removeListener(event, callback);
  }
}
