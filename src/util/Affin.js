/**
 * 行列
 */

const matrix3x3 = (matrix, { x, y, z }) => {
  const _x = x * matrix[0][0] + y * matrix[0][1] + z * matrix[0][2];
  const _y = x * matrix[1][0] + y * matrix[1][1] + z * matrix[1][2];
  const _z = x * matrix[2][0] + y * matrix[2][1] + z * matrix[2][2];
  return { x: _x, y: _y, z: _z };
};

/**
 * アフィン変換
 */
export const Affin = (scale, rotate, transVec2, initVec2) => {
  const radian = rotate * (Math.PI / 180);

  let translationMatrix = [
    [scale * Math.cos(radian), Math.sin(radian), transVec2.x],
    [-Math.sin(radian), scale * Math.cos(radian), transVec2.y],
    [0, 0, 1],
  ];

  const result = matrix3x3(translationMatrix, {
    x: initVec2.x,
    y: initVec2.y,
    z: 1,
  });

  return {
    x: result.x,
    y: result.y,
  };
};
