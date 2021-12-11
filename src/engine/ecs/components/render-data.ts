import { Component } from "../component";
import { Mesh } from "../../renderer/nick/mesh";
import { Shader } from "../../renderer/nick";

export class RenderData extends Component {
  shader: Shader;
  mesh: Mesh;
}
