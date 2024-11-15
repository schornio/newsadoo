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
  const [links, setLinks] = useState<LinkMesh[]>([]);

  const [nodesPosition, setNodesPosition] = useState<NodesPosition | null>(
    null
  );

  const positions = {
    left: toPosition({ positionLeft: 4 }),
    center: toPosition({ positionOut: 1 }),
    right: toPosition({ positionRight: 4 }),
  };

  const rotations = {
    left: toRotation({ rotationYInRad: Math.PI / 2 }),
    right: toRotation({ rotationYInRad: -Math.PI / 2 }),
  };

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
    (nodeClicked: "left" | "right") => {
      if (!nodesPosition) {
        return;
      }

      function moveNodesClockwise() {
        if (!nodesPosition) {
          return;
        }

        setNodesPosition({
          center: nodesPosition.left,
          left: nodesPosition.right,
          right: nodesPosition.center,
        });
      }

      function moveNodesCounterClockwise() {
        if (!nodesPosition) {
          return;
        }

        setNodesPosition({
          center: nodesPosition.right,
          right: nodesPosition.left,
          left: nodesPosition.center,
        });
      }

      if (nodeClicked === "right") {
        moveNodesCounterClockwise();
      } else if (nodeClicked === "left") {
        moveNodesClockwise();
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
          <Environment preset="studio" background />

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
                  onClick={() => onInteraction("left")}
                  position={positions.left}
                  rotation={toRotation({ rotationYInDeg: 30 })}
                />

                <Node node={nodesPosition.center} position={positions.center} />

                <Node
                  node={nodesPosition.right}
                  onClick={() => onInteraction("right")}
                  position={positions.right}
                  rotation={toRotation({ rotationYInDeg: -30 })}
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
