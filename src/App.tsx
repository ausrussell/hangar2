// import { createRoot } from 'react-dom/client'
import { Canvas } from "@react-three/fiber";

function App() {
  return (
      <Canvas>
        <mesh>
          <ambientLight intensity={0.1} />
          <directionalLight color="red" position={[0, 0, 5]} />
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
  );
}

export default App;

// if(document.getElementById('root') !== null) { createRoot(document.getElementById('root')).render(<App />)}
