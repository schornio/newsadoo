import { useEffect, useState } from "react";
// import * as THREE from "three";
import jsonData from "../assets/experiment_data.json";
import { Stats } from "@react-three/drei";
import {
  normalizeLinkSize,
  // normalizeNodeSize,
  // setNodeColor,
} from "./utils/graph";
import { toPosition } from "./utils/toPosition";
import { createXRStore } from "@react-three/xr";
import { LinkMesh, NodeMesh } from "./types";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { XR } from "@react-three/xr";
import { useCallback } from "react";
import { Node } from "./components/Node";
import { toRotation } from "./utils/toRotation";

const store = createXRStore({
  hand: {
    rayPointer: {
      rayModel: { maxLength: 100, opacity: 0.02 },
    },
  },
  foveation: 0.3,
});

export type NodesPosition = {
  left: NodeMesh;
  center: NodeMesh;
  right: NodeMesh;
};

export default function App() {
  const [nodes, setNodes] = useState<NodeMesh[]>([]);
  const [nodePositions, setNodePositions] = useState<number[]>([0, 1, 2]); // Indices into positions array

  const positions = [
    toPosition({ positionLeft: 4 }), // Position index 0: Left
    toPosition({ positionOut: 1 }), // Position index 1: Center
    toPosition({ positionRight: 4 }), // Position index 2: Right
  ];

  const rotations = [
    toRotation({ rotationYInDeg: 30 }), // Rotation index 0: Left
    [0, 0, 0], // Rotation index 1: Center
    toRotation({ rotationYInDeg: -30 }), // Rotation index 2: Right
  ];

  useEffect(() => {
    let data = JSON.parse(JSON.stringify(jsonData)) as {
      nodes: NodeMesh[];
      links: LinkMesh[];
    };

    data = normalizeLinkSize(data);

    const initialNodes = data.nodes.slice(0, 3);

    setNodes(initialNodes);
  }, []);

  const onInteraction = useCallback((nodeClicked: "left" | "right") => {
    setNodePositions((prevPositions) => {
      let newPositions = [...prevPositions];
      if (nodeClicked === "left") {
        newPositions = [prevPositions[1], prevPositions[2], prevPositions[0]];
      } else if (nodeClicked === "right") {
        newPositions = [prevPositions[2], prevPositions[0], prevPositions[1]];
      }
      return newPositions;
    });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <button
        onClick={() => store.enterAR()}
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        Enter AR
      </button>

      <Canvas
        camera={{ position: [0, 0, 200], fov: 75 }}
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <XR store={store}>
          <OrbitControls />
          <Environment files="/studio.hdr" background />

          <group
            scale={0.7}
            position={toPosition({
              positionIn: 5,
              positionTop: 1.5,
            })}
          >
            {/* {links.length > 0 &&
              links.map((link, index) => <LinkLine key={index} link={link} />)} */}

            {nodes.length > 0 && (
              <group>
                {nodes.map((node, index) => (
                  <Node
                    key={node.id}
                    node={node}
                    onClick={
                      nodePositions[index] === 0
                        ? () => onInteraction("left")
                        : nodePositions[index] === 2
                          ? () => onInteraction("right")
                          : undefined
                    }
                    position={positions[nodePositions[index]]}
                    rotation={rotations[nodePositions[index]]}
                  />
                ))}
              </group>
            )}
          </group>
        </XR>
      </Canvas>

      <Stats />
    </div>
  );
}
