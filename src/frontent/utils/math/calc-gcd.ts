export const calcGCD = (a: number, b: number): number => (b === 0 ? a : calcGCD(b, a % b));
