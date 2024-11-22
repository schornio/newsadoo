import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { createXRStore, XR } from "@react-three/xr";
import { ForceGraph } from "./components/ForceGraph";
import { toPosition } from "./utils/toPosition";
import { textSizeVR } from "./constants/textSizeVR";
import { useViewStore } from "./store/useViewStore";
import data from "../assets/new_data.json";
import { Node } from "./components/Node";
import { NodeMesh } from "./types";
import { useState } from "react";

const store = createXRStore({
  hand: {
    rayPointer: {
      rayModel: { maxLength: 200, opacity: 0.2 },
    },
  },
  foveation: 0.3,
});

export default function App() {
  // const viewMode = useViewStore((state) => state.viewMode);
  // const setViewMode = useViewStore((state) => state.setViewMode);
  const currentNodeId = useViewStore((state) => state.currentNodeId);
  const currentNode: NodeMesh | undefined = data.nodes.find(
    (n) => n.id === currentNodeId
  );

  const [currentNodePosition, setCurrentNodePosition] = useState({
    x: 0,
    y: 1,
    z: -1,
  });

  function onDragNode(x: number, y: number, z: number) {
    setCurrentNodePosition({
      x,
      y,
      z,
    });
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <button
        onClick={() => store.enterVR()}
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        Enter VR
      </button>

      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <XR store={store}>
          <group
            position={toPosition({
              positionIn: 0.5,
              positionTop: 1,
            })}
          >
            <Text
              fontSize={textSizeVR.xs}
              position={toPosition({
                positionBottom: 0.5,
              })}
            >
              current node: {currentNodeId}
            </Text>
          </group>

          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <ForceGraph />

          {currentNode && (
            <Node
              node={currentNode}
              position={[
                currentNodePosition.x,
                currentNodePosition.y,
                currentNodePosition.z,
              ]}
              onDrag={onDragNode}
            />
          )}
        </XR>
      </Canvas>
    </div>
  );
}
