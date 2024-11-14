import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Text } from "@react-three/drei";
import { useCallback, useEffect, useState } from "react";
import { XR, createXRStore } from "@react-three/xr";
import * as THREE from "three";
import jsonData from "../assets/experiment_data.json";
import { Stats } from "@react-three/drei";
import {
  normalizeLinkSize,
  normalizeNodeSize,
  setNodeColor,
} from "./utils/graph";
import { toPosition } from "./utils/toPosition";
import { animated, useSpring } from "@react-spring/three";

const store = createXRStore({
  hand: {
    rayPointer: {
      rayModel: { maxLength: 100, opacity: 0.02 },
    },
  },
  foveation: 0.3, // test if his improves pixalated image at the border
});

type Node = {
  id: number;
  name: string;
  val: number;
  level: number;
  normalizedVal: number;
  color: string;
  position: [number, number, number];
};

type Link = {
  source: Node | number; // Updated to allow Node object or ID
  target: Node | number; // Updated to allow Node object or ID
  weight: number;
  normalizedWeight: number;
  color: string;
};

export default function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  const [nodesPosition, setNodesPosition] = useState<{
    left: Node;
    center: Node;
    right: Node;
  } | null>(null);

  useEffect(() => {
    let data = JSON.parse(JSON.stringify(jsonData)) as {
      nodes: Node[];
      links: Link[];
    };

    // Data Processing => to see if we keep it
    // data = normalizeNodeSize(data);
    // data = normalizeLinkSize(data);
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

    setNodes(data.nodes);
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
    [nodesPosition]
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <button
        onClick={() => store.enterAR()}
        style={{
          position: "absolute",
          bottom: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        Enter AR
      </button>

      <pre>{JSON.stringify(jsonData.nodes[0], null, 2)}</pre>
      <pre>{JSON.stringify(jsonData.nodes[1], null, 2)}</pre>
      <pre>{JSON.stringify(jsonData.nodes[2], null, 2)}</pre>

      <Stats />
      <Canvas camera={{ position: [0, 0, 200], fov: 75 }}>
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
                <NodeMesh
                  node={nodesPosition.left}
                  onClick={() => onInteraction("moveRightward")}
                  position={nodesPosition.left.position}
                />

                <NodeMesh
                  node={nodesPosition.center}
                  position={nodesPosition.center.position}
                />

                <NodeMesh
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
    </div>
  );
}

function NodeMesh({
  node,
  onClick,
  position,
}: {
  node: Node;
  onClick?: () => void;
  position: [number, number, number];
}) {
  const [showText, setShowText] = useState(false);

  const { animatedPosition } = useSpring({
    animatedPosition: position,
    config: { mass: 1, tension: 170, friction: 26, precision: 0.0001 },
  });

  return (
    <animated.group
      position={animatedPosition}
      onPointerEnter={() => setShowText(true)}
      onPointerLeave={() => setShowText(false)}
      onClick={onClick}
    >
      <mesh>
        <sphereGeometry args={[node.normalizedVal, 16, 16]} />
        <meshBasicMaterial color={node.color || "skyblue"} />
      </mesh>

      {/* We need to see where this nodes points to */}
      {/* <Text
        position={[0, node.normalizedVal + 2, 0]}
        fontSize={4}
        color={node.color || "white"}
        anchorX="center"
        anchorY="middle"
      >
        Points to: {node.}
      </Text> */}

      {/* {showText && ( */}
      <Text
        position={toPosition({
          positionOut: 1.2,
          positionTop: 1,
        })}
        fontSize={0.3}
        color={node.color || "white"}
        anchorX="center"
        anchorY="middle"
      >
        {node.name}
      </Text>
      {/* )} */}
    </animated.group>
  );
}

function LinkLine({ link }: { link: Link }) {
  const sourceNode = link.source as Node;
  const targetNode = link.target as Node;

  const positions = new Float32Array([
    sourceNode.position[0],
    sourceNode.position[1],
    sourceNode.position[2],
    targetNode.position[0],
    targetNode.position[1],
    targetNode.position[2],
  ]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
          count={2}
        />
      </bufferGeometry>
      <lineBasicMaterial color={link.color || "gray"} />
    </line>
  );
}
