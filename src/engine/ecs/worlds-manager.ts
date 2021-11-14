import { World } from "./world";
import EventEmitter from "eventemitter3";

type EventTypes = "onWorldsUpdate";

export class WorldsManager {
  private static emitter = new EventEmitter();
  public static defaultWorld = new World();
  public static worlds: World[] = [this.defaultWorld];

  // public static addWorld() {
  //   const world = new World();
  //   this.worlds.push(world);
  //   this.emitter.emit("onWorldsUpdate", this.worlds);
  //
  //   return world;
  // }

  public static startWorlds() {
    this.worlds.forEach((world) => world.start());
  }

  public static tickWorlds() {
    this.worlds.forEach((world) => world.tick());
  }

  public static tickEditorWorlds() {
    this.worlds.forEach((world) => world.editorTick());
  }

  public static stopWorlds() {
    this.worlds.forEach((world) => world.stop());
    this.worlds = [];
  }

  public static addListener(event: EventTypes, callback: (worlds: World[]) => void) {
    this.emitter.addListener(event, callback);
  }

  public static removeListener(event: EventTypes, callback: (worlds: World[]) => void) {
    this.emitter.removeListener(event, callback);
  }
}
