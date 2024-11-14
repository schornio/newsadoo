import { LinkMesh, NodeMesh } from "../types";

export function Link({ link }: { link: LinkMesh }) {
  const sourceNode = link.source as NodeMesh;
  const targetNode = link.target as NodeMesh;

  // const positions = new Float32Array([
  //   sourceNode.position[0],
  //   sourceNode.position[1],
  //   sourceNode.position[2],
  //   targetNode.position[0],
  //   targetNode.position[1],
  //   targetNode.position[2],
  // ]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          // array={positions}
          itemSize={3}
          count={2}
        />
      </bufferGeometry>
      <lineBasicMaterial color={link.color || "gray"} />
    </line>
  );
}
