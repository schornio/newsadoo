import { useEffect, useState, useRef } from "react";
import * as d3 from "d3-force";
import * as THREE from "three";
import data from "../../assets/new_data.json";
import { getNodeSize } from "../utils/getNodeSize";
import { Line } from "@react-three/drei";

type NodeMesh = {
  id: number;
  name: string;
  val: number;
  x?: number;
  y?: number;
  z?: number;
  image?: string;
};

type LinkMesh = {
  source: any; // Adjusted to work with d3
  target: any; // Adjusted to work with d3
  weight: number;
};

type GraphData = {
  nodes: NodeMesh[];
  links: LinkMesh[];
};

export function ForceGraph2() {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const simulationRef = useRef<d3.Simulation<NodeMesh, LinkMesh>>();

  useEffect(() => {
    const nodes = data.nodes.map((n) => ({
      ...n,
      z: Math.random() * 200,
    }));
    const links = data.links.map((l) => ({ ...l }));

    // Initialize simulation if it doesn't exist
    if (!simulationRef.current) {
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d: any) => d.id)
            .distance(50)
        )
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(0, 0))
        .force("z", d3.forceManyBody().strength(-10))
        .on("tick", () => {
          // Create new objects to avoid mutation
          setGraph({
            nodes: nodes.map((n) => ({ ...n })),
            links: links.map((l) => ({ ...l })),
          });
        });

      simulationRef.current = simulation;
    }

    return () => {
      simulationRef.current?.stop();
    };
  }, []);

  return (
    <group scale={0.01}>
      {graph?.links.map((link, idx) => (
        <Line
          key={idx}
          points={[
            [link.source.x || 0, link.source.y || 0, link.source.z || 0],
            [link.target.x || 0, link.target.y || 0, link.target.z || 0],
          ]}
          color="gray"
          lineWidth={0.3} // Optional, can customize line width
        />
      ))}

      {graph?.nodes.map((node) => {
        console.log("node.val", node.val);

        return (
          <mesh
            key={node.id}
            position={[node.x || 0, node.y || 0, node.z || 0]}
          >
            <sphereGeometry args={[getNodeSize(node.val), 32, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
        );
      })}
    </group>
  );
}
