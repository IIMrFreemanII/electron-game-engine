import { BufferElement, BufferLayout, IndexBuffer, VertexBuffer } from "./buffer";
import { ShaderDataType } from "./webgl-constants";
import { VertexArray } from "./vertex-array";
import { Renderer } from "./renderer";

export type VertexData = {
  a_position: number[];
  a_normal?: number[];
  a_texcoord?: number[];
};
export const VERTEX_NAMES_TO_SHADER_DATA_TYPE: Record<string, ShaderDataType> = {
  a_position: "vec3",
  a_normal: "vec3",
  a_texcoord: "vec2",
};

export class Mesh {
  gl: WebGL2RenderingContext;
  vertexData: VertexData;
  indices: number[] | null;
  vertexArray: VertexArray;
  count: number;
  drawMode: number;

  constructor(vertexData: VertexData, indices: number[] | null = null) {
    this.gl = Renderer.gl;
    this.vertexData = vertexData;
    this.indices = indices;
    this.count = indices ? indices.length : vertexData["a_position"].length / 3;
    this.drawMode = this.gl.TRIANGLES;

    const vertexBuffers = Object.entries(vertexData).map(([key, value]) => {
      return new VertexBuffer(
        value,
        new BufferLayout([new BufferElement(key, VERTEX_NAMES_TO_SHADER_DATA_TYPE[key])]),
      );
    });
    const indexBuffer = indices ? new IndexBuffer(indices) : null;

    this.vertexArray = new VertexArray(vertexBuffers, indexBuffer);
  }
}