import { Mutable } from "frontent/models";
import { arrayOf } from "frontent/utils";

export class CoreMatrix3 {
  public mat: Float32Array;

  private _savedMat = new Float32Array(9);
  private _isSaved = false;

  constructor() {
    this.mat = new Float32Array(9);
  }

  public clone() {
    return new CoreMatrix3().set(
      this.mat[0],
      this.mat[1],
      this.mat[2],
      this.mat[3],
      this.mat[4],
      this.mat[5],
      this.mat[6],
      this.mat[7],
      this.mat[8],
    );
  }

  public save() {
    this._isSaved = true;
    CoreMatrix3.copy(this._savedMat, this.mat);
    return this;
  }

  public restore() {
    if (this._isSaved) {
      this._isSaved = false;
      CoreMatrix3.copy(this.mat, this._savedMat);
    }
    return this;
  }

  public set(
    m00: number,
    m01: number,
    m02: number,
    m10: number,
    m11: number,
    m12: number,
    m20: number,
    m21: number,
    m22: number,
  ) {
    this.mat[0] = m00;
    this.mat[1] = m01;
    this.mat[2] = m02;
    this.mat[3] = m10;
    this.mat[4] = m11;
    this.mat[5] = m12;
    this.mat[6] = m20;
    this.mat[7] = m21;
    this.mat[8] = m22;
    return this;
  }

  public fill(num: number) {
    this.mat[0] = num;
    this.mat[1] = num;
    this.mat[2] = num;
    this.mat[3] = num;
    this.mat[4] = num;
    this.mat[5] = num;
    this.mat[6] = num;
    this.mat[7] = num;
    this.mat[8] = num;
    return this;
  }

  public translate(x: number, y: number) {
    this.mat[6] = x * this.mat[0] + y * this.mat[3] + this.mat[6];
    this.mat[7] = x * this.mat[1] + y * this.mat[4] + this.mat[7];
    this.mat[8] = x * this.mat[2] + y * this.mat[5] + this.mat[8];
    return this;
  }

  public rotate(rad: number) {
    const a00 = this.mat[0];
    const a01 = this.mat[1];
    const a02 = this.mat[2];
    const a10 = this.mat[3];
    const a11 = this.mat[4];
    const a12 = this.mat[5];

    const s = Math.sin(-rad);
    const c = Math.cos(-rad);

    this.mat[0] = c * a00 + s * a10;
    this.mat[1] = c * a01 + s * a11;
    this.mat[2] = c * a02 + s * a12;

    this.mat[3] = c * a10 - s * a00;
    this.mat[4] = c * a11 - s * a01;
    this.mat[5] = c * a12 - s * a02;

    return this;
  }

  public scale(x: number, y: number) {
    this.mat[0] = x * this.mat[0];
    this.mat[1] = x * this.mat[1];
    this.mat[2] = x * this.mat[2];

    this.mat[3] = y * this.mat[3];
    this.mat[4] = y * this.mat[4];
    this.mat[5] = y * this.mat[5];

    return this;
  }

  public multiply(matrix: ArrayLike<number>) {
    const a00 = this.mat[0];
    const a01 = this.mat[1];
    const a02 = this.mat[2];
    const a10 = this.mat[3];
    const a11 = this.mat[4];
    const a12 = this.mat[5];
    const a20 = this.mat[6];
    const a21 = this.mat[7];
    const a22 = this.mat[8];
    const b00 = matrix[0];
    const b01 = matrix[1];
    const b02 = matrix[2];
    const b10 = matrix[3];
    const b11 = matrix[4];
    const b12 = matrix[5];
    const b20 = matrix[6];
    const b21 = matrix[7];
    const b22 = matrix[8];

    this.set(
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    );

    return this;
  }

  public logMatrix() {
    CoreMatrix3.logMatrix(this.mat);
    return this;
  }

  static copy(to: Mutable<ArrayLike<number>>, from: ArrayLike<number>) {
    to[0] = from[0];
    to[1] = from[1];
    to[2] = from[2];
    to[3] = from[3];
    to[4] = from[4];
    to[5] = from[5];
    to[6] = from[6];
    to[7] = from[7];
    to[8] = from[8];
    return to;
  }

  static identity() {
    return new CoreMatrix3().set(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  static projection(width: number, height: number) {
    // Note: This matrix flips the Y axis so that 0 is at the top.
    return new CoreMatrix3().set(2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1);
  }

  static translation(tx: number, ty: number) {
    return new CoreMatrix3().set(1, 0, 0, 0, 1, 0, tx, ty, 1);
  }

  static rotation(rad: number) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    return new CoreMatrix3().set(c, -s, 0, s, c, 0, 0, 0, 1);
  }

  static scaling(sx: number, sy: number) {
    return new CoreMatrix3().set(sx, 0, 0, 0, sy, 0, 0, 0, 1);
  }

  static logMatrix(matrix: ArrayLike<number>) {
    const mat = Array.from(matrix).map(String);

    const row0 = mat.slice(0, 3);
    const row0LengthArr = row0.map((str) => str.length);

    const row1 = mat.slice(3, 6);
    const row1LengthArr = row1.map((str) => str.length);

    const row2 = mat.slice(6, 9);
    const row2LengthArr = row2.map((str) => str.length);

    const lengthMap = {
      0: Math.max(row0LengthArr[0], row1LengthArr[0], row2LengthArr[0]),
      1: Math.max(row0LengthArr[1], row1LengthArr[1], row2LengthArr[1]),
      2: Math.max(row0LengthArr[2], row1LengthArr[2], row2LengthArr[2]),
    };

    const getSpaces = (amount: number) => arrayOf(amount, () => " ").join("");

    const mapWithSpaces = (arr: string[]) => {
      return arr.map((str, i) => getSpaces(lengthMap[i] - str.length) + str);
    };

    console.log(
      [
        mapWithSpaces(row0).join("  "),
        mapWithSpaces(row1).join("  "),
        mapWithSpaces(row2).join("  "),
      ].join("\n"),
    );
  }
}

export default CoreMatrix3;
