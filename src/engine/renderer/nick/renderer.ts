import { glMatrix, mat4, vec2, vec3 } from "gl-matrix";
import { normals, positions } from "./cube-data";
import { Shader } from "./shader";

import vertShader from "assets/shaders/default.vert";
import fragShader from "assets/shaders/default.frag";
import { Mesh } from "./mesh";
import { UniformBuffer } from "./buffer";

const fromFlatTo2D = (matrix4: number[]) => {
  const arr: number[][] = [];
  arr[0] = matrix4.slice(0, 4);
  arr[1] = matrix4.slice(4, 8);
  arr[2] = matrix4.slice(8, 12);
  arr[3] = matrix4.slice(12, 16);

  return arr;
};

export type UniformBufferObjects = Record<string, UniformBuffer>;

export class Renderer {
  static canvas = document.createElement("canvas");
  static gl = this.canvas.getContext("webgl2") as WebGL2RenderingContext;
  static ubos: UniformBufferObjects;

  static setSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  static getSize(): vec2 {
    return vec2.fromValues(this.canvas.width, this.canvas.height);
  }

  static submit(mesh: Mesh, shader: Shader) {
    mesh.vertexArray.bind();
    shader.bind();
    shader.setUniforms();

    this.drawArrays(mesh);
  }

  static begin(perspective: mat4, view: mat4) {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    // Clear the canvas
    this.clear();
    // turn on depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    // tell webgl to cull faces
    this.gl.enable(this.gl.CULL_FACE);
  }

  static end() {}

  static start() {
    // create GLSL shaders, upload the GLSL source, compile the shaders
    const shader = new Shader("default", vertShader, fragShader);
    // look up where the vertex data needs to go.
    // const positionAttributeLocation = shader.getAttribLocation("a_position");
    // const normalAttributeLocation = shader.getAttribLocation("a_normal");

    const mesh = new Mesh({ a_position: positions, a_normal: normals });

    const animate = (time: number) => {
      time *= 0.001;
      // Clear the canvas
      this.clear();
      // turn on depth testing
      this.gl.enable(this.gl.DEPTH_TEST);
      // tell webgl to cull faces
      this.gl.enable(this.gl.CULL_FACE);

      const near = 0.1;
      const far = 1000;

      // const rotation = glMatrix.toRadian(30 * time);
      const model = mat4.create();
      // mat4.rotateY(model, model, rotation);

      const modelInverseTranspose = mat4.create();
      mat4.invert(modelInverseTranspose, model);
      mat4.transpose(modelInverseTranspose, modelInverseTranspose);

      const view = mat4.create();
      const camPos = vec3.fromValues(3, 3, 3);
      const camFront = vec3.fromValues(0, 0, 0);
      const camUp = vec3.fromValues(0, 1, 0);
      mat4.lookAt(view, camPos, camFront, camUp);

      const perspective = mat4.create();
      mat4.perspective(
        perspective,
        glMatrix.toRadian(60),
        this.canvas.width / this.canvas.height,
        near,
        far,
      );

      const invertLightDir = vec3.fromValues(0.5, 0.7, 1);
      vec3.normalize(invertLightDir, invertLightDir);

      mesh.vertexArray.bind();

      shader.bind();
      shader.uniforms.u_modelMatrix.value = model;
      shader.uniforms.u_viewMatrix.value = view;
      shader.uniforms.u_projectionMatrix.value = perspective;
      shader.uniforms.u_modelInverseTransposeMatrix.value = modelInverseTranspose;
      shader.uniforms.u_color.value = [0.2, 1, 0.2, 1];
      shader.uniforms.u_reverseLightDirection.value = invertLightDir;
      shader.setUniforms();

      this.drawArrays(mesh);
      // requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  static drawArrays(mesh: Mesh) {
    this.gl.drawArrays(mesh.drawMode, 0, mesh.count);
  }

  private static clear() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
