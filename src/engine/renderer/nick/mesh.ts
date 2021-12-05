import { BufferElement, BufferLayout, IndexBuffer, VertexBuffer } from "./buffer";
import { ShaderDataType } from "./webgl-constants";
import { VertexArray } from "./vertex-array";

export type VertexData = {
  a_position: number[];
  a_normal?: number[];
  a_texcoord?: number[];
};
export const VERTEX_NAMES_TO_SHADER_DATA_TYPE: Record<string, ShaderDataType> = {
  a_position: "float3",
  a_normal: "float3",
  a_texcoord: "float2",
};

export class Mesh {
  gl: WebGL2RenderingContext;
  vertexData: VertexData;
  indices: number[] | null;
  vertexArray: VertexArray;
  count: number;
  drawMode: number;

  constructor(gl: WebGL2RenderingContext, vertexData: VertexData, indices: number[] | null = null) {
    this.gl = gl;
    this.vertexData = vertexData;
    this.indices = indices;
    this.count = vertexData["a_position"].length / 3;
    this.drawMode = gl.TRIANGLES;

    const vertexBuffers = Object.entries(vertexData).map(([key, value]) => {
      return new VertexBuffer(
        gl,
        value,
        new BufferLayout([new BufferElement(key, VERTEX_NAMES_TO_SHADER_DATA_TYPE[key])]),
      );
    });
    const indexBuffer = indices ? new IndexBuffer(gl, indices) : null;

    this.vertexArray = new VertexArray(gl, vertexBuffers, indexBuffer);
  }
}
