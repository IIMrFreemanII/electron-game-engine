import { SHADER_DATA_TYPE_SIZE, ShaderDataType } from "./webgl-constants";

export class BufferElement {
  name: string;
  type: ShaderDataType;
  size: number;
  offset: number;
  normalized: boolean;

  constructor(name: string, type: ShaderDataType, normalized = false) {
    this.name = name;
    this.type = type;
    this.size = SHADER_DATA_TYPE_SIZE[type];
    this.offset = 0;
    this.normalized = normalized;
  }
}

export class BufferLayout {
  elements: BufferElement[];
  stride = 0;

  constructor(elements: BufferElement[]) {
    this.elements = elements;

    this.calcOffsetAndStride();
  }

  private calcOffsetAndStride() {
    let offset = 0;

    this.elements.forEach((elem) => {
      elem.offset = offset;
      offset += elem.size;
      this.stride += elem.size;
    });
  }
}

export class VertexBuffer {
  gl: WebGL2RenderingContext;
  buffer: WebGLBuffer;
  layout: BufferLayout;

  constructor(
    gl: WebGL2RenderingContext,
    array: number[],
    layout: BufferLayout,
    drawType: number | null = null,
  ) {
    this.gl = gl;
    this.buffer = gl.createBuffer() as WebGLBuffer;
    this.layout = layout;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), drawType ? drawType : gl.STATIC_DRAW);
  }

  bind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
  }

  unbind() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}

export class IndexBuffer {
  gl: WebGL2RenderingContext;
  buffer: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext, array: number[]) {
    this.gl = gl;
    this.buffer = gl.createBuffer() as WebGLBuffer;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(array), gl.STATIC_DRAW);
  }

  bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
  }

  unbind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  }
}
