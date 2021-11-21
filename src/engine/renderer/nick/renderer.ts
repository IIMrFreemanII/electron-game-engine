import { Vector2 } from "three";

import { Shader } from "./shader";
import { getRandomRgb } from "frontent/utils";

import vertShader from "assets/shaders/default.vert";
import fragShader from "assets/shaders/default.frag";

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

  start() {
    // create GLSL shaders, upload the GLSL source, compile the shaders
    const shader = new Shader(this.gl, "default", vertShader, fragShader);

    // look up where the vertex data needs to go.
    const positionAttributeLocation = shader.getAttribLocation("a_position");
    const rgbAttributeLocation = shader.getAttribLocation("in_rgb");

    // Create a vertex array object (attribute state)
    // and make it the one we're currently working with
    const vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(vao);

    // Create a buffer for the positions.
    const posBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);
    const posBufferData = new Float32Array(
      [
        [
          [-0.5, 0.5],
          [0.5, 0.5],
          [-0.5, -0.5],
        ],
        [
          [0.5, 0.5],
          [0.5, -0.5],
          [-0.5, -0.5],
        ],
      ].flat(2),
    );

    this.gl.bufferData(this.gl.ARRAY_BUFFER, posBufferData, this.gl.STATIC_DRAW);

    // tell the position attribute how to pull data out of the current ARRAY_BUFFER
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    const posSize = 2;
    const posType = this.gl.FLOAT;
    const posNormalize = false;
    const posStride = 0;
    const posOffset = 0;
    this.gl.vertexAttribPointer(
      positionAttributeLocation,
      posSize,
      posType,
      posNormalize,
      posStride,
      posOffset,
    );

    // Create a buffer for the colors.
    const rgbBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, rgbBuffer);

    const rgbBufferData = new Float32Array(
      [
        [getRandomRgb(true), getRandomRgb(true), getRandomRgb(true)],
        [getRandomRgb(true), getRandomRgb(true), getRandomRgb(true)],
      ].flat(2),
    );

    this.gl.bufferData(this.gl.ARRAY_BUFFER, rgbBufferData, this.gl.STATIC_DRAW);

    // tell the position attribute how to pull data out of the current ARRAY_BUFFER
    this.gl.enableVertexAttribArray(rgbAttributeLocation);
    const rgbSize = 3;
    const rgbType = this.gl.FLOAT;
    const rgbNormalize = false;
    const rgbStride = 0;
    const rgbOffset = 0;
    this.gl.vertexAttribPointer(
      rgbAttributeLocation,
      rgbSize,
      rgbType,
      rgbNormalize,
      rgbStride,
      rgbOffset,
    );

    const animate = () => {
      // Clear the canvas
      this.clear();

      shader.bind();

      // Bind the attribute/buffer set we want.
      this.gl.bindVertexArray(vao);

      // draw
      const primitiveType = this.gl.TRIANGLES;
      const offset = 0;
      const count = posBufferData.length / posSize;
      this.gl.drawArrays(primitiveType, offset, count);

      // requestAnimationFrame(animate);
    };

    animate();
  }

  private clear() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
