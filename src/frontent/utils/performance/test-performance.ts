import { averageValue } from "frontent/utils";

export const testPerformance = (func: VoidFunction, iterations = 1, times = 1): number => {
  iterations = Math.max(iterations, 1);
  times = Math.max(times, 1);

  const results: number[] = [];

  for (let i = 0; i < times; i++) {
    const start = performance.now();

    for (let j = 0; j < iterations; j++) {
      func();
    }

    const res = performance.now() - start;

    results.push(res);
  }

  return averageValue(...results);
};
