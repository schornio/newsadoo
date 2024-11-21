import { Image, RoundedBox, Text } from "@react-three/drei";
// import { useState } from "react";
import { NodeMesh } from "../types";
import { toSize } from "../utils/toSize";
import { toGoldenRatio } from "../utils/toGoldenRatio";
import { toRotation } from "../utils/toRotation";
import { toPosition } from "../utils/toPosition";
import { useState } from "react";

const CARD_DEPTH = 0.1;
const CARD_HEIGHT = 2.5;
const LANDSCAPE_CARD = "portrait";
const NOT_WORKING_IMAGE =
  "https://media.newsadoo.com/mediahub/datasphere/vr/placeholder.png";
const IMAGE_PLACEHOLDER =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg/100px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg";

export function Node({
  node,
  onDrag,
  position,
  rotation,
}: {
  node: NodeMesh;
  onDrag?: (x: number, y: number) => void;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <group
      scale={5}
      position={position}
      rotation={rotation}
      onPointerDown={(e) => {
        e.stopPropagation();

        console.log("clicked");

        setIsDragging(true);
      }}
      onPointerMove={(e) => {
        if (isDragging) {
          e.stopPropagation();

          /* 
            onDrag?.(nodeId, e.point.x, e.point.y); => we don't need to pass the id here, we simplify the component API.
            The `Node` component API focus solely on the position. 
          */
          onDrag?.(e.point.x, e.point.y);
        }
      }}
      onPointerUp={(e) => {
        e.stopPropagation();

        setIsDragging(false);
      }}
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
