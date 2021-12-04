export const setWebglRect = (
  gl: WebGL2RenderingContext,
  attributeLocation: number,
  width: number,
  height: number,
): number => {
  const buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  const dx = 0;
  const dWidth = width;
  const dy = 0;
  const dHeight = height;

  // const bufferData = new Float32Array([
  //   dx,
  //   dy,
  //   dWidth,
  //   dy,
  //   dx,
  //   dHeight,
  //   dx,
  //   dHeight,
  //   dWidth,
  //   dy,
  //   dWidth,
  //   dHeight,
  // ]);
  const bufferData = new Float32Array([
    // left column
    0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

    // top rung
    30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

    // middle rung
    30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90,
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

  // tell the position attribute how to pull data out of the current ARRAY_BUFFER
  gl.enableVertexAttribArray(attributeLocation);
  gl.vertexAttribPointer(attributeLocation, 2, gl.FLOAT, false, 0, 0);

  return bufferData.length;
};
