import { Entity } from "./entity";
import { System } from "./system";
import { Component } from "./component";
import { Constructor, Constructors } from "../types";
import { PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class World {
  // three-js scene
  // todo: needs better solution
  public scene = new Scene();
  public camera: PerspectiveCamera;
  public controls: OrbitControls;
  // public transformControls = new TransformControls(this.camera, Renderer.canvas);
  //==============================

  public entities: Entity[] = [];
  public systems: System[] = [];

  createEntity(): Entity {
    const entity = new Entity(this);
    this.entities.push(entity);
    return entity;
  }

  removeEntity(entity: Entity) {
    entity.clearComponents();
    this.entities = this.entities.filter((ent) => ent !== entity);
  }

  addSystem<T extends System>(type: Constructor<T>) {
    const system = new type();
    system.world = this;

    this.systems.push(system);
  }

  fromAllCache: Map<string, Component[][]> = new Map<string, Component[][]>();

  clearCache() {
    this.fromAllCache.clear();
  }

  fromAll<T extends Component[]>(...types: Constructors<T>): [[...T]] {
    const typesSignature = JSON.stringify(types.map((type) => type.name));
    const cached = this.fromAllCache.get(typesSignature);

    if (cached) {
      return cached as any;
    }

    const result: Component[][] = [];
    this.entities.forEach((entity) => {
      const components = entity.getComponents(...types);
      if (!components) return;
      result.push(components);
    });

    this.fromAllCache.set(typesSignature, result);
    return result as any;
  }

  tick() {
    this.systems.forEach((system) => system.tick());
  }

  editorTick() {
    this.systems.forEach((system) => system.editorTick());
  }

  onCreate() {
    this.systems.forEach((system) => system.onCreate());
  }

  onDestroy() {
    this.systems.forEach((system) => system.onDestroy());
  }
}
