import { useEffect, useRef, useState } from "react";
import jsonData from "../../assets/new_data.json";
import { LinkMesh, NodeMesh } from "../types";
import { getConnectedNodes } from "../utils/getConnectedNodes";
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from "d3-force";
import { Node } from "./Node";
import { Line } from "@react-three/drei";

export function ForceGraph() {
  const [nodes, setNodes] = useState<NodeMesh[] | null>(null);
  const [links, setLinks] = useState<LinkMesh[] | null>(null);
  const [currentNode, setCurrentNode] = useState<NodeMesh | null>(null);
  const [simulationNodes, setSimulationNodes] = useState<NodeMesh[] | null>(
    null
  );
  const [simulationLinks, setSimulationLinks] = useState<LinkMesh[] | null>(
    null
  );
  const groupRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(JSON.stringify(jsonData));
    setNodes(data.nodes);
    setLinks(data.links);
    if (data.nodes.length > 0) {
      setCurrentNode(data.nodes[0]);
    }
  }, []);

  useEffect(() => {
    if (!currentNode || !nodes || !links) {
      return undefined;
    }

    const connectedNodes = getConnectedNodes({
      links,
      currentNode,
      nodes,
    });

    const simulationDataNodes = [currentNode, ...connectedNodes];
    const simulationDataLinks = links.filter(
      (link) =>
        simulationDataNodes.find((node) => node.id === link.source) &&
        simulationDataNodes.find((node) => node.id === link.target)
    );

    const simulation = forceSimulation(simulationDataNodes)
      .force(
        "link",
        forceLink(simulationDataLinks)
          .id((d) => d.id)
          .distance((d) => 10 + 2 * d.weight)
      )
      .force("charge", forceManyBody().strength(50))
      .force("center", forceCenter(0, 0));

    simulation.on("tick", () => {
      setSimulationNodes([...simulationDataNodes]);
      setSimulationLinks([...simulationDataLinks]);
    });

    setTimeout(() => simulation.stop(), 300);

    return () => {
      simulation.stop();
    };
  }, [currentNode, nodes, links]);

  return (
    <group ref={groupRef}>
      {simulationNodes &&
        simulationNodes.map((node, index) => (
          <Node
            key={node.id}
            node={node}
            position={[node.x ?? 0, node.y ?? 0, -10 + index * 2]}
            onClick={() => setCurrentNode(node)}
          />
        ))}

      {simulationLinks &&
        simulationLinks.map((link, index) => {
          const sourceNode = simulationNodes?.find(
            (node) => node.id === link.source
          );
          const targetNode = simulationNodes?.find(
            (node) => node.id === link.target
          );
          if (sourceNode && targetNode) {
            return (
              <Line
                key={index}
                points={[
                  [sourceNode.x ?? 0, sourceNode.y ?? 0, sourceNode.z ?? 0],
                  [targetNode.x ?? 0, targetNode.y ?? 0, targetNode.z ?? 0],
                ]}
                color="gray"
                lineWidth={10}
              />
            );
          }
          return null;
        })}
    </group>
  );
}
