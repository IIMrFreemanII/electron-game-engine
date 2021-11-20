import { System } from "../system";
import { Mesh } from "three";
import { RenderData } from "../components/render-data";
import { Transform } from "../components";
import { Time } from "../../game-loop";

export class MainSystem extends System {
  onCreate() {
    const cube = this.world.createEntity();
    cube.addComponent(Transform);
    cube.addComponent(RenderData);

    this.world.fromAll(Transform, RenderData).forEach(([transform, renderData]) => {
      const cube = new Mesh(renderData.geometry, renderData.material);
      cube.position.copy(transform.position);
      cube.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z);
      cube.scale.copy(transform.scale);
      transform.position = cube.position;
      transform.scale = cube.scale;

      this.world.scene.add(cube);
    });
  }

  tick() {
    this.world.fromAll(Transform, RenderData).forEach(([transform, data]) => {
      transform.position.x += Time.delta;
    });
  }
}
