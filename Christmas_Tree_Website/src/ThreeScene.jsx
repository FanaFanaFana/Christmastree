import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Sky } from "@react-three/drei";
import * as THREE from "three";

// Component for the Christmas tree
const ChristmasTree = () => {
  const { scene } = useGLTF("/christmas_tree.glb");

  useEffect(() => {
    if (scene) {
      console.log("Christmas Tree loaded successfully!");
    }
  }, [scene]);

  if (!scene) return null;

  return <primitive object={scene} />;
};

// Component for a single decoration
const Decoration = ({ position, onClick, day, isClickable }) => {
  const { scene: originalScene } = useGLTF("/christmas_deko.glb");
  const [scene, setScene] = useState(null);

  useEffect(() => {
    if (originalScene) {
      // Clone the original scene to ensure a unique instance
      const clonedScene = originalScene.clone();

      // Traverse each mesh in the decoration and assign unique colors
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone(); // Clone material for uniqueness
          child.material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
        }
      });

      setScene(clonedScene);
    }
  }, [originalScene]);

  if (!scene) return null;

  const handleClick = () => {
    if (isClickable) {
      onClick(day);
    }
  };

  return <primitive object={scene} position={position} onClick={handleClick} />;
};

// Snowfall particle system with snowflake.glb model
const Snowfall = () => {
  const snowflakeRef = useRef();
  const particleCount = 350;
  const { scene: snowflakeModel } = useGLTF("/snowflake.glb");

  if (!snowflakeModel) return null;

  // Initialize particle positions and rotations
  const positions = Array.from({ length: particleCount }, () => ({
    x: (Math.random() - 0.5) * 150,
    y: Math.random() * 150,
    z: (Math.random() - 0.5) * 150,
  }));

  // Random rotations for each snowflake
  const rotations = Array.from({ length: particleCount }, () => ({
    x: Math.random() * Math.PI, // Random X rotation
    y: Math.random() * Math.PI, // Random Y rotation
    z: Math.random() * Math.PI, // Random Z rotation
  }));

  useFrame(() => {
    if (snowflakeRef.current) {
      positions.forEach((particle, i) => {
        // Update particle position (falling effect)
        particle.y -= 0.05;
        if (particle.y < -10) particle.y = 50; // Reset to top if below screen

        // Apply rotation and set new position
        snowflakeRef.current.children[i].position.set(particle.x, particle.y, particle.z);
        snowflakeRef.current.children[i].rotation.set(
          rotations[i].x + Math.random() * 0.01, // Apply small random fluctuation to rotations
          rotations[i].y + Math.random() * 0.01,
          rotations[i].z + Math.random() * 0.01
        );
      });
    }
  });

  return (
    <group ref={snowflakeRef}>
      {positions.map((position, index) => (
        <mesh key={index} position={[position.x, position.y, position.z]}>
          <primitive object={snowflakeModel.clone()} />
        </mesh>
      ))}
    </group>
  );
};

// Main scene component
const ChristmasScene = () => {
  const [clickedDay, setClickedDay] = useState(null);
  const [gameStarted, setGameStarted] = useState(false); // State to track if the game is started
  const images = ["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"]; // Add paths for all 24 images

  // Decoration positions
  const decorations = [
    { id: 1, position: [5, 20, 0] },
    { id: 2, position: [-5, 20, 0] },
    { id: 3, position: [5, 10, 0] },
    { id: 4, position: [-5, 10, 0] },
    { id: 5, position: [2, 25, 0] },
    { id: 6, position: [-2, 22, 0] },
    { id: 7, position: [5, 5, 0] },
    { id: 8, position: [-5, 5, 0] },
    { id: 9, position: [5, 20, 5] },
    { id: 10, position: [-5, 10, 5] },
    { id: 11, position: [3, 15, 8] },
    { id: 12, position: [5, 25, 2] },
    { id: 13, position: [-5, 15, -2] },
    { id: 14, position: [2, 12, 2] },
    { id: 15, position: [-2, 28, -2] },
    { id: 16, position: [-2, 12, -5] },
    { id: 17, position: [-2, 10, -7] },
    { id: 18, position: [5, 10, -7] },
    { id: 19, position: [8, 10, -2] },
    { id: 20, position: [-2, 19, -7] },
    { id: 21, position: [3, 15, -7] },
    { id: 22, position: [-2, 25, 3] },
    { id: 23, position: [0, 14, 8] },
    { id: 24, position: [-2, 25, -4] },
  ];

  const currentDay = new Date().getDate();

  const handleStart = () => {
    setGameStarted(true); // Start the game and show the world
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {!gameStarted ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <button
            onClick={handleStart}
            style={{
              padding: "20px",
              fontSize: "24px",
              backgroundColor: "#FF6347",
              border: "none",
              color: "white",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Start
          </button>
          <div style={{ marginTop: "20px", fontSize: "18px", color: "#FF6347" }}>
            Finde die richtige Weihnachtsbaumkugel
          </div>
        </div>
      ) : (
        <Canvas
          camera={{
            position: [50, 40, 50],
            fov: 50,
          }}
        >
          <Snowfall />
          <Sky sunPosition={[200, 20, 100]} turbidity={8} rayleigh={20} mieCoefficient={0.5} mieDirectionalG={0.5} />
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} intensity={3} />

          <ChristmasTree />
          {decorations.map((deko) => (
            <Decoration
              key={deko.id}
              position={deko.position}
              day={deko.id}
              onClick={setClickedDay}
              isClickable={deko.id === currentDay} // Only decoration for current day clickable
            />
          ))}

          <OrbitControls enableZoom={false} enableRotate={true} enablePan={false} />
        </Canvas>
      )}

      {clickedDay !== null && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            zIndex: 10,
          }}
          onClick={() => setClickedDay(null)}
        >
          <img
            src={images[clickedDay - 1]}
            alt={`Decoration ${clickedDay}`}
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}
    </div>
  );
};

export default ChristmasScene;
