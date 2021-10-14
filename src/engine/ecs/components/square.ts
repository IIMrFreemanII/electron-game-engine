import { Vector2 } from "three";
import { Component } from "./component";

export class Square extends Component {
  public size: Vector2;

  constructor(size: Vector2) {
    super();
    this.size = size;
  }
}
