// counter clockwise front facing triangle
const positions = [
  // front
  [
    [-0.5, -0.5, 0.5],
    [0.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
  ],
  [
    [-0.5, -0.5, 0.5],
    [0.5, -0.5, 0.5],
    [0.5, 0.5, 0.5],
  ],
  // back
  [
    [-0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [-0.5, -0.5, -0.5],
  ],
  [
    [0.5, 0.5, -0.5],
    [0.5, -0.5, -0.5],
    [-0.5, -0.5, -0.5],
  ],
  // top
  [
    [-0.5, 0.5, 0.5],
    [0.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],
  ],
  [
    [-0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
    [0.5, 0.5, -0.5],
  ],
  // bottom
  [
    [-0.5, -0.5, -0.5],
    [0.5, -0.5, -0.5],
    [-0.5, -0.5, 0.5],
  ],
  [
    [0.5, -0.5, -0.5],
    [0.5, -0.5, 0.5],
    [-0.5, -0.5, 0.5],
  ],
  // left
  [
    [-0.5, -0.5, -0.5],
    [-0.5, 0.5, 0.5],
    [-0.5, 0.5, -0.5],
  ],
  [
    [-0.5, -0.5, -0.5],
    [-0.5, -0.5, 0.5],
    [-0.5, 0.5, 0.5],
  ],
  // right
  [
    [0.5, 0.5, -0.5],
    [0.5, -0.5, 0.5],
    [0.5, -0.5, -0.5],
  ],
  [
    [0.5, 0.5, -0.5],
    [0.5, 0.5, 0.5],
    [0.5, -0.5, 0.5],
  ],
].flat(2);

const normals = [
  // front
  [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  // back
  [
    [0, 0, -1],
    [0, 0, -1],
    [0, 0, -1],
  ],
  [
    [0, 0, -1],
    [0, 0, -1],
    [0, 0, -1],
  ],
  // top
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  // bottom
  [
    [0, -1, 0],
    [0, -1, 0],
    [0, -1, 0],
  ],
  [
    [0, -1, 0],
    [0, -1, 0],
    [0, -1, 0],
  ],
  // left
  [
    [-1, 0, 0],
    [-1, 0, 0],
    [-1, 0, 0],
  ],
  [
    [-1, 0, 0],
    [-1, 0, 0],
    [-1, 0, 0],
  ],
  // right
  [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
].flat(2);

export { positions, normals };
