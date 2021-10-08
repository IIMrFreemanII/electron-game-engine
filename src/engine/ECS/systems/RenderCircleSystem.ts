import { ISystem } from "./ISystem";
import { EntityManager } from "../EntityManager";
import { Transform } from "../components/transform";
import { Circle } from "../components/circle";
import { Renderer } from "../../renderer";

export class RenderCircleSystem implements ISystem {
    public name: string;
    constructor() {
        this.name = RenderCircleSystem.name;
    }

    onUpdate() {
        const entities = EntityManager.getAll();
        entities.forEach((entity) => {
            const transform = entity.getComponent(Transform.name);
            const circle = entity.getComponent(Circle.name);

            if (transform && circle) {
                const { position } = transform;
                const { radius } = circle;

                Renderer.drawCircle(position, radius)
            }
        });
    }
}