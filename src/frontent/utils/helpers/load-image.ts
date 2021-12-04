export const loadImage = (src: string, crossOrigin = false): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    if (crossOrigin) image.crossOrigin = "*";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
};
