import { MainSystem, PhysicsSystem, RenderSystem, WorldsManager, GameStateManager } from "engine";

export class Time {
  // time elapsed since start in ms
  public static time = 0;
  // time between frames in ms
  public static delta = 0;
}

export class GameLoop {
  private static requestId: number;

  public static init() {
    const { defaultWorld } = WorldsManager;

    defaultWorld.addSystem(MainSystem);
    defaultWorld.addSystem(RenderSystem);
    defaultWorld.addSystem(PhysicsSystem);

    WorldsManager.startWorlds();
  }

  public static start() {
    GameLoop.requestId = requestAnimationFrame(GameLoop.animateLoop);
  }

  public static once() {
    if (GameStateManager.state === "stop") {
      GameLoop.requestId = requestAnimationFrame(GameLoop.animateLoop);
    }
  }

  public static stop() {
    cancelAnimationFrame(GameLoop.requestId);
  }

  public static animateLoop(time: number) {
    Time.delta = time - Time.time;
    Time.time = time;

    WorldsManager.tickWorlds();

    if (GameStateManager.state === "play") {
      GameLoop.requestId = requestAnimationFrame(GameLoop.animateLoop);
    }
  }
}
