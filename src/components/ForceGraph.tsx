import { useEffect, useState, useRef } from "react";
import * as d3 from "d3-force";
import data from "../../assets/new_data.json";
import { LinkMesh, NodeMesh, TagEnum } from "../types";
import { GraphLink } from "./Link";
import { Node } from "./Node";

type GraphData = {
  nodes: NodeMesh[];
  links: LinkMesh[];
};

export function ForceGraph() {
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
      {graph?.links.map((link, idx) => <GraphLink key={idx} link={link} />)}

      {graph?.nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          position={[node.x ?? 0, node.y ?? 0, node.z ?? 0]}
        />
      ))}
    </group>
  );
}
