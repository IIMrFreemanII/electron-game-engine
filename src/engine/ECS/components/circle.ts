import { ComponentData } from "./component-data";

export class Circle extends ComponentData {
    radius: number;

    constructor(radius: number) {
        super(Circle);
        this.radius = radius;
    }
}
