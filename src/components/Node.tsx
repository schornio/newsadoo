import { RoundedBox, Sphere, Image, Text } from "@react-three/drei";
import { Node as NodeType } from "./ForceGraph";
import { useCallback, useRef } from "react";
import { Group } from "three";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Simulation } from "d3-force";

export function Node({
  node,
  onClick,
  selected,
  simulation,
}: {
  node: NodeType;
  onClick: (node: NodeType) => void;
  selected: boolean;
  simulation: Simulation<NodeType, undefined>;
}) {
  const wrapperRef = useRef<Group>(null);

  useFrame(() => {
    if (wrapperRef.current) {
      wrapperRef.current.position.set(node.x ?? 0, node.y ?? 0, -50);
    }
  });

  const onSphereClick = useCallback(() => {
    onClick(node);
  }, [node, onClick]);

  const onPointerMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (selected) {
        const cloned = event.point.clone();
        const [x, y] = cloned.toArray();
        node.fx = x;
        node.fy = y;
        simulation.alpha(0.1).restart();
      }
    },
    [selected, node, simulation]
  );

  return (
    <group ref={wrapperRef}>
      <Sphere
        args={[5, 32, 32]}
        key={node.data.id}
        onClick={onSphereClick}
        onPointerMove={onPointerMove}
      >
        <meshStandardMaterial
          color="yellow"
          transparent
          opacity={selected ? 0.7 : 0}
          depthWrite={false}
        />
      </Sphere>
      <RoundedBox args={[6, 8, 1]} radius={0.3}>
        <meshStandardMaterial color="white" />
      </RoundedBox>
      {node.data.image ? (
        <Image position={[0, 1, 0.6]} scale={4.5} url={node.data.image} />
      ) : undefined}
      <Text position={[0, -2, 0.6]} color="black" fontSize={0.5}>
        {node.data.name}
      </Text>
    </group>
  );
}
