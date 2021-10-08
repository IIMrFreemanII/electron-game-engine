import { ComponentData } from "./components/component-data";

export class Entity {
    private static counter = 1;

    public id: number;
    private components: any[] = [];

    constructor() {
        this.id = Entity.counter;
        Entity.counter++;
    }

    public addComponent(component: ComponentData) {
        this.components.push(component);
    }

    public addComponents(components: ComponentData[]) {
        this.components.push(...components);
    }

    public getComponent(type: string) {
        return this.components.find((component) => component.name === type);
    }
}