import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Text } from "@react-three/drei";
import { useEffect, useState } from "react";
import { XR, createXRStore } from "@react-three/xr";
import * as THREE from "three";
import jsonData from "../assets/top30_nouns.json";
import { Stats } from "@react-three/drei";
import {
  normalizeLinkSize,
  normalizeNodeSize,
  setNodeColor,
} from "./utils/graph";

const store = createXRStore({
  hand: {
    rayPointer: {
      rayModel: { maxLength: 40, opacity: 0.02 },
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
  x?: number;
  y?: number;
  z?: number;
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

  useEffect(() => {
    let data = JSON.parse(JSON.stringify(jsonData)) as {
      nodes: Node[];
      links: Link[];
    };

    // Data Processing
    data = normalizeNodeSize(data);
    data = normalizeLinkSize(data);
    data = setNodeColor(data);

    // Initialize node positions only once
    data.nodes.forEach((node) => {
      node.x = Math.random() * 200 - 100;
      node.y = Math.random() * 200 - 100;
      node.z = Math.random() * 200 - 100;
    });

    // Map link source/target IDs to actual Node objects
    data.links.forEach((link) => {
      const sourceNode = data.nodes.find((n) => n.id === link.source);
      const targetNode = data.nodes.find((n) => n.id === link.target);

      if (sourceNode && targetNode) {
        link.source = sourceNode; // Replace ID with actual Node object
        link.target = targetNode; // Replace ID with actual Node object
      }
    });

    setNodes(data.nodes);
    setLinks(data.links);
  }, []);

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

      <Stats />
      <Canvas camera={{ position: [0, 0, 200], fov: 75 }}>
        <XR store={store}>
          <OrbitControls />
          <Environment preset="sunset" background />

          <group scale={0.01} position={[0, 1, -2]}>
            {/* Render Links */}
            {links.length > 0 &&
              links.map((link, index) => <LinkLine key={index} link={link} />)}

            {/* Render Nodes */}
            {nodes.length > 0 &&
              nodes.map((node) => <NodeMesh key={node.id} node={node} />)}
          </group>

          {/* Axes Helper */}
          <axesHelper args={[50]} />
        </XR>
      </Canvas>
    </div>
  );
}

function NodeMesh({ node }: { node: Node }) {
  const [showText, setShowText] = useState(false);

  return (
    <group
      position={[node.x || 0, node.y || 0, node.z || 0]}
      onPointerEnter={() => setShowText(true)}
      onPointerLeave={() => setShowText(false)}
    >
      <mesh>
        <sphereGeometry args={[node.normalizedVal, 16, 16]} />
        <meshBasicMaterial color={node.color || "skyblue"} />
      </mesh>

      {showText && (
        <Text
          position={[0, node.normalizedVal + 2, 0]}
          fontSize={4}
          color={node.color || "white"}
          anchorX="center"
          anchorY="middle"
        >
          {node.name}
        </Text>
      )}
    </group>
  );
}

function LinkLine({ link }: { link: Link }) {
  const sourceNode = link.source as Node;
  const targetNode = link.target as Node;

  // Ensure that the position array is created correctly
  const positions = new Float32Array([
    sourceNode.x || 0,
    sourceNode.y || 0,
    sourceNode.z || 0,
    targetNode.x || 0,
    targetNode.y || 0,
    targetNode.z || 0,
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
      <lineBasicMaterial
        color={link.color || "gray"} // Removed 'linewidth' as it is not supported
      />
    </line>
  );
}
