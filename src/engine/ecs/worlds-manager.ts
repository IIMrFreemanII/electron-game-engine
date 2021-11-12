import { World } from "./world";
import EventEmitter from "eventemitter3";
import { Engine } from "matter-js";

type EventTypes = "onWorldsUpdate";

export class WorldsManager {
  private static emitter = new EventEmitter();
  public static worlds: World[] = [];

  public static addWorld() {
    const world = new World();
    world.engine = Engine.create();
    this.worlds.push(world);
    this.emitter.emit("onWorldsUpdate", this.worlds);

    return world;
  }

  public static startWorlds() {
    this.worlds.forEach((world) => {
      world.start();
    });
  }

  public static tickWorlds() {
    this.worlds.forEach((world) => {
      world.tick();
    });
  }

  public static stopWorlds() {
    this.worlds.forEach((world) => {
      world.stop();
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
