import { Vector2 } from "three";
import { glMatrix, mat4, vec3 } from "gl-matrix";
import { normals, positions } from "./cube-data";
import { Shader } from "./shader";

import vertShader from "assets/shaders/default.vert";
import fragShader from "assets/shaders/default.frag";
import { Mesh } from "./mesh";

glMatrix.setMatrixArrayType(Array);

const fromFlatTo2D = (matrix4: number[]) => {
  const arr: number[][] = [];
  arr[0] = matrix4.slice(0, 4);
  arr[1] = matrix4.slice(4, 8);
  arr[2] = matrix4.slice(8, 12);
  arr[3] = matrix4.slice(12, 16);

  return arr;
};

export class Renderer {
  canvas = document.createElement("canvas");
  gl: WebGL2RenderingContext;

  constructor() {
    const context = this.canvas.getContext("webgl2");
    if (!context) throw new Error("webgl2 not available");
    this.gl = context;
  }

  setSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  getSize(): Vector2 {
    return new Vector2(this.canvas.width, this.canvas.height);
  }

  submit(mesh, shader, modelMatrix, camera) {}

  start() {
    // create GLSL shaders, upload the GLSL source, compile the shaders
    const shader = new Shader(this.gl, "default", vertShader, fragShader);

    // look up where the vertex data needs to go.
    // const positionAttributeLocation = shader.getAttribLocation("a_position");
    // const normalAttributeLocation = shader.getAttribLocation("a_normal");
    // look up uniform locations
    const mvpMatrixLocation = shader.getUniformLocation("u_MVPMatrix");
    const modelInverseTransposeMatrixLocation = shader.getUniformLocation(
      "u_ModelInverseTransposeMatrix",
    );
    const colorLocation = shader.getUniformLocation("u_color");
    const reverseLightDirectionLocation = shader.getUniformLocation("u_reverseLightDirection");

    const mesh = new Mesh(this.gl, { a_position: positions, a_normal: normals });

    const animate = (time: number) => {
      time *= 0.001;
      // Clear the canvas
      this.clear();
      // turn on depth testing
      this.gl.enable(this.gl.DEPTH_TEST);
      // tell webgl to cull faces
      this.gl.enable(this.gl.CULL_FACE);

      shader.bind();

      // Bind the attribute/buffer set we want.
      // this.gl.bindVertexArray(vao);
      mesh.vertexArray.bind();

      const near = 0.1;
      const far = 1000;

      const rotation = glMatrix.toRadian(30 * time);
      const model = mat4.create();
      mat4.rotateY(model, model, rotation);

      const modelInverseTranspose = mat4.create();
      mat4.invert(modelInverseTranspose, model);
      mat4.transpose(modelInverseTranspose, modelInverseTranspose);

      const view = mat4.create();
      const camPos = vec3.fromValues(3, 3, 3);
      const camFront = vec3.fromValues(0, 0, 0);
      const camUp = vec3.fromValues(0, 1, 0);
      mat4.lookAt(view, camPos, camFront, camUp);

      const mvpMatrix = mat4.create();
      mat4.perspective(
        mvpMatrix,
        glMatrix.toRadian(60),
        this.canvas.width / this.canvas.height,
        near,
        far,
      );
      mat4.multiply(mvpMatrix, mvpMatrix, view);
      mat4.multiply(mvpMatrix, mvpMatrix, model);

      this.gl.uniformMatrix4fv(mvpMatrixLocation, false, mvpMatrix);
      this.gl.uniformMatrix4fv(modelInverseTransposeMatrixLocation, false, modelInverseTranspose);

      // Set the color to use
      this.gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]); // green

      const invertLightDir = vec3.fromValues(0.5, 0.7, 1);
      vec3.normalize(invertLightDir, invertLightDir);

      // set the light direction.
      this.gl.uniform3fv(reverseLightDirectionLocation, invertLightDir);

      // draw
      this.gl.drawArrays(mesh.drawMode, 0, mesh.count);

      // requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  private clear() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
