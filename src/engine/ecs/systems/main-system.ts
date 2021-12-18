import { System } from "../system";
import { RenderData } from "../components/render-data";
import { Transform } from "../components";
import { Time } from "../../game-loop";
import { Mesh } from "../../renderer/nick/mesh";
import { normals, positions } from "../../renderer/nick/cube-data";
import { Shader } from "../../renderer/nick";
import vertShader from "../../../assets/shaders/default.vert";
import fragShader from "../../../assets/shaders/default.frag";
import { vec3, vec4 } from "gl-matrix";

export class MainSystem extends System {
  onCreate() {
    const shader = new Shader("default", vertShader, fragShader);
    shader.uniforms.color.value = vec4.fromValues(0.2, 1, 0.2, 1);
    const mesh = new Mesh({ a_position: positions, a_normal: normals });
    const width = 2;
    const height = 2;
    const depth = 1;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        for (let z = 0; z < depth; z++) {
          const cube = this.world.createEntity();

          const transform = cube.addComponent(Transform);
          transform.position = vec3.fromValues(x, y, z);
          transform.updateModelMatrix();

          const renderData = cube.addComponent(RenderData);
          renderData.shader = shader;
          renderData.mesh = mesh;
        }
      }
    }
  }

  tick() {
    // const arr = this.world.fromAll(Transform);
    // for (let i = 0; i < arr.length; i++) {
    //   const components = arr[i];
    //   const transform = components[0];
    //   const speed = 20;
    //
    //   transform.rotation[0] += Time.delta * speed;
    //   transform.rotation[1] += Time.delta * speed;
    //   transform.rotation[2] += Time.delta * speed;
    //
    //   transform.updateModelMatrix();
    // }
  }
}
