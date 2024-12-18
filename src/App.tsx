import { Canvas } from "@react-three/fiber";
import { createXRStore, XR } from "@react-three/xr";
import { ForceGraph } from "./components/ForceGraph";
import { Cylinder, Sky } from "@react-three/drei";

const store = createXRStore({});

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
          <ambientLight intensity={0.5} />
          <Cylinder args={[1, 1, 2]} position={[0, -1.5, 0]}>
            <meshStandardMaterial color="yellow" />
          </Cylinder>
          <directionalLight position={[10, 10, 5]} intensity={10} />

          <ForceGraph />

          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
        </XR>
      </Canvas>
    </div>
  );
}
