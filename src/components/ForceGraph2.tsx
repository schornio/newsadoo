import { useEffect, useState, useRef } from "react";
import * as d3 from "d3-force";
import data from "../../assets/new_data.json";
import { getNodeSize } from "../utils/getNodeSize";
import { Line } from "@react-three/drei";
import { getLinkColor } from "../utils/getLinkColor";
import { LinkMesh, NodeMesh, TagEnum } from "../types";
import { isNodeMesh } from "../utils/isNodeMesh";

type GraphData = {
  nodes: NodeMesh[];
  links: LinkMesh[];
};

export function ForceGraph2() {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const graphRef = useRef<GraphData>({ nodes: [], links: [] });

  useEffect(() => {
    const nodes: NodeMesh[] = data.nodes.map((n) => ({
      ...n,
      tag_type: n.tag_type as TagEnum,
      z: Math.random() * 1000,
    }));
    const links: LinkMesh[] = data.links.map((l) => ({ ...l }));

    graphRef.current = { nodes, links };
    setGraph(graphRef.current);

    // Initialize simulation if it doesn't exist
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeMesh, LinkMesh>(links)
          .id((d) => d.id)
          .distance(50)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(0, 0))
      .force("z", d3.forceManyBody().strength(-10))
      .on("tick", () => {
        if (graphRef.current) {
          graphRef.current.nodes = nodes.map((n) => ({ ...n }));
          graphRef.current.links = links.map((l) => ({ ...l }));
        }
      });

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <group scale={0.01}>
      {graph?.links.map((link, idx) => {
        const source = isNodeMesh(link.source) ? link.source : null;
        const target = isNodeMesh(link.target) ? link.target : null;

        return (
          <Line
            key={idx}
            points={[
              [source?.x || 0, source?.y || 0, source?.z || 0],
              [target?.x || 0, target?.y || 0, target?.z || 0],
            ]}
            color={getLinkColor(link.weight)}
            lineWidth={0.3}
          />
        );
      })}

      {graph?.nodes.map((node) => {
        return (
          <mesh
            key={node.id}
            position={[node.x || 0, node.y || 0, node.z || 0]}
            onPointerDown={(e) => console.log("pointer down e", e)}
          >
            <sphereGeometry args={[getNodeSize(node.val), 32, 32]} />
            <meshStandardMaterial color="white" />
          </mesh>
        );
      })}
    </group>
  );
}
