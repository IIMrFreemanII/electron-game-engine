import {
  createProgramFromSources,
  loadImage,
  calcAspectRatio,
  setWebglRect,
  CoreVector2,
  CoreMatrix3,
  toRadians,
} from "frontent/utils";
import vertShader from "./assets/default.vert";
import fragShader from "./assets/default.frag";

import testImage from "./assets/5c5f6f99-fee4-46ff-ace1-c81cda4bfc59-mask.png";

export class Renderer {
  public canvas = document.createElement("canvas");
  public gl: WebGL2RenderingContext;

  private viewport = new CoreVector2(0, 0);

  constructor() {
    this.viewport.set(this.canvas.width, this.canvas.height);

    const context = this.canvas.getContext("webgl2");
    if (!context) throw new Error("webgl2 not available");
    this.gl = context;
  }

  public setSize(width: number, height: number) {
    this.viewport.set(width, height);
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  public getSize(): CoreVector2 {
    return this.viewport;
  }

  public start() {
    loadImage(testImage).then((image) => {
      // create GLSL shaders, upload the GLSL source, compile the shaders
      // Link the two shaders into a program
      // Link attributes with location
      const attributes = ["a_position", "a_texCoord"];
      const [positionLocation, textureLocation] = [0, 1];

      const program = createProgramFromSources(this.gl, [vertShader, fragShader], attributes, [
        positionLocation,
        textureLocation,
      ]);
      if (!program) return;

      // lookup uniforms
      const matrixLocation = this.gl.getUniformLocation(program, "u_matrix");
      const imageLocation = this.gl.getUniformLocation(program, "u_image");

      // Create a vertex array object (attribute state)
      // and make it the one we're currently working with
      const vao = this.gl.createVertexArray();
      this.gl.bindVertexArray(vao);

      const [dWidth, dHeight] = calcAspectRatio(
        ...this.viewport.toArray(),
        image.width,
        image.height,
      );

      const posBufferDataLength = setWebglRect(this.gl, positionLocation, dWidth, dHeight);

      // Create a buffer for the texture.
      const textureBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureBuffer);
      const textureBufferData = new Float32Array(
        [
          [0, 0, 1, 0, 0, 1],
          [0, 1, 1, 0, 1, 1],
        ].flat(),
      );
      this.gl.bufferData(this.gl.ARRAY_BUFFER, textureBufferData, this.gl.STATIC_DRAW);

      // tell the texture attribute how to pull data out of the current ARRAY_BUFFER
      this.gl.enableVertexAttribArray(textureLocation);
      this.gl.vertexAttribPointer(textureLocation, 2, this.gl.FLOAT, false, 0, 0);

      const texture = this.gl.createTexture();

      // make unit 0 the active texture uint
      // (ie, the unit all other texture commands will affect
      this.gl.activeTexture(this.gl.TEXTURE0 + 0);

      // Bind it to texture unit 0' 2D bind point
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

      // Set the parameters so we don't need mips and so we're not filtering
      // and we don't repeat at the edges
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

      const mipLevel = 0; // the largest mip
      const internalFormat = this.gl.RGBA; // format we want in the texture
      const srcFormat = this.gl.RGBA; // format of data we are supplying
      const srcType = this.gl.UNSIGNED_BYTE; // type of data we are supplying
      this.gl.texImage2D(this.gl.TEXTURE_2D, mipLevel, internalFormat, srcFormat, srcType, image);

      const animate = () => {
        // Clear the canvas
        this._clearWebglCanvas();

        // Tell it to use our program (pair of shaders)
        this.gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        this.gl.bindVertexArray(vao);

        const matrix = CoreMatrix3.projection(...this.viewport.toArray())
          .translate(15, 15)
          .rotate(toRadians(15))
          .scale(1.5, 1.5);

        this.gl.uniformMatrix3fv(matrixLocation, false, matrix.mat);

        // Tell the shader to get the texture from texture unit 0
        this.gl.uniform1i(imageLocation, 0);

        // draw
        this.gl.drawArrays(this.gl.TRIANGLES, 0, posBufferDataLength / 2);

        // requestAnimationFrame(animate);
      };

      animate();
    });
  }

  private _clearWebglCanvas() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
