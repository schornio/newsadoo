import { Image, RoundedBox, Text } from "@react-three/drei";
// import { useState } from "react";
import { NodeMesh } from "../types";
import { toSize } from "../utils/toSize";
import { toGoldenRatio } from "../utils/toGoldenRatio";
import { toRotation } from "../utils/toRotation";
import { toPosition } from "../utils/toPosition";

const CARD_DEPTH = 0.1;
const CARD_HEIGHT = 2.5;
const LANDSCAPE_CARD = "portrait";
const NOT_WORKING_IMAGE =
  "https://media.newsadoo.com/mediahub/datasphere/vr/placeholder.png";
const IMAGE_PLACEHOLDER =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg/100px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg";

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
  // const [isHovered, setIsHovered] = useState(false);

  // console.log("node", node);
  // console.log("position", position);
  // console.log("rotation", rotation);
  return (
    <group position={position} rotation={rotation} onClick={onClick}>
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
          url={
            node.image === NOT_WORKING_IMAGE ? IMAGE_PLACEHOLDER : node.image
          }
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
    </group>
  );
}
