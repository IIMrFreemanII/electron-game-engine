import { Component } from "../component";
import { Vector3, Vector4 } from "three";

export class Player extends Component {
  name = "player";
  health = 100;
  items = ["item1", "item2", "item3"];
  position = new Vector3();
  quaternion = new Vector4();
}
