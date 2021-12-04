import {
  createProgramFromSources,
  loadImage,
  calcAspectRatio,
  setWebglRect,
  CoreMath,
  CoreVector2,
  round,
} from "frontent/utils";
import testImage from "./assets/5c5f6f99-fee4-46ff-ace1-c81cda4bfc59-mask.png";
import vertShader from "./assets/default.vert";
import fragShader from "./assets/default.frag";

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

        // Multiply the matrices.
        let matrix = m3.projection(...this.viewport.toArray());
        matrix = m3.translate(matrix, 0, 0);
        matrix = m3.rotate(matrix, 0);
        matrix = m3.scale(matrix, 1, 1);

        console.log(`result`);
        m3.logMatrix(matrix);

        this.gl.uniformMatrix3fv(matrixLocation, false, matrix);

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

const m3 = {
  projection: function (width, height) {
    // Note: This matrix flips the Y axis so that 0 is at the top.
    return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
  },
  translation: function translation(tx, ty) {
    return [1, 0, 0, 0, 1, 0, tx, ty, 1];
  },
  rotation: function rotation(angle) {
    const c = new CoreMath(angle).toRadians().cos().value;
    const s = new CoreMath(angle).toRadians().sin().value;
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  },
  scaling: function scaling(sx, sy) {
    return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
  },
  multiply: function multiply(a, b) {
    const a00 = a[0 * 3 + 0];
    const a01 = a[0 * 3 + 1];
    const a02 = a[0 * 3 + 2];
    const a10 = a[1 * 3 + 0];
    const a11 = a[1 * 3 + 1];
    const a12 = a[1 * 3 + 2];
    const a20 = a[2 * 3 + 0];
    const a21 = a[2 * 3 + 1];
    const a22 = a[2 * 3 + 2];
    const b00 = b[0 * 3 + 0];
    const b01 = b[0 * 3 + 1];
    const b02 = b[0 * 3 + 2];
    const b10 = b[1 * 3 + 0];
    const b11 = b[1 * 3 + 1];
    const b12 = b[1 * 3 + 2];
    const b20 = b[2 * 3 + 0];
    const b21 = b[2 * 3 + 1];
    const b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },
  translate: function (m, tx, ty) {
    return m3.multiply(m, m3.translation(tx, ty));
  },
  rotate: function (m, angleInRadians) {
    return m3.multiply(m, m3.rotation(angleInRadians));
  },
  scale: function (m, sx, sy) {
    return m3.multiply(m, m3.scaling(sx, sy));
  },
  logMatrix: (matrix: number[]) => {
    matrix = matrix.map((v) => round(v, 2));

    const row0 = matrix.slice(0, 3).join(", ");
    const row1 = matrix.slice(3, 6).join(", ");
    const row2 = matrix.slice(6, 9).join(", ");

    console.log([row0, row1, row2].join(",\n"));
  },
};
