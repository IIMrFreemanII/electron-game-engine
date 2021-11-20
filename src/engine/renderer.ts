import { Vector2 } from "three";

import { getRandomRgb } from "frontent/utils";
import vertShader from "assets/shaders/default.vert";
import fragShader from "assets/shaders/default.frag";

function createShader(gl, type, source): WebGLShader | undefined {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return undefined;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return undefined;
}

export class Renderer {
  canvas = document.createElement("canvas");
  gl: WebGL2RenderingContext;

  constructor() {
    const context = this.canvas.getContext("webgl2");
    if (!context) {
      throw new Error("webgl2 not available");
    }

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
    const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertShader);
    const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragShader);

    // Link the two shaders into a program
    const program = createProgram(this.gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    const positionAttributeLocation = this.gl.getAttribLocation(program, "a_position");
    const rgbAttributeLocation = this.gl.getAttribLocation(program, "in_rgb");

    // Create a buffer and put three 2d clip space points in it
    const positionBuffer = this.gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

    const buffer = new Float32Array(
      [
        [-0.5, -0.5, getRandomRgb(true)],
        [0, 0.5, getRandomRgb(true)],
        [0.5, -0.5, getRandomRgb(true)],
      ].flat(2),
    );
    this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer, this.gl.STATIC_DRAW);

    // Create a vertex array object (attribute state)
    const vao = this.gl.createVertexArray();

    // and make it the one we're currently working with
    this.gl.bindVertexArray(vao);

    // Turn on the position attribute
    this.gl.enableVertexAttribArray(positionAttributeLocation);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2; // 2 components per iteration
    const type = this.gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 5 * 4; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    this.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // Turn on the rgb attribute
    this.gl.enableVertexAttribArray(rgbAttributeLocation);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const rgbSize = 3; // 3 components per iteration
    const rgbType = this.gl.FLOAT; // the data is 32bit floats
    const rgbNormalize = false; // don't normalize the data
    const rgbStride = 5 * 4; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const rgbOffset = 2 * 4; // start at the beginning of the buffer
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
      this.clearWebglCanvas();

      // Tell it to use our program (pair of shaders)
      this.gl.useProgram(program);

      // Bind the attribute/buffer set we want.
      this.gl.bindVertexArray(vao);

      // draw
      const primitiveType = this.gl.TRIANGLES;
      const offset = 0;
      const count = 3;
      this.gl.drawArrays(primitiveType, offset, count);

      // requestAnimationFrame(animate);
    };

    animate();
  }

  private clearWebglCanvas() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
