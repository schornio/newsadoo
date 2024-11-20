export function getNodeSize(nodeValue: number) {
  // square root: number that, when multiplied by itself, equals the original number
  // 9 = original number => 3 * 3 = 9. Square root of 9 is 3
  return Math.sqrt(nodeValue) / 3;
}
