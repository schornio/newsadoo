import { LinkMesh, NodeMesh } from "../types";

export function getConnectedNodes({
  links,
  currentNode,
  nodes,
}: {
  links: LinkMesh[];
  currentNode: NodeMesh | null;
  nodes: NodeMesh[];
}): NodeMesh[] {
  const connectedNodesIds = links
    .filter(
      (link) =>
        link.source === currentNode?.id || link.target === currentNode?.id
    )
    .map((link) =>
      link.source === currentNode?.id ? link.target : link.source
    );

  const connectedNodes = nodes.filter((node) =>
    connectedNodesIds.includes(node.id)
  );

  return connectedNodes;
}
