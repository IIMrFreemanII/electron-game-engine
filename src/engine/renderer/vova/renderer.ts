import { getRandomRgb, createProgramFromSources, arrayOf } from "frontent/utils";
import vertShader from "assets/shaders/default.vert";
import fragShader from "assets/shaders/default.frag";
import { vec2 } from "gl-matrix";

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

  getSize(): vec2 {
    return vec2.fromValues(this.canvas.width, this.canvas.height);
  }

  start() {
    // create GLSL shaders, upload the GLSL source, compile the shaders
    // Link the two shaders into a program
    // Link attributes with location
    const attributes = ["a_position", "in_rgb"];
    const [positionLocation, rgbLocation] = [0, 1];

    const program = createProgramFromSources(this.gl, [vertShader, fragShader], attributes, [
      positionLocation,
      rgbLocation,
    ]);
    if (!program) return;

    // Create a vertex array object (attribute state)
    // and make it the one we're currently working with
    const vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(vao);

    // Create a buffer for the positions.
    const posBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBuffer);
    const posBufferData = new Float32Array(
      [
        [-0.5, 0.5, 0.5, 0.5, -0.5, -0.5],
        [0.5, 0.5, 0.5, -0.5, -0.5, -0.5],
        [-1, 1, 1, 1, -1, 0.5],
        [-1, 0.5, 1, 1, 1, 0.5],
        [-1, -0.5, 1, -0.5, -1, -1],
        [-1, -1, 1, -1, 1, -0.5],
      ].flat(),
    );

    this.gl.bufferData(this.gl.ARRAY_BUFFER, posBufferData, this.gl.STATIC_DRAW);

    // tell the position attribute how to pull data out of the current ARRAY_BUFFER
    this.gl.enableVertexAttribArray(positionLocation);
    const posSize = 2;
    const posType = this.gl.FLOAT;
    const posNormalize = false;
    const posStride = 0;
    const posOffset = 0;
    this.gl.vertexAttribPointer(
      positionLocation,
      posSize,
      posType,
      posNormalize,
      posStride,
      posOffset,
    );

    // Create a buffer for the colors.
    const rgbBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, rgbBuffer);

    const color = getRandomRgb(true);
    const rgbBufferData = new Float32Array(arrayOf(posBufferData.length / 2, () => color).flat());

    this.gl.bufferData(this.gl.ARRAY_BUFFER, rgbBufferData, this.gl.STATIC_DRAW);

    // tell the position attribute how to pull data out of the current ARRAY_BUFFER
    this.gl.enableVertexAttribArray(rgbLocation);
    const rgbSize = 3;
    const rgbType = this.gl.FLOAT;
    const rgbNormalize = false;
    const rgbStride = 3 * 4;
    const rgbOffset = 0;
    this.gl.vertexAttribPointer(rgbLocation, rgbSize, rgbType, rgbNormalize, rgbStride, rgbOffset);

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
      const count = posBufferData.length / posSize;
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
