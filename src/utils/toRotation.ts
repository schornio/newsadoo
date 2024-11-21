const RotationDeg = {
  FULL: 360,
  HALF: 180,
  HALF_QUARTER: 45,
  QUARTER: 90,
  THREE_QUARTERS: 270,
};

const RotationRad = {
  FULL: 2 * Math.PI,
  HALF: Math.PI,
  QUARTER: Math.PI / 2,
  THREE_QUARTERS: (3 * Math.PI) / 2,
};

export type Rotation = {
  rotationXInDeg?: number;
  rotationYInDeg?: number;
  rotationZInDeg?: number;
  rotationXInRad?: number;
  rotationYInRad?: number;
  rotationZInRad?: number;
};

/**
 * Converts rotation object to a 3D vector [x, y, z] in radians.
 * Supports both degrees and radians inputs.
 *
 * @param {Rotation} params - Rotation object with optional values in degrees or radians.
 * @returns {[number, number, number]} - Array representing rotation in radians [x, y, z].
 */
function toRotation({
  rotationXInDeg,
  rotationYInDeg,
  rotationZInDeg,
  rotationXInRad,
  rotationYInRad,
  rotationZInRad,
}: Rotation): [number, number, number] {
  const degToRad = (deg: number | undefined) =>
    deg === undefined ? undefined : (deg * Math.PI) / 180;

  const x =
    rotationXInDeg === undefined ? rotationXInRad : degToRad(rotationXInDeg);
  const y =
    rotationYInDeg === undefined ? rotationYInRad : degToRad(rotationYInDeg);
  const z =
    rotationZInDeg === undefined ? rotationZInRad : degToRad(rotationZInDeg);

  return [x ?? 0, y ?? 0, z ?? 0];
}

export { RotationDeg, RotationRad, toRotation };
