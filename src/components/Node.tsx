import { Image, RoundedBox, Text } from "@react-three/drei";
import { NodeMesh } from "../types";
import { toSize } from "../utils/toSize";
import { toGoldenRatio } from "../utils/toGoldenRatio";
import { toRotation } from "../utils/toRotation";
import { toPosition } from "../utils/toPosition";
import { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { useViewStore } from "../store/useViewStore";

const CARD_DEPTH = 0.1;
const CARD_HEIGHT = 1;
const LANDSCAPE_CARD = "portrait";
const NOT_WORKING_IMAGE =
  "https://media.newsadoo.com/mediahub/datasphere/vr/placeholder.png";
const IMAGE_PLACEHOLDER =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg/100px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg";

export function Node({
  node,
  position,
  rotation,
  isView = false,
  onClick,
}: {
  node: NodeMesh;
  position?: [number, number, number];
  rotation?: [number, number, number];
  isView?: boolean;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  // const viewMode = useViewStore((state) => state.viewMode);
  // const setViewMode = useViewStore((state) => state.setViewMode);
  const setCurrentNodeId = useViewStore((state) => state.setCurrentNodeId);

  function onHover(e: ThreeEvent<PointerEvent>, type: "hover" | "unhover") {
    e.stopPropagation();
    setIsHovered(type === "hover");
  }

  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    setCurrentNodeId(node.id);
    onClick?.();
  }

  function onPointerUp(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
  }

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerEnter={(e) => onHover(e, "hover")}
      onPointerLeave={(e) => onHover(e, "unhover")}
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
        <meshBasicMaterial color={isHovered ? "gray" : "white"} />
      </RoundedBox>

      {node.image && (
        <Image
          url={
            node.image === NOT_WORKING_IMAGE ? IMAGE_PLACEHOLDER : node.image
          }
          position={toPosition({
            positionTop: 0.2,
            positionOut: CARD_DEPTH,
          })}
          scale={0.8}
        />
      )}

      <Text
        position={toPosition({
          positionOut: CARD_DEPTH,
          positionBottom: 0.4,
        })}
        fontSize={0.1}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {node.name}
      </Text>
    </group>
  );
}
