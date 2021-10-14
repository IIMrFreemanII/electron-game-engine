import { Component } from "./component";

export class Circle extends Component {
  radius: number;

  constructor(radius: number) {
    super();
    this.radius = radius;
  }
}
