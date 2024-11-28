import { useEffect, useState, useRef } from "react";
import data from "../../assets/new_data.json";
import { LinkMesh, NodeMesh } from "../types";
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

type GraphData = {
  nodes: NodeMesh[];
  links: LinkMesh[];
};

const DEPTH_GRAPH = 20;
const LINK_DISTANCE = 1;
const NODES_XY_ATTRACTION = 20; //-30 default. Positive value: attraction, negative: repulsion
const NODES_Z_ATTRACTION = 10;

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
      z: Math.random() * DEPTH_GRAPH,
    }));
    const links: LinkMesh[] = data.links.map((l) => ({ ...l }));

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink<NodeMesh, LinkMesh>(links)
          .id((d) => d.id)
          .distance(LINK_DISTANCE)
      )
      .force("charge", forceManyBody().strength(NODES_XY_ATTRACTION))
      .force("center", forceCenter(0, 0))
      .force("z", forceManyBody().strength(NODES_Z_ATTRACTION))
      .alpha(1)
      .alphaDecay(0);

    // run 300 iteration to stabilize graph
    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }

    simulation.stop();

    setGraph({ nodes: [...nodes], links: [...links] });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, []);

  // to improve
  // function calculateRotation(node: NodeMesh): [number, number, number] {
  //   const dx = -(node.x ?? 0); // Node pointing to [0,0,0]
  //   const dy = -(node.y ?? 0);
  //   const dz = -(node.z ?? 0);

  //   // Calculate spherical angles
  //   const theta = Math.atan2(dy, dz); // Rotation around X (up-down tilt)
  //   const phi = Math.atan2(dx, dz); // Rotation around Y (left-right tilt)

  //   return [theta, phi, 0]; // Rotation for the node
  // }

  return (
    <group position={toPosition({ positionIn: DEPTH_GRAPH + 3 })}>
      {graph?.links.map((link, idx) => <GraphLink key={idx} link={link} />)}

      {graph?.nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          position={[node.x ?? 0, node.y ?? 0, node.z ?? 0]}
          // rotation={calculateRotation(node)}
        />
      ))}
    </group>
  );
}
