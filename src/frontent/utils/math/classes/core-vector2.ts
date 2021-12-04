import { CoreMath } from "./core-math";

type Num = number | CoreMath;

export class CoreVector2 {
  private _x: CoreMath;
  private _width: CoreMath;

  private _y: CoreMath;
  private _height: CoreMath;

  public get x(): number {
    return this._x.value;
  }

  public set x(value: Num) {
    this.setX(value);
  }

  public get width(): number {
    return this._width.value;
  }

  public set width(value: Num) {
    this.setX(value);
  }

  public get y(): number {
    return this._y.value;
  }

  public set y(value: Num) {
    this.setY(value);
  }

  public get height(): number {
    return this._height.value;
  }

  public set height(value: Num) {
    this.setY(value);
  }

  constructor(x: Num, y: Num) {
    this.set(x, y);
  }

  public setX(x: Num) {
    const value = new CoreMath(x);

    this._x = value;
    this._width = value;

    return this;
  }

  public setY(y: Num) {
    const value = new CoreMath(y);

    this._y = value;
    this._height = value;

    return this;
  }

  public set(x: Num, y: Num) {
    this.setX(x).setY(y);
    return this;
  }

  public toArray(): [number, number] {
    return [this.x, this.y];
  }
}

export default CoreVector2;
