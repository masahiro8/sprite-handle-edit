export const matrix3x3 = (matrix, { x, y, z }) => {
  const _x = x * matrix[0][0] + y * matrix[0][1] + z * matrix[0][2];
  const _y = x * matrix[1][0] + y * matrix[1][1] + z * matrix[1][2];
  const _z = x * matrix[2][0] + y * matrix[2][1] + z * matrix[2][2];
  return { x: _x, y: _y, z: _z };
};