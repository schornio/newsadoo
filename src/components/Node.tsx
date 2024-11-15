import { animated, useSpring } from "@react-spring/three";
import { Image, RoundedBox, Text } from "@react-three/drei";
import { toPosition } from "../utils/toPosition";
import { NodeMesh } from "../types";
import { Card, CardContent, CardDescription, CardTitle } from "./default/card";
import { toSize } from "../utils/toSize";
import { toGoldenRatio } from "../utils/toGoldenRatio";
import { toRotation } from "../utils/toRotation";

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

const CARD_DEPTH = 0.1;
const CARD_HEIGHT = 2.5;
const LANDSCAPE_CARD = "portrait";

export function Node({
  node,
  onClick,
  position,
  rotation,
}: {
  node: NodeMesh;
  onClick?: () => void;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { animatedPosition } = useSpring({
    animatedPosition: position,
    config: { mass: 1, tension: 170, friction: 26, precision: 0.0001 },
    rotation: rotation,
  });

  console.log("node", node);

  return (
    <animated.group
      position={animatedPosition}
      onClick={onClick}
      rotation={rotation}
    >
      <RoundedBox
        args={toSize({
          sizeDepth: CARD_DEPTH,
          sizeHeight: CARD_HEIGHT,
          sizeWidth: toGoldenRatio({ height: CARD_HEIGHT }).goldenWidth,
        })}
        radius={0.1}
        smoothness={4}
        rotation={toRotation({
          rotationZInRad: LANDSCAPE_CARD === "portrait" ? -Math.PI / 2 : 0,
        })}
      >
        <meshBasicMaterial color="white" />
      </RoundedBox>

      {node.image && (
        <Image
          url="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg/100px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg"
          // position={toPosition({
          //   positionOut: 1.2,
          //   positionTop: 0.5,
          // })}
          position={toPosition({
            positionTop: 0.8,
            positionOut: CARD_DEPTH,
          })}
          scale={[2, 2]}
        />
      )}

      <Text
        position={toPosition({
          positionOut: CARD_DEPTH,
          positionBottom: 0.6,
        })}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {node.name}
      </Text>
    </animated.group>
  );
}
