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
  const [links, setLinks] = useState<LinkMesh[]>([]);

  const [nodesPosition, setNodesPosition] = useState<NodesPosition | null>(
    null
  );

  useEffect(() => {
    let data = JSON.parse(JSON.stringify(jsonData)) as {
      nodes: NodeMesh[];
      links: LinkMesh[];
    };

    // Data Processing => to see if we keep it
    // data = normalizeNodeSize(data);
    data = normalizeLinkSize(data);
    // data = setNodeColor(data);

    const [left, center, right] = data.nodes;

    left.position = toPosition({
      positionLeft: 10,
    });
    right.position = toPosition({
      positionRight: 10,
    });

    data.links.forEach((link) => {
      const sourceNode = data.nodes.find((n) => n.id === link.source);
      const targetNode = data.nodes.find((n) => n.id === link.target);

      if (sourceNode && targetNode) {
        link.source = sourceNode;
        link.target = targetNode;
      }
    });

    setLinks(data.links);

    setNodesPosition({
      left,
      center,
      right,
    });
  }, []);

  const onInteraction = useCallback(
    (move: "moveLeftward" | "moveRightward") => {
      if (!nodesPosition) {
        return;
      }

      if (move === "moveLeftward") {
        setNodesPosition({
          left: nodesPosition.right,
          center: nodesPosition.left,
          right: nodesPosition.center,
        });
      } else if (move === "moveRightward") {
        setNodesPosition({
          left: nodesPosition.center,
          center: nodesPosition.right,
          right: nodesPosition.left,
        });
      }
    },
    [nodesPosition, setNodesPosition]
  );

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
          height: "50vh",
          width: "50vw",
        }}
      >
        <XR store={store}>
          <OrbitControls />
          <Environment preset="sunset" background />

          <group
            scale={0.7}
            position={toPosition({
              positionIn: 5,
              positionTop: 1.5,
            })}
          >
            {/* {links.length > 0 &&
              links.map((link, index) => <LinkLine key={index} link={link} />)} */}

            {nodesPosition && (
              <group>
                <Node
                  node={nodesPosition.left}
                  onClick={() => onInteraction("moveRightward")}
                  position={nodesPosition.left.position}
                />

                <Node
                  node={nodesPosition.center}
                  position={nodesPosition.center.position}
                />

                <Node
                  node={nodesPosition.right}
                  onClick={() => onInteraction("moveLeftward")}
                  position={nodesPosition.right.position}
                />
              </group>
            )}
          </group>

          {/* <axesHelper args={[50]} /> */}
        </XR>
      </Canvas>

      <Stats />
    </div>
  );
}
