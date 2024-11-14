import { animated, useSpring } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { toPosition } from "../utils/toPosition";
import { NodeMesh } from "../types";

export function Node({
  node,
  onClick,
  position,
}: {
  node: NodeMesh;
  onClick?: () => void;
  position: [number, number, number];
}) {
  // const [showText, setShowText] = useState(false);

  const { animatedPosition } = useSpring({
    animatedPosition: position,
    config: { mass: 1, tension: 170, friction: 26, precision: 0.0001 },
  });

  return (
    <animated.group
      position={animatedPosition}
      // onPointerEnter={() => setShowText(true)}
      // onPointerLeave={() => setShowText(false)}
      onClick={onClick}
    >
      <mesh>
        <sphereGeometry args={[node.normalizedVal, 16, 16]} />
        <meshBasicMaterial color={node.color || "skyblue"} />
      </mesh>

      {/* We need to see where this nodes points to */}
      {/* <Text
        position={[0, node.normalizedVal + 2, 0]}
        fontSize={4}
        color={node.color || "white"}
        anchorX="center"
        anchorY="middle"
      >
        Points to: {node.}
      </Text> */}

      {/* {showText && ( */}
      <Text
        position={toPosition({
          positionOut: 1.2,
          positionTop: 1,
        })}
        fontSize={0.3}
        color={node.color || "white"}
        anchorX="center"
        anchorY="middle"
      >
        {node.name}
      </Text>
      {/* )} */}
    </animated.group>
  );
}
