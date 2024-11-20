export function getLinkColor(linkWeight: number) {
  let color;

  if (linkWeight > 0.8) {
    color = "red";
  } else if (linkWeight > 0.5) {
    color = "orange";
  } else if (linkWeight > 0.3) {
    color = "yellow";
  } else {
    color = "green";
  }

  return color;
}
