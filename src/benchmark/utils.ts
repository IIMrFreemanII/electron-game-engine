import Benchmark from "benchmark";

declare global {
  interface Window {
    Benchmark: typeof Benchmark;
  }
}

window.Benchmark = Benchmark;

class Vec3 {
  data = Array(3);
}

function vec3() {
  return new Array(3);
}

export const test = () => {
  const suite = new Benchmark.Suite();

  // add tests
  suite
    .add("Vec3", function () {
      const vector = new Vec3();
    })
    .add("Array3", function () {
      const vector = Array(3);
    })
    .add("funcVec3", function () {
      const vector = vec3();
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    // run async
    .run({ async: true });
};
