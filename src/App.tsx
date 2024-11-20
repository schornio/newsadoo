import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { createXRStore, XR } from "@react-three/xr";
import { ForceGraph } from "./components/ForceGraph";

const store = createXRStore({
  hand: {
    rayPointer: {
      rayModel: { maxLength: 200, opacity: 0.02 },
    },
  },
  foveation: 0.3,
});

export default function App() {
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
          {/* <OrbitControls /> */}

          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <ForceGraph />
        </XR>
      </Canvas>
    </div>
  );
}
