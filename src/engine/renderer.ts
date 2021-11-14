import { Camera, Object3D, Vector2, WebGLRenderer } from "three";
import { WorldsManager } from "./ecs";

export class Renderer {
  public static threeRenderer = new WebGLRenderer();
  public static canvas = this.threeRenderer.domElement;

  public static setSize(width: number, height: number) {
    this.threeRenderer.setSize(width, height);
    const { camera, scene } = WorldsManager.defaultWorld;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    this.render(scene, camera);
  }

  public static getSize(): Vector2 {
    return new Vector2(this.canvas.width, this.canvas.height);
  }

  public static render(scene: Object3D, camera: Camera) {
    this.threeRenderer.render(scene, camera);
  }
}
