export type Size = {
  sizeWidth?: number;
  sizeHeight?: number;
  sizeDepth?: number;
};

/**
 * Converts size object to a 3D vector [width, height, depth].
 *
 * @param {Size} params - Size object with optional values.
 * @returns {[number, number, number]} - Array representing size [width, height, depth].
 */
export function toSize({
  sizeWidth = 1,
  sizeHeight = 1,
  sizeDepth = 1,
}: Size): [number, number, number] {
  return [sizeWidth, sizeHeight, sizeDepth];
}
