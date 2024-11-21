import { NodeMesh } from "../types";

export function isNodeMesh(node: unknown): node is NodeMesh {
  return (
    typeof node === "object" &&
    node !== null &&
    "x" in node &&
    "y" in node &&
    "z" in node
  );
}
