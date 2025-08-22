"use client";
import { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { Group } from "three";

// Chrome Browser Component for MacBook Screen
function ChromeBrowser() {
  return (
    <Html
      position={[0, 0.06, 0.04]} // Fine-tuned position for screen center
      rotation={[-Math.PI / 2.1, 0, 0]} // Slightly adjusted rotation
      scale={[0.002, 0.002, 0.002]} // Even smaller to fit screen bounds
      transform
      occlude
      distanceFactor={1}
      style={{
        width: "500px",
        height: "350px",
        background: "#f1f3f4",
        borderRadius: "6px",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        transformOrigin: "center center",
        userSelect: "none",
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        {/* Chrome Header */}
        <div
          style={{
            background: "#e8eaed",
            height: "40px",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            borderBottom: "1px solid #dadce0",
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: "8px", marginRight: "12px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#ff5f57",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#ffbd2e",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#28ca42",
              }}
            />
          </div>

          {/* Address bar */}
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: "20px",
              padding: "8px 16px",
              border: "1px solid #dadce0",
              fontSize: "14px",
              color: "#202124",
            }}
          >
            localhost:3000
          </div>
        </div>

        {/* Browser Content */}
        <div
          style={{
            height: "calc(100% - 40px)",
            background: "white",
            padding: "20px",
            overflow: "hidden",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#202124",
                margin: "0 0 10px 0",
              }}
            >
              Suresh Kumar Mukhiya, PhD
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "#5f6368",
                margin: "0",
                lineHeight: "1.4",
              }}
            >
              Welcome to my digital workspace
            </p>
          </div>

          {/* Simulated content */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div
              style={{
                width: "80px",
                height: "60px",
                background: "#4285f4",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                width: "80px",
                height: "60px",
                background: "#34a853",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                width: "80px",
                height: "60px",
                background: "#fbbc04",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>
      </div>
    </Html>
  );
}

// MacBook Pro Component with GLB Model - Initially Open
function MacBookPro() {
  const gltf = useGLTF("/mb2.glb");
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    if (gltf.scene) {
      console.log("MacBook scene loaded");

      // Based on the Codrops article, look for common MacBook screen names
      const commonScreenNames = [
        "Bevels_2",
        "MacBook_Screen",
        "Screen",
        "Lid",
        "Top",
      ];

      gltf.scene.traverse((child) => {
        // Log all named components
        if (child.name) {
          console.log("Component:", child.name);
        }

        // Try to find the screen component by common names
        if (commonScreenNames.includes(child.name)) {
          console.log("Found MacBook screen:", child.name);
          // Set to open position facing the user (perpendicular to base)
          child.rotation.x = -Math.PI * 0.5; // 90 degrees - screen facing user
        }

        // Also try partial matches
        if (
          child.name &&
          (child.name.toLowerCase().includes("bevels") ||
            child.name.toLowerCase().includes("screen") ||
            child.name.toLowerCase().includes("lid"))
        ) {
          console.log("Found potential screen component:", child.name);
          child.rotation.x = -Math.PI * 0.5; // 90 degrees - screen facing user
        }
      });
    }
  }, [gltf.scene]);

  return (
    <group
      ref={groupRef}
      position={[0, -8, 0]}
      rotation={[0.1, 1.6, -0.6]}
      scale={[60, 60, 60]}
    >
      <primitive object={gltf.scene} />
      {/* Chrome Browser on the screen */}
      <ChromeBrowser />
    </group>
  );
}

// Preload the model
useGLTF.preload("/mb2.glb");

// Main Scene Component
function WorkspaceScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={0.3} />

      {/* Scene Objects */}
      <MacBookPro />

      {/* Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        target={[0, 0, 0]}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
}

// Main Component Export
const HomePageClient = () => {
  return (
    <main className="h-screen w-full">
      <Canvas
        camera={{ position: [0, 5, 8], fov: 50 }}
        shadows
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <WorkspaceScene />
        </Suspense>
      </Canvas>
    </main>
  );
};

export default HomePageClient;
