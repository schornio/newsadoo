import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { createXRStore, XR } from "@react-three/xr";
import { ForceGraph } from "./components/ForceGraph";
import { toPosition } from "./utils/toPosition";
import { textSizeVR } from "./constants/textSizeVR";
import { useViewStore } from "./store/useViewStore";
import data from "../assets/new_data.json";
import { Node } from "./components/Node";
import { NodeMesh } from "./types";
import { useCallback, useEffect, useState } from "react";
import { toRotation } from "./utils/toRotation";

const store = createXRStore({
  hand: {
    rayPointer: {
      rayModel: { maxLength: 200, opacity: 0.2 },
    },
  },
  foveation: 0.3,
});

// github nodes with animation: https://github.com/schornio/newsadoo/tree/179abc715b287dd4bd6f0aee107e9e9ab54f0675/src

export default function App() {
  // const viewMode = useViewStore((state) => state.viewMode);
  // const setViewMode = useViewStore((state) => state.setViewMode);
  const currentNodeId = useViewStore((state) => state.currentNodeId);
  const setCurrentNodeId = useViewStore((state) => state.setCurrentNodeId);

  const currentNode: NodeMesh | undefined = data.nodes.find(
    (n) => n.id === currentNodeId
  );

  const [viewModeNodes, setViewModeNodes] = useState<NodeMesh[]>([]);

  // we can improve this state, add position and rotation to centralized place
  const [viewModeNodesPositions, setViewModeNodesPositions] = useState([
    "left",
    "center",
    "right",
  ]);

  const positions = [
    toPosition({ positionLeft: 4 }), // Position index 0: Left
    toPosition({ positionOut: 1 }), // Position index 1: Center
    toPosition({ positionRight: 4 }), // Position index 2: Right
  ];

  const rotations = [
    toRotation({ rotationYInDeg: 30 }), // Rotation index 0: Left
    toRotation({}), // Rotation index 1: Center
    toRotation({ rotationYInDeg: -30 }), // Rotation index 2: Right
  ];

  useEffect(() => {
    if (!currentNode) {
      return undefined;
    }

    const adjacentNodesId = data.links
      .filter(
        (link) => link.source === currentNodeId || link.target === currentNodeId
      )
      .map((link) =>
        link.source === currentNodeId ? link.target : link.source
      );

    const adjacentNodes = data.nodes.filter((node) =>
      adjacentNodesId.includes(node.id)
    );

    const nodesToDisplay = [
      adjacentNodes[0] || data.nodes[0],
      currentNode,
      adjacentNodes[1] || data.nodes[1],
    ];

    setViewModeNodes(nodesToDisplay);
  }, [currentNodeId, currentNode]);

  const onInteraction = useCallback(
    (nodeClicked: "left" | "right") => {
      if (nodeClicked === "left") {
        setCurrentNodeId(viewModeNodes[0].id);
      } else if (nodeClicked === "right") {
        setCurrentNodeId(viewModeNodes[2].id);
      }
    },
    [viewModeNodes, setCurrentNodeId]
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <button
        onClick={() => store.enterVR()}
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        Enter VR
      </button>

      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <XR store={store}>
          <group
            position={toPosition({
              positionIn: 0.5,
              positionTop: 1,
            })}
          >
            <Text
              fontSize={textSizeVR.xs}
              position={toPosition({
                positionBottom: 0.5,
              })}
            >
              current node: {currentNodeId}
            </Text>
          </group>

          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <ForceGraph />

          {/* Nodes view: left, center, right */}

          {viewModeNodes.length === 3 &&
            viewModeNodesPositions.map((positionLabel, index) => (
              <Node
                key={viewModeNodes[index].id}
                node={viewModeNodes[index]}
                rotation={rotations[index]}
                position={positions[index]}
                onClick={() => {
                  if (positionLabel === "left") {
                    onInteraction("left");
                  } else if (positionLabel === "right") {
                    onInteraction("right");
                  }
                }}
                isView={true}
              />
            ))}
        </XR>
      </Canvas>
    </div>
  );
}
