import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { createXRStore, XR } from "@react-three/xr";
import { ForceGraph } from "./components/ForceGraph";
import { toPosition } from "./utils/toPosition";
import { textSizeVR } from "./constants/textSizeVR";
import { useViewStore } from "./store/useViewStore";

const store = createXRStore({
  hand: {
    rayPointer: {
      rayModel: { maxLength: 200, opacity: 0.2 },
    },
  },
  foveation: 0.3,
});

export default function App() {
  const viewMode = useViewStore((state) => state.viewMode);
  const setViewMode = useViewStore((state) => state.setViewMode);
  const currentNodeId = useViewStore((state) => state.currentNodeId);

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
              position={toPosition({ positionIn: 1 })}
              fontSize={textSizeVR.sm}
            >
              {viewMode === "graph" ? "Graph" : "Read mode"}
            </Text>

            <Text fontSize={textSizeVR.xs}>change visualization</Text>
            <mesh
              position={toPosition({
                positionBottom: 0.2,
              })}
              onPointerEnter={() =>
                setViewMode(viewMode === "graph" ? "read" : "graph")
              }
            >
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshBasicMaterial color="blue" />
            </mesh>

            <Text
              fontSize={textSizeVR.xs}
              position={toPosition({
                positionBottom: 0.5,
              })}
            >
              current node: {currentNodeId}
            </Text>
          </group>

          <OrbitControls enableRotate enablePan />

          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <ForceGraph />
        </XR>
      </Canvas>
    </div>
  );
}
