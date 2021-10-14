import { Vector2 } from "three";
import { Component } from "./component";

export class Transform extends Component {
  position: Vector2;

  constructor(position: Vector2 = new Vector2(0, 0)) {
    super();
    this.position = position;
  }
}
