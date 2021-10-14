export class System {
  tick(): void {}
  get type() {
    return this.constructor.name;
  }
}
