import { Vector2 } from "three";

export class Transform {
  position = new Vector2(0, 0);

  constructor(position: Vector2) {
    this.position = position;
  }
}
