import { Line } from "@react-three/drei";
import { LinkMesh } from "../types";
import { isNodeMesh } from "../utils/isNodeMesh";
import { getLinkColor } from "../utils/getLinkColor";

export function GraphLink({ link }: { link: LinkMesh }) {
  const source = isNodeMesh(link.source) ? link.source : null;
  const target = isNodeMesh(link.target) ? link.target : null;

  return (
    <Line
      points={[
        [source?.x || 0, source?.y || 0, source?.z || 0],
        [target?.x || 0, target?.y || 0, target?.z || 0],
      ]}
      color={getLinkColor(link.weight)}
      opacity={0.3}
      transparent
    />
  );
}
