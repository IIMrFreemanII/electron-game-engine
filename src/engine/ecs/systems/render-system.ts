import { System } from "../system";
import { Renderer } from "../../renderer/nick";
import { glMatrix, mat4, vec3 } from "gl-matrix";
import { Transform } from "../components";
import { RenderData } from "../components/render-data";

export const mainRenderer = new Renderer();

export class RenderSystem extends System {
  // light
  invertLightDir = vec3.fromValues(0.5, 0.7, 1);

  // camera
  perspective = mat4.create();
  near = 0.1;
  far = 1000;
  fov = 60;

  camPos = vec3.fromValues(0, 55, 55);
  camFront = vec3.fromValues(0, 0, 0);
  camUp = vec3.fromValues(0, 1, 0);
  view = mat4.create();

  onCreate() {
    vec3.normalize(this.invertLightDir, this.invertLightDir);
    mat4.perspective(
      this.perspective,
      glMatrix.toRadian(this.fov),
      mainRenderer.canvas.width / mainRenderer.canvas.height,
      this.near,
      this.far,
    );
    mat4.lookAt(this.view, this.camPos, this.camFront, this.camUp);

    mainRenderer.ubos.Matrices.set("perspective", this.perspective);
    mainRenderer.ubos.Matrices.set("view", this.view);
    mainRenderer.ubos.Lights.set("reverseLightDirection", this.invertLightDir);
  }

  editorTick() {
    this.render();
  }

  tick() {
    this.render();
  }

  render() {
    mainRenderer.begin(this.perspective, this.view);

    const arr = this.world.fromAll(Transform, RenderData);
    for (let i = 0; i < arr.length; i++) {
      const components = arr[i];
      const transform = components[0];
      const renderData = components[1];
      const { mesh, shader } = renderData;
      const { uniforms } = shader;

      uniforms.model.value = transform.modelMatrix;

      mainRenderer.submit(mesh, shader);
    }

    mainRenderer.end();
  }
}
