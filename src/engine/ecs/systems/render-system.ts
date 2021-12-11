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
  perspectiveMatrix = mat4.create();
  near = 0.1;
  far = 1000;
  fov = 60;

  camPos = vec3.fromValues(0, 25, 25);
  camFront = vec3.fromValues(0, 0, 0);
  camUp = vec3.fromValues(0, 1, 0);
  view = mat4.create();

  onCreate() {
    vec3.normalize(this.invertLightDir, this.invertLightDir);
    mat4.perspective(
      this.perspectiveMatrix,
      glMatrix.toRadian(this.fov),
      mainRenderer.canvas.width / mainRenderer.canvas.height,
      this.near,
      this.far,
    );
    mat4.lookAt(this.view, this.camPos, this.camFront, this.camUp);
  }

  editorTick() {
    this.render();
  }

  tick() {
    this.render();
  }

  render() {
    mainRenderer.begin();

    this.world.fromAll(Transform, RenderData).forEach(([transform, renderData]) => {
      const { mesh, shader } = renderData;
      const { uniforms } = shader;

      // const mvpMatrix = mat4.create();
      // mat4.mul(mvpMatrix, this.perspectiveMatrix, this.view);
      // mat4.mul(mvpMatrix, mvpMatrix, transform.modelMatrix);

      // uniforms.u_mvpMatrix.value = mvpMatrix;
      uniforms.u_modelMatrix.value = transform.modelMatrix;
      uniforms.u_viewMatrix.value = this.view;
      uniforms.u_projectionMatrix.value = this.perspectiveMatrix;
      // uniforms.u_modelInverseTransposeMatrix.value = transform.modelInverseTransposeMatrix;

      uniforms.u_reverseLightDirection.value = this.invertLightDir;

      mainRenderer.submit(mesh, shader);
    });

    mainRenderer.end();
  }
}
