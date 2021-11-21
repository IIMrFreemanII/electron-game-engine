import { sleep } from "frontent/utils";
import { System } from "../system";
import { Renderer } from "../../renderer/nick";

export const mainRenderer = new Renderer();

export class RenderSystem extends System {
  async onCreate() {
    await sleep(0);

    mainRenderer.start();
  }

  editorTick() {

  }

  tick() {

  }
}
