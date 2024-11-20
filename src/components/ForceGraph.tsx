import { useEffect, useState, useRef } from "react";
import data from "../../assets/new_data.json";
import { LinkMesh, NodeMesh, TagEnum } from "../types";
import { GraphLink } from "./Link";
import { Node } from "./Node";
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from "d3-force";
import { drag } from "d3-drag";
import { selectAll } from "d3-selection";

type GraphData = {
  nodes: NodeMesh[];
  links: LinkMesh[];
};

/**
 * After different attempts with varied libraries to build a force-directed graph,`d3-force` was the most suitable for this project.
 * `three-forcegraph`: relies on three.js rendering, what causes conflicts with events from R3F
 */
export function ForceGraph() {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const graphRef = useRef<GraphData>({ nodes: [], links: [] });
=
  useEffect(() => {
    const nodes: NodeMesh[] = data.nodes.map((n) => ({
      ...n,
      tag_type: n.tag_type as TagEnum,
      z: Math.random() * 1000,
    }));
    const links: LinkMesh[] = data.links.map((l) => ({ ...l }));

    graphRef.current = { nodes, links };
    setGraph(graphRef.current);

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink<NodeMesh, LinkMesh>(links)
          .id((d) => d.id)
          .distance(50)
      )
      .force("charge", forceManyBody().strength(-300))
      .force("center", forceCenter(0, 0))
      .force("z", forceManyBody().strength(-10))
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

  const updateNodePosition = (nodeId: number, x: number, y: number) => {
    console.log("nodeId", nodeId);
    if (!graphRef.current) {
      return;
    }

    const node = graphRef.current.nodes.find((n) => n.id === nodeId);

    if (node) {
      node.fx = x;
      node.fy = y;
      graphRef.current.alphaTarget(0.3).restart();
    }
    console.log("node", node);
  };

  return (
    <group scale={0.01}>
      {graph?.links.map((link, idx) => <GraphLink key={idx} link={link} />)}

      {graph?.nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          position={[node.x ?? 0, node.y ?? 0, node.z ?? 0]}
          onDrag={(nodeId, x, y) => updateNodePosition(nodeId, x, y)}
        />
      ))}
    </group>
  );
}
