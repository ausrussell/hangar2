// import { createRoot } from 'react-dom/client'
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import {
  useCursor,
  MeshPortalMaterial,
  CameraControls,
  Gltf,
  Text,
  Preload,
  PortalProps,
} from "@react-three/drei";
import { useRoute, useLocation } from "wouter";
import { easing, geometry } from "maath";
import { suspend } from "suspend-react";
// import { OrbitControls } from '@react-three/drei';
// import { Material, Mesh } from 'three'
extend(geometry);
type FrameProps = {
  id: string;
  name: string;
  author?: string;
  bg: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  position?: [number, number, number];
  rotation?: number[];
};

// export type PortalProps = JSX.IntrinsicElements['shaderMaterial'] & {
//   /** Mix the portals own scene with the world scene, 0 = world scene render,
//    *  0.5 = both scenes render, 1 = portal scene renders, defaults to 0 */
//   blend?: number
//   /** Edge fade blur, 0 = no blur (default) */
//   blur?: number
//   /** SDF resolution, the smaller the faster is the start-up time (default: 512) */
//   resolution?: number
//   /** By default portals use relative coordinates, contents are affects by the local matrix transform */
//   worldUnits?: boolean
//   /** Optional event priority, defaults to 0 */
//   eventPriority?: number
//   /** Optional render priority, defaults to 0 */
//   renderPriority?: number
//   /** Optionally diable events inside the portal, defaults to false */
//   events?: boolean
// }

declare module "*.woff";
declare module "*.woff2";
const regular = import("./assets/Inter-VariableFont_opsz,wght.ttf");
const medium = import("./assets/Inter-VariableFont_opsz,wght.ttf");
export const App = () => {
  console.log("App")
  // if (document.getElementById("root")) return;
  console.log("App after");
  return (
    <Canvas
      flat
      camera={{ fov: 75, position: [0, 0, 20] }}
      eventSource={document.getElementById("root")!}
      eventPrefix="client"
    >
      <color attach="background" args={["#f0f0f0"]} />
      <Frame
        id="01"
        name={`pick\nles`}
        author="Omar Faruq Tawsif"
        bg="#e4cdac"
        position={[-1.15, 0, 0]}
        rotation={[0, 0.5, 0]}
      >
        <Gltf
          src="pickles_3d_version_of_hyuna_lees_illustration-transformed.glb"
          scale={8}
          position={[0, -0.7, -2]}
        />
      </Frame>
      <Frame id="02" name="tea" author="Omar Faruq Tawsif" bg="#e4cdac">
        <Gltf src="fiesta_tea-transformed.glb" position={[0, -2, -3]} />
      </Frame>
      <Frame
        id="03"
        name="still"
        author="Omar Faruq Tawsif"
        bg="#d1d1ca"
        position={[1.15, 0, 0]}
        rotation={[0, -0.5, 0]}
      >
        <Gltf
          src="still_life_based_on_heathers_artwork-transformed.glb"
          scale={2}
          position={[0, -0.8, -4]}
        />
      </Frame>
      <Rig />
      <Preload all />
    </Canvas>
  );
};

// const style

//! typescript errors following
//https://codesandbox.io/p/sandbox/9m4tpc?file=%2Fsrc%2FApp.js%3A1%2C1-1%2C31
function Frame({
  id,
  name,
  author,
  bg,
  width = 1,
  height = 1.61803398875,
  children,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ...props
}: FrameProps) {
  const portal = useRef<PortalProps | null>(null!);
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);

  const loadedFont = (desiredFont: any) => {
    return suspend(
      async (desiredFont) => {
        // Fetch data from an API or perform an asynchronous operation
        const response: any = await fetch(desiredFont);
        return response.default;
      },
      [desiredFont]
    );
  };

  useCursor(hovered);
  useFrame(
    (state, dt) =>
      portal?.current &&
      easing.damp(portal.current, "blend", params?.id === id ? 1 : 0, 0.2, dt)
  );
  console.log("Frame",Frame)
  return (
    <group {...props}>
      <Text
        font={loadedFont(medium)}
        fontSize={0.3}
        anchorY="top"
        anchorX="left"
        lineHeight={0.8}
        position={[-0.375, 0.715, 0.01]}
        material-toneMapped={false}
      >
        {name}
      </Text>
      <Text
        font={loadedFont(regular)}
        fontSize={0.1}
        anchorX="right"
        position={[0.4, -0.659, 0.01]}
        material-toneMapped={false}
      >
        /{id}
      </Text>
      <Text
        font={loadedFont(regular)}
        fontSize={0.04}
        anchorX="right"
        position={[0.0, -0.677, 0.01]}
        material-toneMapped={false}
      >
        {author}
      </Text>
      <mesh
        name={id}
        onDoubleClick={(e) => (
          e.stopPropagation(), setLocation("/item/" + e.object.name)
        )}
        onPointerOver={(e) => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <boxGeometry args={[width, height, 0.1]} />
        {/* <roundedPlaneGeometry args={[width, height, 0.1]} /> */}
        <MeshPortalMaterial
          // ref={portal}
          events={params?.id === id}
          side={THREE.DoubleSide}
        >
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}
function Rig({
  position = new THREE.Vector3(0, 0, 2),
  focus = new THREE.Vector3(0, 0, 0),
}) {
  const { controls, scene } = useThree();
  const [, params] = useRoute("/item/:id");
  console.log("controls", controls);

  useEffect(() => {
    if (!params?.id) return;

    const active = scene.getObjectByName(params?.id);
    if (active?.parent) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25));
      active.parent.localToWorld(focus.set(0, 0, -2));
    }

    console.log("controls", controls);

    // Use a type assertion with unknown
    // (controls as typeof OrbitControls)?.setLookAt(...position.toArray(), ...focus.toArray(), true)
    // (controls as unknown as typeof OrbitControls)?.setLookAt(
    //   ...position.toArray(),
    //   new THREE.Vector3(...focus.toArray()),
    //   true
    // );
  }, [params, scene, position, focus]);

  return (
    <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
  );
}
