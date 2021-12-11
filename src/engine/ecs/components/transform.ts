import { Component } from "../component";
import { mat4, vec3, quat } from "gl-matrix";

export class Transform extends Component {
  position = vec3.create();
  rotation = vec3.create();
  scale = vec3.fromValues(1, 1, 1);
  quaternion = quat.create();

  modelMatrix = mat4.create();
  // modelInverseTransposeMatrix = mat4.create();

  constructor() {
    super();

    this.updateModelMatrix();
  }

  updateModelMatrix() {
    // model
    quat.fromEuler(this.quaternion, this.rotation[0], this.rotation[1], this.rotation[2]);
    this.modelMatrix = mat4.fromRotationTranslationScale(
      this.modelMatrix,
      this.quaternion,
      this.position,
      this.scale,
    );
    // model inverse transpose
    // this.modelInverseTransposeMatrix = mat4.create();
    // mat4.invert(this.modelInverseTransposeMatrix, this.modelMatrix);
    // mat4.transpose(this.modelInverseTransposeMatrix, this.modelInverseTransposeMatrix);
  }
}
