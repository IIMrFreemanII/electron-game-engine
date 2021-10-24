import { Component } from "../component";

export class Player extends Component {
  name = "player";
  health = 100;
  items = Array.from(Array(100).keys());
}
