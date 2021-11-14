import { BoxGeometry, BufferGeometry, Material, MeshStandardMaterial } from "three";
import { Component } from "../component";

export class RenderData extends Component {
  material: Material = new MeshStandardMaterial({ color: 0xffffff });
  geometry: BufferGeometry = new BoxGeometry();
}
