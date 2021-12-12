import { toRadians, toDegrees } from "frontent/utils";

export class CoreMath {
  private _value: number;

  public get value() {
    return this._value;
  }
  public set value(value: number) {
    this._value = value;
  }

  constructor(value: number) {
    this._value = value;
  }

  public clone() {
    return new CoreMath(this.value);
  }

  // Trigonometry ↓
  public toRadians() {
    this.value = toRadians(this.value);
    return this;
  }

  public toDegrees() {
    this.value = toDegrees(this.value);
    return this;
  }

  public sin() {
    this.value = Math.sin(this.value);
    return this;
  }

  public cos() {
    this.value = Math.cos(this.value);
    return this;
  }

  // Trigonometry ↑
}

export default CoreMath;
