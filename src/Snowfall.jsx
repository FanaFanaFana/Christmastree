import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

// Snowfall particle system with snowflake.glb model
const Snowfall = () => {
    const snowflakeRef = useRef();
    const particleCount = 500; // Number of snowflakes
    const { scene: snowflakeModel } = useGLTF("/snowflake.glb"); // Load snowflake model
    
    // Randomized positions for each snowflake, expanded spawn area
    const positions = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 150, // Increase X range from -20 to 20 to -40 to 40
      y: Math.random() * 150,         // Increase Y range to give more vertical space
      z: (Math.random() - 0.5) * 150, // Increase Z range from -20 to 20 to -40 to 40
    }));
  
    // Randomized rotations for each snowflake
    const rotations = Array.from({ length: particleCount }, () => ({
      x: Math.random() * Math.PI * 2,  // Random rotation around the X-axis (0 to 2π)
      y: Math.random() * Math.PI * 2,  // Random rotation around the Y-axis (0 to 2π)
      z: Math.random() * Math.PI * 2,  // Random rotation around the Z-axis (0 to 2π)
    }));
  
    // Animate the snowflakes
    useFrame(() => {
      if (snowflakeRef.current) {
        positions.forEach((particle, i) => {
          // Move down
          particle.y -= 0.05;
          if (particle.y < -10) particle.y = 50; // Reset to top if snowflake goes below the scene
  
          // Update position and rotation
          const rotation = rotations[i];
          snowflakeRef.current.children[i].position.set(particle.x, particle.y, particle.z);
          snowflakeRef.current.children[i].rotation.set(rotation.x, rotation.y, rotation.z);
        });
      }
    });
  
    return (
      <group ref={snowflakeRef}>
        {/* Create multiple snowflakes from the loaded model */}
        {positions.map((position, index) => (
          <mesh key={index} position={[position.x, position.y, position.z]}>
            <primitive object={snowflakeModel.clone()} />
          </mesh>
        ))}
      </group>
    );
  };