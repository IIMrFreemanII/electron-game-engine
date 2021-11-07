/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.tsx";

import { Player, Renderer, RenderSquareSystem, Square, Translation, World } from "./engine";
import { Vector2 } from "three";
import { GameStateManager } from "./engine/game-state";
import { WorldsManager } from "./engine/ecs/worlds-manager";
import { sleep } from "./frontent/utils";

export class GameLoop {
  public static lastTime = 0;
  private static requestId: number;
  private static shouldUpdate = true;

  public static async init() {
    // hack to wait till react is initialized
    await sleep(0);

    const world = WorldsManager.addWorld();
    const canvasSize = Renderer.getSize();

    for (let i = 0; i < 5; i++) {
      const size = new Vector2(250, 250);
      const squareEntity = world.createEntity();
      squareEntity
        .addComponent(Translation)
        .value.set((canvasSize.width - size.x) * 0.5, (canvasSize.height - size.y) * 0.5);
      squareEntity.addComponent(Square).size.copy(size);

      squareEntity.addComponent(Player);
    }

    world.addSystem(RenderSquareSystem);
    // world.addSystem(RenderCircleSystem);

    WorldsManager.initWorlds();
  }

  public static async start() {
    // hack to wait till react is initialized
    await sleep(0);

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
    const delta = time - GameLoop.lastTime;
    GameLoop.lastTime = time;

    WorldsManager.tickWorlds();

    if (GameStateManager.state === "play") {
      GameLoop.requestId = requestAnimationFrame(GameLoop.animateLoop);
    }
  }
}

GameLoop.init();
GameLoop.start();

console.log('👋 This message is being logged by "renderer.js", included via webpack');
