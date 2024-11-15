import { animated, useSpring } from "@react-spring/three";
import { Image, RoundedBox, Text } from "@react-three/drei";
import { useState } from "react";
import { NodeMesh } from "../types";
import { toSize } from "../utils/toSize";
import { toGoldenRatio } from "../utils/toGoldenRatio";
import { toRotation } from "../utils/toRotation";
import { toPosition } from "../utils/toPosition";

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
  const [isHovered, setIsHovered] = useState(false);

  const style = useSpring({
    position: [position[0], position[1] + (isHovered ? 0.2 : 0), position[2]],
    rotation,
    config: { mass: 1, tension: 170, friction: 26, precision: 0.0001 },
  });

  return (
    <animated.group
      // @ts-expect-error - Ignoring TS error due to type incompatibility with SpringValue<number[]> for scale and rotation properties
      position={style.position}
      // @ts-expect-error - Ignoring TS error due to type incompatibility with SpringValue<number[]> for scale and rotation properties
      rotation={style.rotation}
      onClick={onClick}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
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
          url={node.image}
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
