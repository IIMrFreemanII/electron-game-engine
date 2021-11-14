import { Vector3 } from "three";
import { Component } from "../component";

export class Transform extends Component {
  position = new Vector3();
  rotation = new Vector3(0, 0, 0);
  scale = new Vector3(1, 1, 1);
}
