import { Vector2 } from "three";
import { Component } from "../component";

export class Translation extends Component {
  value = new Vector2(0, 0);
  age = 0;
}
