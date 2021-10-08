import {Entity} from "./Entity";

export class EntityManager {
    private static entities: Entity[] = [];

    public static getAll(): Entity[] {
        return EntityManager.entities;
    }

    public static add(entity: Entity): void {
        EntityManager.entities.push(entity);
    }

    public static create(): Entity {
        const entity = new Entity();
        this.add(entity);

        return entity;
    }
}