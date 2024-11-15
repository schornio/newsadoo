import { animated, useSpring } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { toPosition } from "../utils/toPosition";
import { NodeMesh } from "../types";
import { Card, CardContent, CardDescription, CardTitle } from "./default/card";

/* 
{
    "id": 78503,
    "name": "Lando Norris",
    "tag_timeline": "https://newsadoo.com/de/tag/78503/timeline",
    "tag_type": "PER",
    "val": 2960,
    "level": 0,
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg/100px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg"
}
*/

export function Node({
  node,
  onClick,
  position,
}: {
  node: NodeMesh;
  onClick?: () => void;
  position: [number, number, number];
}) {
  const { animatedPosition } = useSpring({
    animatedPosition: position,
    config: { mass: 1, tension: 170, friction: 26, precision: 0.0001 },
  });

  return (
    <animated.group position={animatedPosition} onClick={onClick}>
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
