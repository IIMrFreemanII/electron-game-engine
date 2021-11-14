import { System } from "../system";
import { Mesh } from "three";
import { RenderData } from "../components/render-data";
import { Translation } from "../components";

export class MainSystem extends System {
  start() {
    const cube = this.world.createEntity();
    cube.addComponent(Translation);
    cube.addComponent(RenderData);

    this.world.fromAll(Translation, RenderData).forEach(([translation, renderData]) => {
      const cube = new Mesh(renderData.geometry, renderData.material);
      cube.position.copy(translation.value);

      this.world.scene.add(cube);
    });
  }
}
