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
  Simulation,
} from "d3-force";
import { toPosition } from "../utils/toPosition";
// import { drag } from "d3-drag"; // uses DOM. We're in canvas territory. So, we can't use this.
// import { selectAll } from "d3-selection";

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
  const simulationRef = useRef<Simulation<NodeMesh, LinkMesh> | null>(null);

  useEffect(() => {
    const nodes: NodeMesh[] = data.nodes.map((n) => ({
      ...n,
      tag_type: n.tag_type as TagEnum,
      z: Math.random() * 1000,
    }));
    const links: LinkMesh[] = data.links.map((l) => ({ ...l }));

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
        // if (graphRef.current) {
        //   graphRef.current.nodes = nodes.map((n) => ({ ...n }));
        //   graphRef.current.links = links.map((l) => ({ ...l }));
        // }
        setGraph({ nodes: [...nodes], links: [...links] });
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, []);

  const updateNodePosition = (nodeId: number, x: number, y: number) => {
    if (!simulationRef.current) {
      return;
    }

    // in d3-foce, the nodes property is a function that returns the array of nodes, not a property that holds the array directly
    // we need to call .nodes()
    const node = simulationRef.current.nodes().find((n) => n.id === nodeId);

    if (node) {
      node.fx = x;
      node.fy = y;
      simulationRef.current.alphaTarget(0.3).restart();
    }
  };

  return (
    <group position={toPosition({ positionIn: 500 })}>
      {graph?.links.map((link, idx) => <GraphLink key={idx} link={link} />)}

      {graph?.nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          position={[node.x ?? 0, node.y ?? 0, node.z ?? 0]}
          /* 
            onDrag={(id, x, y) => updateNodePosition(nodeId, x, y)} => we can remove the id, since it's not coming from the child component anymore
            onDrag={(x, y) => updateNodePosition(node.id, x, y)} => we can remove the id, since it's not coming from the child component anymore
            x and y come from the child, but we pass forward the node.id from the parent to the update node function
          */
          onDrag={(x, y) => {
            updateNodePosition(node.id, x, y);
          }}
        />
      ))}
    </group>
  );
}
