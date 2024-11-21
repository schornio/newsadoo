const GOLDEN_RATIO = 1.61803398875;

export function toGoldenRatio({
  height,
  width,
}: {
  height?: number;
  width?: number;
}): { goldenHeight?: number; goldenWidth?: number } {
  if (height) {
    return { goldenWidth: height * GOLDEN_RATIO };
  }

  if (width) {
    return { goldenHeight: width / GOLDEN_RATIO };
  }

  return {};
}
