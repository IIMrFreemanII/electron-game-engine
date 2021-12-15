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

  const obj = { a: 1, b: 2, c: 3 };
  const map = new Map(Object.entries(obj));

  suite
    .add("object", function () {
      const item = obj.a + obj.b;
    })
    .add("map", function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const item = map.get("a") + map.get("b");
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
