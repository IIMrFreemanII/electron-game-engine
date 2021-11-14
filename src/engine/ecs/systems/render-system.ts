import { System } from "../system";
import { Renderer } from "../../renderer";
import {
  AmbientLight,
  AxesHelper,
  Color,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
} from "three";
import { Camera } from "../components/camera";
import { Translation } from "../components";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class RenderSystem extends System {
  init() {
    const cameraEnt = this.world.createEntity();
    cameraEnt.addComponent(Camera);
    cameraEnt.addComponent(Translation).value.set(0, 2, 10);

    this.world.fromAll(Camera, Translation).forEach(([camera, translation]) => {
      const cam = new PerspectiveCamera(camera.fow, camera.aspect, camera.near, camera.far);
      cam.position.copy(translation.value);
      cam.updateProjectionMatrix();

      this.world.camera = cam;
      this.world.controls = new OrbitControls(cam, Renderer.canvas);
    });

    const { scene, camera, controls } = this.world;
    //=============================================
    scene.background = new Color(0x272727);
    //=============================================

    //=============================================
    controls.addEventListener("change", () => {
      Renderer.render(scene, camera);
    });
    // this.transformControls.addEventListener("objectChange", (event) => {
    //   console.log(event);
    // });
    //=============================================

    //=Lights=======================================
    const ambient = new AmbientLight(0x404040);
    scene.add(ambient);

    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);
    //=============================================

    //=============================================
    scene.add(new AxesHelper(3));
    //=============================================

    //=============================================
    const size = 10;
    const divisions = 10;
    const gridHelper = new GridHelper(size, divisions);
    scene.add(gridHelper);
    //=============================================
  }

  start() {
    this.init();
  }

  tick() {
    Renderer.render(this.world.scene, this.world.camera);
  }
}
