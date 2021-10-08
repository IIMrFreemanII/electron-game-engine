import { ISystem } from "./ISystem";
import { EntityManager } from "../EntityManager";
import { Transform } from "../components/transform";
import { Square } from "../components/square";
import { Renderer } from "../../renderer";

export class RenderSquareSystem implements ISystem {
    public name: string;
    constructor() {
        this.name = RenderSquareSystem.name;
    }

    onUpdate() {
        const entities = EntityManager.getAll();
        entities.forEach((entity) => {
            const transform = entity.getComponent(Transform.name);
            const square = entity.getComponent(Square.name);

            if (transform && square) {
                const { position } = transform;
                const { size } = square;

                Renderer.drawSquare(position, size);
            }
        });
    }
}