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

export class UniformBufferElement {
  name: string;
  type: ShaderDataType;
  size: number;
  offset: number;

  constructor(name: string, type: ShaderDataType) {
    this.name = name;
    this.type = type;
    this.size = SHADER_DATA_TYPE_SIZE[type];
    this.offset = 0;
  }
}

export class UniformBufferLayout {
  elements: UniformBufferElement[];
  size = 0;

  constructor(elements: UniformBufferElement[]) {
    this.elements = elements;

    this.calcOffsetAndStride();
  }

  getElement(name: string) {
    return this.elements.find((elem) => elem.name === name);
  }

  private calcOffsetAndStride() {
    let offset = 0;

    this.elements.forEach((elem) => {
      elem.offset = offset;
      const padding = this.getPaddingForType(elem.type);
      offset += elem.size + padding;
      this.size += elem.size + padding;
    });
  }

  private getPaddingForType(type: ShaderDataType) {
    switch (type) {
      case "float":
        return 0;
      case "vec2":
        return 0;
      case "vec3":
        return 4;
      case "vec4":
        return 0;
      case "mat3":
        return 0;
      case "mat4":
        return 0;
      case "int":
        return 0;
      case "ivec2":
        return 0;
      case "ivec3":
        return 4;
      case "ivec4":
        return 0;
      case "bool":
        return 0;
    }
  }
}

export class UniformBuffer {
  gl: WebGL2RenderingContext;
  buffer: WebGLBuffer;
  layout: UniformBufferLayout;
  target = 0;

  constructor(gl: WebGL2RenderingContext, layout: UniformBufferLayout, target: number) {
    this.gl = gl;
    this.layout = layout;
    this.target = target;

    this.buffer = this.gl.createBuffer() as WebGLBuffer;
    this.bind();
    this.gl.bufferData(this.gl.UNIFORM_BUFFER, this.layout.size, gl.STATIC_DRAW);
    this.unbind();

    this.gl.bindBufferBase(this.gl.UNIFORM_BUFFER, this.target, this.buffer);
  }

  set(name: string, value: any) {
    this.bind();

    const offset = this.layout.getElement(name)?.offset || 0;
    this.gl.bufferSubData(this.gl.UNIFORM_BUFFER, offset, value);

    this.unbind();
  }

  bind() {
    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer);
  }

  unbind() {
    this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
  }
}
