import data from "../../assets/new_data.json";
import {
  forceLink,
  forceManyBody,
  forceSimulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from "d3-force";

import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useState } from "react";
import { Link } from "./Link";
import { Node as NodeComponent } from "./Node";
import { NodeDetail } from "./NodeDetail";

type NodeData = (typeof data.nodes)[number] & {
  zIndex: number;
};

function toLinkKey(link: { source: Node; target: Node; index: number }) {
  return `${link.source.data.id}-${link.target.data.id}`;
}

export type Node = SimulationNodeDatum & {
  data: NodeData;
};

export function ForceGraph() {
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const { links, nodes, simulation } = useMemo(() => {
    const mutableNodes: Node[] = data.nodes.map((data) => ({
      data: { ...data, zIndex: -50 },
    }));
    const mutableLinks: SimulationLinkDatum<Node>[] = data.links.map((l) => ({
      ...l,
    }));

    const simulation = forceSimulation(mutableNodes)
      .force("charge", forceManyBody())
      .force(
        "link",
        forceLink<Node, SimulationLinkDatum<Node>>(mutableLinks).id(
          (link) => link.data.id
        )
      );

    simulation.tick();

    return {
      simulation,
      nodes: mutableNodes,
      links: mutableLinks as {
        source: Node;
        target: Node;
        index: number;
      }[],
    };
  }, []);

  useFrame(() => {
    simulation.tick();
  });

  const uniqueLinkKeys = new Set<string>();
  const uniqueLinks = links.filter((link) => {
    const key = toLinkKey(link);
    if (uniqueLinkKeys.has(key)) {
      return false;
    }
    uniqueLinkKeys.add(key);
    return true;
  });

  const onNodeClick = useCallback((node: Node) => {
    setSelectedNodeId((prev) => (prev === node.data.id ? null : node.data.id));
  }, []);

  const selectedNode = nodes.find((node) => node.data.id === selectedNodeId);

  return (
    <>
      {nodes.map((node) => (
        <NodeComponent
          key={node.data.id}
          node={node}
          onClick={onNodeClick}
          selected={selectedNodeId === node.data.id}
          simulation={simulation}
        />
      ))}

      {uniqueLinks.map((link) => (
        <Link
          key={`${link.source.data.id}-${link.target.data.id}`}
          link={link}
        />
      ))}

      {selectedNode ? (
        <NodeDetail node={selectedNode} position={[-10, 0, -1]} />
      ) : undefined}
    </>
  );
}
