import { useEffect, useState } from "react";
import jsonData from "../assets/new_data.json";
import { Canvas } from "@react-three/fiber";
import { Environment, Line, OrbitControls } from "@react-three/drei";
import { createXRStore, XR } from "@react-three/xr";
import { Node } from "./components/Node";
import { getConnectedNodes } from "./utils/getConnectedNodes";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from "d3-force";
import { LinkMesh, NodeMesh } from "./types";

const store = createXRStore({
  hand: {
    rayPointer: {
      rayModel: { maxLength: 100, opacity: 0.02 },
    },
  },
  foveation: 0.3,
});

export default function App() {
  const [nodes, setNodes] = useState<NodeMesh[] | null>(null);
  const [links, setLinks] = useState<LinkMesh[] | null>(null);
  const [currentNode, setCurrentNode] = useState<NodeMesh | null>(null);

  const [simulationNodes, setSimulationNodes] = useState<NodeMesh[] | null>(
    null
  );
  const [simulationLinks, setSimulationLinks] = useState<LinkMesh[] | null>(
    null
  );

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
          .id((d: LinkMesh) => d.id)
          .distance((d) => {
            return 10 + 2 * d.weight;
          })
      )
      .force("charge", forceManyBody().strength(50))
      .force("center", forceCenter(0, 0));

    simulation.on("tick", () => {
      setSimulationNodes([...simulationDataNodes]);
      setSimulationLinks([...simulationDataLinks]);
    });

    setTimeout(() => {
      simulation.stop();
    }, 300);

    // Cleanup the simulation on unmount
    return () => {
      simulation.stop();
    };
  }, [currentNode, nodes, links]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <button
        onClick={() => store.enterAR()}
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        Enter AR
      </button>

      {/* <pre>{JSON.stringify(simulationLinks, null, 2)}</pre> */}

      <Canvas
        style={{
          height: "50vh",
          width: "50vw",
        }}
      >
        <XR store={store}>
          <OrbitControls />

          {/* <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="blue" />
          </mesh> */}

          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <group position={[0, 0, 0]}>
            {simulationNodes &&
              simulationNodes.map((node, index) => (
                <Node
                  key={node.id}
                  node={node}
                  position={[node.x ?? 0, node.y ?? 0, -10 + index * 2]}
                  onClick={() => {
                    console.log(`clicking node: ${node.name}`);
                    setCurrentNode(node);
                  }}
                />
              ))}

            {/* {simulationLinks &&
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
                      points={[10,10,10]}
                      color="gray"
                      lineWidth={10}
                    />
                  );
                }
                return null;
              })} */}
          </group>
        </XR>
      </Canvas>
    </div>
  );
}
