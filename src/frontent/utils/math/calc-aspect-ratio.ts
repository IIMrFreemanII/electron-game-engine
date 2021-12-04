export const calcAspectRatio = (
  dWidth: number,
  dHeight: number,
  sWidth: number,
  sHeight: number,
  objectFit: "cover" | "contain" = "contain",
): [width: number, height: number, x: number, y: number] => {
  const math = objectFit === "contain" ? Math.min : Math.max;
  const scale = math(dWidth / sWidth, dHeight / sHeight);

  const width = sWidth * scale;
  const height = sHeight * scale;

  const x = dWidth / 2 - (sWidth / 2) * scale;
  const y = dHeight / 2 - (sHeight / 2) * scale;

  return [width, height, x, y];
};
