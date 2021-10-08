import { Vector2 } from "three";
import { ComponentData } from "./component-data";

export class Transform extends ComponentData {
    public position: Vector2 = new Vector2(0, 0);

    constructor(position: Vector2) {
        super(Transform);
        this.position = position;
    }
}