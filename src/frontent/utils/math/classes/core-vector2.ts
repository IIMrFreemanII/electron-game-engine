import { CoreMath } from "./core-math";

export class CoreVector2 {
  private _x: CoreMath;
  private _width: CoreMath;

  private _y: CoreMath;
  private _height: CoreMath;

  public get x(): number {
    return this._x.value;
  }

  public set x(value: number) {
    this.setX(value);
  }

  public get width(): number {
    return this._width.value;
  }

  public set width(value: number) {
    this.setX(value);
  }

  public get y(): number {
    return this._y.value;
  }

  public set y(value: number) {
    this.setY(value);
  }

  public get height(): number {
    return this._height.value;
  }

  public set height(value: number) {
    this.setY(value);
  }

  constructor(x: number, y: number) {
    this.set(x, y);
  }

  public clone() {
    return new CoreVector2(this.x, this.y);
  }

  public setX(x: number) {
    const value = new CoreMath(x);

    this._x = value;
    this._width = value;

    return this;
  }

  public setY(y: number) {
    const value = new CoreMath(y);

    this._y = value;
    this._height = value;

    return this;
  }

  public set(x: number, y: number) {
    this.setX(x).setY(y);
    return this;
  }

  public toArray(): [number, number] {
    return [this.x, this.y];
  }
}

export default CoreVector2;
