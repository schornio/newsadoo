import { Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { Node } from "./ForceGraph";
import { useFrame } from "@react-three/fiber";

export function Link({
  link: { source, target },
}: {
  link: {
    source: Node;
    target: Node;
  };
}) {
  const cylinderRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (cylinderRef.current) {
      const direction = new THREE.Vector3(
        (target.x ?? 0) - (source.x ?? 0),
        (target.y ?? 0) - (source.y ?? 0),
        target.data.zIndex - source.data.zIndex
      );

      const length = direction.length();

      const midpoint = new THREE.Vector3(
        ((source.x ?? 0) + (target.x ?? 0)) / 2,
        ((source.y ?? 0) + (target.y ?? 0)) / 2,
        (target.data.zIndex - source.data.zIndex) / 2
      );

      const orientation = new THREE.Quaternion();
      orientation.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.clone().normalize()
      );

      cylinderRef.current.position.set(midpoint.x, midpoint.y, -50);
      cylinderRef.current.quaternion.copy(orientation);
      cylinderRef.current.scale.y = length;
    }
  });

  return <Cylinder args={[0.1, 0.1]} ref={cylinderRef} />;
}
