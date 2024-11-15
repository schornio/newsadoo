import { useEffect, useState } from "react";
// import * as THREE from "three";
import jsonData from "../assets/new_data.json";
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
import { getConnectedNodes } from "./utils/getConnectedNodes";

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
  const [links, setLinks] = useState<LinkMesh[]>([]);
  const [currentNode, setCurrentNode] = useState<NodeMesh | null>(null);

  const [nodePositions, setNodePositions] = useState<number[]>([0, 1, 2]); // Indices into positions array

  const positions = {
    center: toPosition({ positionOut: 1 }),
    left: toPosition({ positionLeft: 4 }),
    right: toPosition({ positionRight: 4 }),
  };

  const rotations = {
    center: toRotation({}),
    left: toRotation({ rotationYInDeg: 30 }),
    right: toRotation({ rotationYInDeg: -30 }),
  };

  useEffect(() => {
    let data = JSON.parse(JSON.stringify(jsonData)) as {
      nodes: NodeMesh[];
      links: LinkMesh[];
    };

    setNodes(data.nodes);
    setLinks(data.links);

    if (data.nodes.length > 0) {
      setCurrentNode(data.nodes[0]);
    }
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

  const connectedNodes = getConnectedNodes({
    links,
    currentNode,
    nodes,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {/* <pre>{JSON.stringify(connectedNodesIds, null, 2)}</pre>
      <pre>{JSON.stringify(connectedNodes, null, 2)}</pre> */}
      <pre>{JSON.stringify(currentNode, null, 2)}</pre>

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
          height: "50vh",
          width: "50vw",
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
            {currentNode && (
              <>
                <Node
                  key={currentNode.id}
                  node={currentNode}
                  position={positions.center}
                  rotation={rotations.center}
                />

                {connectedNodes.map((node, index) => {
                  const angle = (index / connectedNodes.length) * Math.PI * 2;
                  const position = [
                    Math.cos(angle) * 4, // Radius from the center
                    0,
                    Math.sin(angle) * 4,
                  ];
                  const rotation = [0, angle, 0];

                  return (
                    <Node
                      key={node.id}
                      node={node}
                      position={position}
                      rotation={rotation}
                      onClick={() => setCurrentNode(node)}
                    />
                  );
                })}
              </>
            )}
          </group>
        </XR>
      </Canvas>

      {/* <Stats /> */}
    </div>
  );
}
