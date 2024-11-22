import { Image, RoundedBox, Text } from "@react-three/drei";
// import { useState } from "react";
import { NodeMesh } from "../types";
import { toSize } from "../utils/toSize";
import { toGoldenRatio } from "../utils/toGoldenRatio";
import { toRotation } from "../utils/toRotation";
import { toPosition } from "../utils/toPosition";
import { useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { textSizeVR } from "../constants/textSizeVR";
import { useViewStore } from "../store/useViewStore";

const CARD_DEPTH = 0.1;
const CARD_HEIGHT = 1.5;
const LANDSCAPE_CARD = "portrait";
const NOT_WORKING_IMAGE =
  "https://media.newsadoo.com/mediahub/datasphere/vr/placeholder.png";
const IMAGE_PLACEHOLDER =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg/100px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_4016_by_Stepro_%28cropped%29.jpg";

export function Node({
  node,
  position,
  rotation,
}: {
  node: NodeMesh;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const viewMode = useViewStore((state) => state.viewMode);
  const setViewMode = useViewStore((state) => state.setViewMode);
  const setCurrentNodeId = useViewStore((state) => state.setCurrentNodeId);

  function onHover(e: ThreeEvent<PointerEvent>, type: "hover" | "unhover") {
    e.stopPropagation();
    setIsHovered(type === "hover");
  }

  function onClick(e: ThreeEvent<PointerEvent>, type: "click" | "unclick") {
    e.stopPropagation();
    setIsClicked(type === "click");
  }

  function getNodeColor(isHovered: boolean, isClicked: boolean) {
    let color = "white";

    if (isHovered) {
      color = "gray";
    }

    if (isClicked) {
      color = "green";
    }

    return color;
  }

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerDown={(e) => {
        onClick(e, isClicked ? "unclick" : "click");
        setViewMode(viewMode === "graph" ? "read" : "graph");
        setCurrentNodeId(node.id);
      }}
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
        <meshBasicMaterial color={getNodeColor(isHovered, isClicked)} />
      </RoundedBox>

      {node.image && (
        <Image
          url={
            node.image === NOT_WORKING_IMAGE ? IMAGE_PLACEHOLDER : node.image
          }
          position={toPosition({
            positionTop: 0.4,
            positionOut: CARD_DEPTH,
          })}
        />
      )}

      <Text
        position={toPosition({
          positionOut: CARD_DEPTH,
          positionBottom: 0.6,
        })}
        fontSize={textSizeVR.sm}
        color="black"
        anchorX="center"
        anchorY="middle"
        // depthOffset={0.5}
      >
        {node.name}
      </Text>
    </group>
  );
}
