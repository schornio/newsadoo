//         X
//         |
//         |
//         |
//         |
//         +-------------- Y
//        /
//       /
//      /
//     Z

export type Position = {
  positionBottom?: number; // -X
  positionIn?: number; // -Z
  positionLeft?: number; // -Y
  positionOut?: number; // +Z
  positionRight?: number; // +Y
  positionTop?: number; // +X
};

/**
 * Converts position object to a 3D vector [x, y, z].
 *
 * @param {Position} params - Position object with optional values.
 * @returns {[number, number, number]} - Array representing position [x, y, z].
 */
export function toPosition({
  positionBottom = 0,
  positionIn = 0,
  positionLeft = 0,
  positionOut = 0,
  positionRight = 0,
  positionTop = 0,
}: Position): [number, number, number] {
  return [
    positionRight - positionLeft, // X-axis
    positionTop - positionBottom, // Y-axis
    positionOut - positionIn, // Z-axis
  ];
}

export function convertXYZtoPosition(
  x: number,
  y: number,
  z: number
): Position {
  // +x = right -x = left
  // +y = top -y = bottom
  // +z = out -z = in

  return {
    positionRight: x > 0 ? x : 0,
    positionLeft: x < 0 ? -x : 0,
    positionTop: y > 0 ? y : 0,
    positionBottom: y < 0 ? -y : 0,
    positionOut: z > 0 ? z : 0,
    positionIn: z < 0 ? -z : 0,
  };
}
