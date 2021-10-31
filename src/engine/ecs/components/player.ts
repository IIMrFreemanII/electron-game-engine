import { Component } from "../component";
import { Vector3, Vector4 } from "three";

export class Player extends Component {
  name = "player";
  health = 100;
  mesh = {};
  mesh1 = null;
  mesh2 = undefined;

  nums = [1, 2, 3, 4, 5];
  strings = ["item1", "item2", "item3", "1", "23", "4"];
  objects = [{}, null];

  position = new Vector3();
  quaternion = new Vector4();
}
