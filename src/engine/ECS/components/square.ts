import { ComponentData } from "./component-data";
import { Vector2 } from "three";

export class Square extends ComponentData {
    public size: Vector2;

    constructor(size: Vector2) {
        super(Square);
        this.size = size;
    }
}